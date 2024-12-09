import { NameResolver } from '../nameResolver';
import { ethers } from 'ethers';

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    utils: {
      keccak256: jest.fn().mockImplementation(() => '0x123...'), // mock hash
      toUtf8Bytes: jest.fn().mockImplementation(() => new Uint8Array()), // mock bytes
    },
    providers: {
      JsonRpcProvider: jest.fn().mockImplementation(() => ({
        // Mock provider methods
      })),
    },
    Contract: jest.fn().mockImplementation(() => ({
      ownerOf: jest.fn().mockImplementation((tokenId) => {
        // Mock successful case for ricomaverick
        if (tokenId === '40578431797839291533855879311694005376572259190193355825173350800387546192606') {
          return Promise.resolve('0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31');
        }
        // Mock non-existent name
        return Promise.reject(new Error('Token not found'));
      }),
    })),
  },
}));

// Mock hashName function directly
jest.mock('../../utils', () => ({
  hashName: jest.fn().mockImplementation((name) => {
    if (name === 'ricomaverick') {
      return '40578431797839291533855879311694005376572259190193355825173350800387546192606';
    }
    return '123'; // default for other names
  }),
  isValidName: jest.fn().mockImplementation((name) => name.length > 0),
}));

describe('NameResolver', () => {
  let resolver: NameResolver;

  beforeEach(() => {
    resolver = new NameResolver();
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  describe('constructor', () => {
    it('should initialize with default RPC URL', () => {
      const resolver = new NameResolver();
      expect(resolver).toBeInstanceOf(NameResolver);
    });

    it('should initialize with custom RPC URL', () => {
      const resolver = new NameResolver({ rpcUrl: 'https://custom.rpc.url' });
      expect(resolver).toBeInstanceOf(NameResolver);
    });
  });

  describe('resolve', () => {
    it('should resolve existing name to correct address', async () => {
      const address = await resolver.resolve('ricomaverick');
      expect(address).toBe('0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31');
    });

    it('should throw error for non-existent name', async () => {
      await expect(resolver.resolve('nonexistent'))
        .rejects
        .toThrow('Failed to resolve name nonexistent');
    });

    it('should throw error for empty name', async () => {
      await expect(resolver.resolve(''))
        .rejects
        .toThrow('Name is required');
    });
  });
}); 