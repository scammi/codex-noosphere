import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { ExtractedContent } from './extraction.interface';
import { TemplateService } from './templates/template.service';

@Injectable()
export class AiExtractorService {
  private readonly logger = new Logger(AiExtractorService.name);
  private chatModel: ChatGoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    private templateService: TemplateService,
  ) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');

    if (apiKey) {
      this.chatModel = new ChatGoogleGenerativeAI({
        model: 'gemini-2.0-flash-exp',
        temperature: 0.1,
        apiKey: apiKey,
      });
      this.logger.log('Initialized Gemini AI model');
    } else {
      this.logger.warn(
        'Google API key not found. Will use fallback extraction.',
      );
    }
  }

  async extractMetadata(
    metadata: Record<string, any>,
    pdf: string,
    templateName:
      | 'cultural-heritage'
      | 'simple'
      | 'custom' = 'cultural-heritage',
  ): Promise<ExtractedContent> {
    try {
      const pdfText = await this.convertPdfToText(pdf);

      const parsedCredential = JSON.parse(metadata?.credential);
      console.log({parsedCredential});

      const template = this.templateService.getTemplate(templateName);

      // Each item we want to inject onto the prompt needs to be specified.
      const formattedTemplate = this.templateService.formatTemplate(template, {
        text: pdfText,
        maxChars: '4000',
        current_date: new Date().toISOString().split('T')[0],
        cid: metadata?.ipfsCID,
        trxHash: '',
        did: parsedCredential?.credentialSubject.id,
        reasercher:  parsedCredential?.credentialSubject.name,
        institution: '',
      });

      // Create prompt
      const prompt = new PromptTemplate({
        template: formattedTemplate,
        inputVariables: [],
      });

      // Get AI response
      this.logger.log('Calling Gemini API for extraction...');
      const response = await this.chatModel.invoke(await prompt.format({}));

      // Clean and parse JSON
      const cleanedResponse = this.cleanJsonResponse(
        response.content as string,
      );
      const extracted = JSON.parse(cleanedResponse);

      return extracted as ExtractedContent;
    } catch (error) {
      this.logger.error('Gemini extraction failed:', error.message);
      throw new Error(`Extraction failed: ${error.message}`);
    }
  }

  private async convertPdfToText(base64Pdf: string): Promise<string> {
    try {
      const cleanBase64 = base64Pdf.replace(
        /^data:application\/pdf;base64,/,
        '',
      );

      const pdfBuffer = Buffer.from(cleanBase64, 'base64');

      const pdfParse = require('pdf-parse');
      const data = await pdfParse(pdfBuffer);

      return data.text;
    } catch (error) {
      this.logger.error('PDF conversion failed:', error.message);
      throw new Error(`PDF conversion failed: ${error.message}`);
    }
  }


  private cleanJsonResponse(response: string): string {
    // Remove markdown code blocks
    let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    // Remove any text before the first {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');

    if (start !== -1 && end !== -1) {
      cleaned = cleaned.substring(start, end + 1);
    }

    return cleaned.trim();
  }
}
