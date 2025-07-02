import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';

describe('StorageService Integration', () => {
  let service: StorageService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
      ],
      providers: [StorageService],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  describe('Real Pinata Integration', () => {
    it('should upload a real file to Pinata', async () => {
      if (!process.env.PINATA_JWT || !process.env.PINATA_GATEWAY) {
        console.log('Skipping integration test - no Pinata credentials');
        return;
      }

      // Test with actual base64 PDF content
      const testPdfBase64 =
        'JVBERi0xLjQKJcOkw7zDtsOiCjIgMCBvYmoKPDwKL0xlbmd0aCAzIDAgUgo+PgpzdHJlYW0KQNP/Hm3VRsxKqm3VsVlLhqKBNQBV9Pb3DhINOEhUhKCGogINDQRRQg=='; // Very basic PDF

      const result = await service.uploadFile(
        testPdfBase64,
        'integration-test.pdf',
      );

      expect(result.cid).toBeDefined();
      expect(result.url).toContain('ipfs');
      expect(result.name).toBe('base64 string');
    }, 30000);

    it('should upload JSON metadata', async () => {
      if (!process.env.PINATA_JWT || !process.env.PINATA_GATEWAY) {
        return;
      }

      const testMetadata = {
        title: 'Integration Test Document',
        description: 'Test metadata for integration testing',
        pdfCID: 'QmTestCID123',
        uploadedAt: new Date().toISOString(),
      };

      const result = await service.uploadJSON(
        testMetadata,
        'integration-test-metadata',
      );

      expect(result.cid).toBeDefined();
      expect(result.url).toContain('ipfs');
    }, 30000);
  });
});
