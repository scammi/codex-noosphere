import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { Readable } from 'stream';
import { ExtractedContent } from 'src/agent/interfaces/extraction.interface';

@Injectable()
export class DataverseService {
  private readonly logger = new Logger(DataverseService.name);
  private readonly dataverseApiToken: string | undefined;
  private readonly dataverseServerUrl: string;
  private readonly dataverseAlias: string = 'demo';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.dataverseApiToken = this.configService.get<string>(
      'DATAVERSE_API_TOKEN',
    );
    this.dataverseServerUrl = 'https://demo.dataverse.org';

    if (!this.dataverseApiToken) {
      this.logger.error('DATAVERSE_API_TOKEN environment variable is not set.');
    }
  }

  async createHeritageDataset(
    extractionResult: ExtractedContent,
    pdfBase64: string,
  ): Promise<any> {
    try {
      // Step 1: Create new dataset with proper metadata structure
      const datasetId = await this.createDataset(extractionResult);

      // Step 2: Upload complete metadata as a reference file
      const uploadResult = await this.uploadFileToDataset(
        datasetId,
        pdfBase64,
      );

      const datasetUrl = `${this.dataverseServerUrl}/dataset.xhtml?id=${datasetId}`;

      this.logger.log(`Heritage dataset created successfully: ${datasetUrl}`);

      return {
        datasetId,
        datasetUrl,
        uploadResult,
        success: true,
      };
    } catch (error) {
      this.logger.error('Failed to create heritage dataset');
      throw error;
    }
  }

  async createDataset(extractionResult: ExtractedContent): Promise<string> {
    const url = `${this.dataverseServerUrl}/api/dataverses/${this.dataverseAlias}/datasets`;

    try {
      this.logger.log('Creating new dataset with extracted metadata...');

      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(url, extractionResult, {
          headers: {
            'X-Dataverse-key': this.dataverseApiToken,
            'Content-Type': 'application/json',
          },
        }),
      );

      const datasetId = response.data.data.id;
      const persistentId = response.data.data.persistentId;

      this.logger.log(
        `Created new dataset with ID: ${datasetId}, DOI: ${persistentId}`,
      );

      return datasetId;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Unknown error';
      this.logger.error(`Failed to create dataset: ${errorMessage}`);
      if (error.response?.data) {
        this.logger.error(
          `Full error response: ${JSON.stringify(error.response.data)}`,
        );
      }
      throw new Error(`Dataset creation failed: ${errorMessage}`);
    }
  }

  async uploadFileToDataset(
    datasetId: string,
    pdfBase64: string,
    originalFilename?: string,
  ): Promise<any> {
    const url = `${this.dataverseServerUrl}/api/datasets/${datasetId}/add`;
    const formData = new FormData();

    try {
      const base64Data = pdfBase64.replace(
        /^data:application\/pdf;base64,/,
        '',
      );

      // Decode base64 to buffer
      const pdfBuffer = Buffer.from(base64Data, 'base64');
      const pdfStream = Readable.from(pdfBuffer);

      const filename =
        originalFilename || `heritage_document_${Date.now()}.pdf`;

      formData.append('file', pdfStream, {
        filename: filename,
        contentType: 'application/pdf',
      });

      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(url, formData, {
          headers: {
            'X-Dataverse-key': this.dataverseApiToken,
            ...formData.getHeaders(),
          },
          timeout: 30000,
        }),
      );

      this.logger.log('Metadata file uploaded successfully to dataset.');
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Unknown error';
      this.logger.error(`Failed to upload file: ${errorMessage}`);
      throw new Error(`File upload failed: ${errorMessage}`);
    }
  }
}
