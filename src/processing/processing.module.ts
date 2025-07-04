import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { AgentModule } from '../agent/agent.module';
import { DataverseModule } from '../dataverse/dataverse.module';
import { ProcessingController } from './processing.controller';

@Module({
  imports: [StorageModule, AgentModule, DataverseModule],
  controllers: [ProcessingController],
  providers: [],
})
export class ProcessingModule {}
