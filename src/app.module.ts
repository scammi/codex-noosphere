import { StorageModule } from './storage/storage.module';
import { ProcessingModule } from './processing/processing.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AgentModule,
    StorageModule,
    ProcessingModule,
  ],
})
export class AppModule {}
