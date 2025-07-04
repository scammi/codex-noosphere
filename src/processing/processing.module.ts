import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { AgentModule } from '../agent/agent.module';
import { ProcessingController } from './processing.controller';

@Module({
  imports: [StorageModule, AgentModule],
  controllers: [ProcessingController],
  providers: [],
})
export class ProcessingModule {}
