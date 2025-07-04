import { Injectable } from '@nestjs/common';
import {
  CULTURAL_HERITAGE_EXTRACTION_TEMPLATE,
  SIMPLE_EXTRACTION_TEMPLATE,
} from './cultural-heritage.template';

@Injectable()
export class TemplateService {
  getTemplate(
    templateName: 'cultural-heritage' | 'simple' | 'custom',
    customTemplate?: string,
  ): string {
    switch (templateName) {
      case 'cultural-heritage':
        return CULTURAL_HERITAGE_EXTRACTION_TEMPLATE;
      case 'simple':
        return SIMPLE_EXTRACTION_TEMPLATE;
      case 'custom':
        return customTemplate || CULTURAL_HERITAGE_EXTRACTION_TEMPLATE;
      default:
        return CULTURAL_HERITAGE_EXTRACTION_TEMPLATE;
    }
  }

  formatTemplate(template: string, variables: Record<string, any>): string {
    return template.replace(/{(\w+)}/g, (match, key) => {
      return variables[key] || match;
    });
  }
}
