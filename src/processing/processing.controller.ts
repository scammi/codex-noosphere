import {
  Controller,
  Post,
  Body,
  Inject,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { AiExtractorService } from '../agent/agent.service';

@Controller('process')
export class ProcessingController {
  private readonly logger = new Logger(ProcessingController.name);

  constructor(
    @Inject(StorageService) private readonly storageService: StorageService,
    @Inject(AiExtractorService)
    private readonly aiExtractorService: AiExtractorService,
  ) {}

  @Post('document')
  async processDocument(
    @Body()
    body: {
      metadata: Record<string, any>;
      pdf: string; // base64 string
      template?: string;
    },
  ) {
    const { metadata, pdf } = body;

    console.log(metadata);

    if (!pdf) {
    throw new HttpException(
      'PDF content is required',
      HttpStatus.BAD_REQUEST,
    );
    }

    try {
      // 1. Upload PDF to IPFS
      this.logger.log('Uploading PDF to IPFS...');
      const uploadResult = await this.storageService.uploadFile(
        pdf,
        `document_${Date.now()}.pdf`,
      );
      const ipfsCID = uploadResult.cid;
      this.logger.log(`PDF uploaded to IPFS with CID: ${ipfsCID}`);

      // 2. Add CID to metadata
      const updatedMetadata = {
        ...metadata,
        ipfsCID: ipfsCID,
      };
      this.logger.log('Metadata updated with IPFS CID.');

      // 3. Call Agent Service
      this.logger.log('Calling Agent Service for extraction...');
      const extractionResult = await this.aiExtractorService.extractMetadata(
        updatedMetadata,
        pdf,
      );
      this.logger.log('Agent Service extraction completed.');
      console.log(extractionResult);

      return {
        success: true,
        data: extractionResult,
        message: 'Document processed successfully',
      };
    } catch (error) {
      this.logger.error(
        'Error processing document:',
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        `Failed to process document: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
