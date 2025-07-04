import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiExtractorService } from './agent.service';
import { TemplateService } from './templates/template.service';
import { AgentController } from './agent.controller';

@Module({
  imports: [ConfigModule],
  controllers: [AgentController],
  providers: [AiExtractorService, TemplateService],
  exports: [AiExtractorService, TemplateService],
})
export class AgentModule {}
