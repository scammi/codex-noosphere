import { Module } from '@nestjs/common';
import { DataverseService } from './dataverse.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [DataverseService],
  exports: [DataverseService],
})
export class DataverseModule {}
