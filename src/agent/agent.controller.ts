import { AiExtractorService } from './agent.service';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('agent')
export class AgentController {
  constructor(private aiExtractorService: AiExtractorService) {}

  @Post('publish')
  async extraction(
    @Body()
    body: {
      metadata: Record<string, any>;
      pdf: string;
      template?: string;
    },
  ) {
    const { metadata, pdf, template = 'cultural-heritage' } = body;

    const result = await this.aiExtractorService.extractMetadata(
      metadata,
      pdf,
      template as any,
    );

    return {
      success: true,
      data: result,
      message: 'Extraction completed',
    };
  }
}
