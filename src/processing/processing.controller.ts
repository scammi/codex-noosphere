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
import { DataverseService } from '../dataverse/dataverse.service';
import { ExtractedContent } from '../agent/interfaces/extraction.interface';

@Controller('process')
export class ProcessingController {
  private readonly logger = new Logger(ProcessingController.name);

  constructor(
    @Inject(StorageService) private readonly storageService: StorageService,
    @Inject(AiExtractorService)
    private readonly aiExtractorService: AiExtractorService,
    @Inject(DataverseService)
    private readonly dataverseService: DataverseService,
  ) {}

  @Post('document')
  async processDocument(
    @Body()
    body: {
      metadata: Record<string, any>;
      pdf: string; // base64 string
      template?: string;
    },
  ): Promise<{
    success: boolean;
    data: ExtractedContent;
    dataverseResult?: any;
    message: string;
  }> {
    const { metadata, pdf } = body;

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

      const extractionResult: ExtractedContent =
        await this.aiExtractorService.extractMetadata(updatedMetadata, pdf);
      this.logger.log('Agent Service extraction completed.');

      // 4. Upload extracted metadata to Dataverse
      this.logger.log('Uploading extracted metadata to Dataverse...');
      const dataverseResult: any =
        await this.dataverseService.createHeritageDataset(
          extractionResult,
          pdf,
        );

      this.logger.log('Metadata uploaded to Dataverse.');

      return {
        success: true,
        data: extractionResult,
        dataverseResult: dataverseResult,
        message:
          'Document processed and metadata uploaded to Dataverse successfully',
      };
    } catch (error) {
      this.logger.error(
        'Error processing document:',
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        `Failed to process document: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
