import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { ExtractedContent } from './extraction.interface';
import { TemplateService } from './templates/template.service';

@Injectable()
export class AiExtractorService {
  private readonly logger = new Logger(AiExtractorService.name);
  private chatModel: ChatOpenAI;

  constructor(
    private configService: ConfigService,
    private templateService: TemplateService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (apiKey) {
      this.chatModel = new ChatOpenAI({
        temperature: 0.1,
        modelName: 'gpt-4',
        openAIApiKey: apiKey,
      });
    } else {
      this.logger.warn(
        'OpenAI API key not found. Will use fallback extraction.',
      );
    }
  }

  async extractMetadata(
    text: string,
    templateName: 'cultural-heritage' | 'simple' | 'custom' = 'simple',
  ): Promise<ExtractedContent> {
    if (!this.chatModel) {
      return this.fallbackExtraction(text);
    }

    try {
      const truncatedText = text.substring(0, 4000);

      const template = this.templateService.getTemplate(templateName);
      const formattedTemplate = this.templateService.formatTemplate(template, {
        text: truncatedText,
        maxChars: '4000',
      });

      // Create prompt
      const prompt = new PromptTemplate({
        template: formattedTemplate,
        inputVariables: [],
      });

      // Get AI response
      const response = await this.chatModel.invoke(await prompt.format({}));

      // Clean and parse JSON
      const cleanedResponse = this.cleanJsonResponse(
        response.content as string,
      );
      const extracted = JSON.parse(cleanedResponse);

      // Validate and return
      if (this.isValidExtraction(extracted)) {
        this.logger.log('AI extraction successful');
        return extracted;
      } else {
        this.logger.warn('Invalid AI response, using fallback');
        return this.fallbackExtraction(text);
      }
    } catch (error) {
      this.logger.error('AI extraction failed:', error.message);
      return this.fallbackExtraction(text);
    }
  }

  private cleanJsonResponse(response: string): string {
    let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');

    if (start !== -1 && end !== -1) {
      cleaned = cleaned.substring(start, end + 1);
    }

    return cleaned.trim();
  }

  private isValidExtraction(extraction: any): boolean {
    return (
      extraction &&
      Array.isArray(extraction.keywords) &&
      Array.isArray(extraction.locations) &&
      typeof extraction.summary === 'string' &&
      typeof extraction.heritage_type === 'string' &&
      typeof extraction.confidence === 'number'
    );
  }

  private fallbackExtraction(text: string): ExtractedContent {
    this.logger.log('Using fallback extraction');

    const culturalTerms = [
      'heritage',
      'cultural',
      'monument',
      'archaeological',
      'historic',
      'preservation',
      'conservation',
      'unesco',
      'site',
      'museum',
    ];

    // Extract keywords by finding cultural terms
    const keywords = culturalTerms
      .filter((term) => text.toLowerCase().includes(term))
      .slice(0, 5);

    // Simple location extraction
    const locationMatches =
      text.match(
        /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Park|Site|Museum|Monument))\b/g,
      ) || [];
    const locations = [...new Set(locationMatches)].slice(0, 3);

    // Heritage type detection
    let heritage_type = 'Cultural';
    if (
      text.toLowerCase().includes('natural') ||
      text.toLowerCase().includes('park')
    ) {
      heritage_type = 'Natural';
    }
    if (
      text.toLowerCase().includes('intangible') ||
      text.toLowerCase().includes('tradition')
    ) {
      heritage_type = 'Intangible';
    }

    // Simple summary (first two sentences)
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
    const summary =
      sentences.slice(0, 2).join('. ').substring(0, 200) +
      (sentences.length > 2 ? '...' : '');

    return {
      keywords: keywords.length > 0 ? keywords : ['cultural heritage'],
      locations,
      summary: summary || 'Cultural heritage document processed by AI agent.',
      heritage_type: heritage_type as ExtractedContent['heritage_type'],
      confidence: 0.6,
    };
  }
}
