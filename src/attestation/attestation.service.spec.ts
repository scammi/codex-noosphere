import { Test, TestingModule } from '@nestjs/testing';
import { AttestationService } from './attestation.service';
import { ConfigModule } from '@nestjs/config';

describe('AttestationService Integration', () => {
  let service: AttestationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttestationService],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
    }).compile();

    service = module.get<AttestationService>(AttestationService);
  });

  it('should create attestation and return transaction hash', async () => {
    // Test data
    const metadataCID = 'QmTestCID123456789';

    // Call the service
    const result = await service.createAttestation(metadataCID);

    // Assertions
    expect(result).toBeDefined();
    expect(result.hash).toBeDefined();
    expect(result.hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(result.id).toBeGreaterThan(0);

    console.log('✅ Transaction Hash:', result.hash);
    console.log('✅ Attestation ID:', result.id);
  }, 30000);

  it('should handle invalid metadata CID gracefully', async () => {
    const invalidCID = '';

    await expect(service.createAttestation(invalidCID)).rejects.toThrow();
  }, 30000);
});
