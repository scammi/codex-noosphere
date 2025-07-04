import { Injectable } from '@nestjs/common';
import { createWalletClient, createPublicClient, http, getContract } from 'viem';
import { avalanche } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const ATTESTATION_ABI = [
  'function createAttestation(string memory metadataCID) external returns (uint256)',
] as const;

const CONTRACT_ADDRESS = '0xfA15ba4eaffdE473A0C98F71483d60932F451dd2';

@Injectable()
export class AttestationService {
  private walletClient;
  private publicClient;
  private contract;

  constructor() {
    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
    
    this.walletClient = createWalletClient({
      account,
      chain: avalanche,
      transport: http(process.env.RPC_URL)
    });
    
    this.publicClient = createPublicClient({
      chain: avalanche,
      transport: http(process.env.RPC_URL)
    });
    
    this.contract = getContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ATTESTATION_ABI,
      client: { public: this.publicClient, wallet: this.walletClient }
    });
  }

  async createAttestation(metadataCID: string): Promise<{ hash: string; id: number }> {
    try {
      const hash = await this.contract.write.createAttestation([metadataCID]);
      
      // Wait for transaction receipt
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      
      // Get the event logs to extract the ID
      const logs = receipt.logs.find(log => 
        log.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()
      );
      
      // Parse the event to get the ID (first topic after event signature)
      const id = logs ? parseInt(logs.topics[1], 16) : 0;
      
      return { hash, id };
    } catch (error) {
      console.error('Error creating attestation:', error);
      throw error;
    }
  }

  async getAttestation(id: number): Promise<string> {
    try {
      return await this.contract.read.getAttestation([BigInt(id)]);
    } catch (error) {
      console.error('Error getting attestation:', error);
      throw error;
    }
  }

  async getNextId(): Promise<number> {
    try {
      const nextId = await this.contract.read.nextId();
      return Number(nextId);
    } catch (error) {
      console.error('Error getting next ID:', error);
      throw error;
    }
  }
}