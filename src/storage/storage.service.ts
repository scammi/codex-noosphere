import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinataSDK } from 'pinata';
import { UploadResult } from './interfaces/upload-result.interface';

interface PinataUploadResponse {
  id: string;
  name: string;
  cid: string;
  size: number;
  number_of_files: number;
  mime_type: string;
  group_id: string | null;
}

@Injectable()
export class StorageService {
  private readonly pinata: PinataSDK;
  private readonly logger = new Logger(StorageService.name);
  private readonly pinataGateway: string;

  constructor(private configService: ConfigService) {
    const jwt = this.configService.get<string>('PINATA_JWT');
    const pinataGateway = this.configService.get<string>('PINATA_GATEWAY');

    if (!jwt || !pinataGateway) {
      this.logger.error(
        'PINATA_JWT or PINATA_GATEWAY environment variable not set.',
      );
      throw new InternalServerErrorException('Pinata configuration missing.');
    }
    this.pinataGateway = pinataGateway;

    this.pinata = new PinataSDK({
      pinataJwt: jwt,
      pinataGateway: this.pinataGateway,
    });
  }

  async uploadFile(
    base64Content: string,
    fileName: string,
    metadata?: any,
  ): Promise<UploadResult> {
    try {
      const upload = (await this.pinata.upload.public
        .base64(base64Content)
        .name(fileName)
        .keyvalues({
          type: 'document',
          ...metadata,
        })) as PinataUploadResponse;

      const url = `${this.pinataGateway}/ipfs/${upload.cid}`;

      return {
        cid: upload.cid,
        name: upload.name,
        size: upload.size,
        url: url,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      // Type guard to safely access error properties
      if (error instanceof Error) {
        this.logger.error(
          `Failed to upload file ${fileName}: ${error.message}`,
          error.stack,
        );
        throw new InternalServerErrorException(
          `Failed to upload file ${fileName}`,
          error.message,
        );
      } else {
        this.logger.error(`Failed to upload file ${fileName}: Unknown error`);
        throw new InternalServerErrorException(
          `Failed to upload file ${fileName}`,
          'Unknown error',
        );
      }
    }
  }

  async uploadJSON(jsonObject: any, name?: string): Promise<UploadResult> {
    try {
      const jsonString = JSON.stringify(jsonObject, null, 2);
      const jsonBase64 = Buffer.from(jsonString).toString('base64');
      const fileName = `${name || 'metadata'}.json`;

      const upload = (await this.pinata.upload.public
        .base64(jsonBase64)
        .name(fileName)
        .keyvalues({
          type: 'metadata',
          contentType: 'application/json',
          uploadedAt: new Date().toISOString(),
        })) as PinataUploadResponse;

      const url = `${this.pinataGateway}/ipfs/${upload.cid}`;
       console.log(url) 
      return {
        cid: upload.cid,
        name: upload.name,
        size: upload.size,
        url: url,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      // Type guard to safely access error properties
      if (error instanceof Error) {
        this.logger.error(
          `Failed to upload JSON: ${error.message}`,
          error.stack,
        );
        throw new InternalServerErrorException(
          'Failed to upload JSON',
          error.message,
        );
      } else {
        this.logger.error(`Failed to upload JSON: Unknown error`);
        throw new InternalServerErrorException(
          'Failed to upload JSON',
          'Unknown error',
        );
      }
    }
  }

  getFile(cid: string): Promise<string> {
    return Promise.resolve(`https://${this.pinataGateway}/ipfs/${cid}`);
  }
}
