import { SelfSDK } from '../../index';
import type { Metadata } from '../../types';

describe('SelfSDK Integration Tests', () => {
  // Longer timeout since we're making real network calls
  jest.setTimeout(10000);
  
  let sdk: SelfSDK;

  beforeAll(() => {
    sdk = new SelfSDK();
  });

  describe('Name Resolution', () => {
    it('should resolve ricomaverick to correct address', async () => {
      const address = await sdk.resolveName('ricomaverick');
      expect(address).toBe('0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31');
    });

    it('should fail for non-existent name', async () => {
      await expect(sdk.resolveName('this-name-definitely-does-not-exist-12345'))
        .rejects
        .toThrow();
    });
  });

  describe('Cross-Chain Resolution', () => {
    it('should resolve ETH address', async () => {
      const address = await sdk.resolveCrossChain('ricomaverick', 'eth');
      expect(address).toBe('0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31');
    });

    it('should resolve Nimiq address', async () => {
      const address = await sdk.resolveCrossChain('ricomaverick', 'nim');
      expect(address).toBe('NQ47 04KA G5JP DHBQ 22HD NMAR S0KN E9N0 P1YX');
    });
  });

  describe('Metadata Resolution', () => {
    it('should resolve complete metadata', async () => {
      const metadata = await sdk.resolveMetadata('ricomaverick');
      
      // Ensure metadata exists
      expect(metadata).not.toBeNull();
      
      if (!metadata) {
        throw new Error('Metadata should not be null');
      }

      // Test structure
      expect(metadata.name).toBe('ricomaverick');
      expect(metadata.foreignAddresses).toBeDefined();
      
      // Test ETH address
      const ethAddress = metadata.foreignAddresses.eth?.address;
      expect(ethAddress).toBeDefined();
      expect(ethAddress).toBe('0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31');
      
      // Test Nimiq address
      const nimAddress = metadata.foreignAddresses.nim?.address;
      expect(nimAddress).toBeDefined();
      expect(nimAddress).toBe('NQ47 04KA G5JP DHBQ 22HD NMAR S0KN E9N0 P1YX');
    });
  });

  describe('Utility Functions', () => {
    it('should validate names correctly', () => {
      expect(sdk.isValidName('ricomaverick')).toBe(true);
      expect(sdk.isValidName('')).toBe(false);
      expect(sdk.isValidName('invalid!')).toBe(false);
    });

    it('should hash names consistently', () => {
      const hash = sdk.hashName('ricomaverick');
      expect(hash).toBe('40578431797839291533855879311694005376572259190193355825173350800387546192606');
    });
  });
}); 