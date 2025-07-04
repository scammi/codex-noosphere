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
      this.logger.log('Calling Gemini API for extraction...');
      const response = await this.chatModel.invoke(await prompt.format({}));

      // Clean and parse JSON
      const cleanedResponse = this.cleanJsonResponse(
        response.content as string,
      );
      const extracted = JSON.parse(cleanedResponse);

      // Validate and return
      if (this.isValidExtraction(extracted)) {
        this.logger.log('Gemini extraction successful');
        return {
          ...extracted,
          heritage_type: this.validateHeritageType(extracted.heritage_type),
        };
      } else {
        this.logger.warn('Invalid Gemini response, using fallback');
        return this.fallbackExtraction(text);
      }
    } catch (error) {
      this.logger.error('Gemini extraction failed:', error.message);
      return this.fallbackExtraction(text);
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

  private isValidExtraction(extraction: any): boolean {
    return (
      extraction &&
      Array.isArray(extraction.keywords) &&
      Array.isArray(extraction.locations) &&
      typeof extraction.summary === 'string' &&
      typeof extraction.heritage_type === 'string'
   );
  }

  private validateHeritageType(type: string): ExtractedContent['heritage_type'] {
    const validTypes: ExtractedContent['heritage_type'][] = [
      'Cultural',
      'Natural',
      'Mixed',
      'Intangible'
    ];
    return validTypes.includes(type as any)
      ? (type as ExtractedContent['heritage_type'])
      : 'Cultural';
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

    // Extract keywords
    const keywords = culturalTerms
      .filter((term) => text.toLowerCase().includes(term))
      .slice(0, 5);

    // Better location extraction
    const locationMatches = [
      ...(text.match(/\b[A-Z][a-z]+,\s+[A-Z][a-z]+\b/g) || []), // "Siem Reap, Cambodia"
      ...(text.match(/\b[A-Z][a-z]+\s+Archaeological\s+Park\b/g) || []), // "Angkor Archaeological Park"
      ...(text.match(/\b[A-Z][a-z]+\s+(?:Site|Museum|Monument|Temple)\b/g) || []),
    ];
    const locations = [...new Set(locationMatches)].slice(0, 3);

    // Heritage type detection - prioritize Cultural for heritage docs
    let heritage_type = 'Cultural';
    if (text.toLowerCase().includes('natural park') ||
        text.toLowerCase().includes('biodiversity') ||
        text.toLowerCase().includes('ecosystem')) {
      heritage_type = 'Natural';
    }
    if (text.toLowerCase().includes('intangible') ||
        text.toLowerCase().includes('tradition') ||
        text.toLowerCase().includes('folklore')) {
      heritage_type = 'Intangible';
    }

    // Clean summary
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20);
    const summary = sentences.slice(0, 2).join('. ').trim().substring(0, 200) +
      (sentences.length > 2 ? '...' : '');

    return {
      keywords: keywords.length > 0 ? keywords : ['cultural heritage'],
      locations,
      summary: summary || 'Cultural heritage document processed by AI agent.',
      heritage_type: this.validateHeritageType(heritage_type),
      confidence: 0.7,
    };
  }
}
