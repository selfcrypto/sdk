import { MetadataResolver } from '../metadataResolver';
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
      tokenURI: jest.fn().mockImplementation((tokenId) => {
        // Mock successful case for ricomaverick
        if (tokenId === '40578431797839291533855879311694005376572259190193355825173350800387546192606') {
          return Promise.resolve('ipfs://bafkreibxwvukmiliv7ckx24s2zrn3aevbxvhqjfm24rti23oo2ne46aj7u');
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

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      name: 'ricomaverick',
      description: '',
      image: 'ipfs://bafybeibgf3k6srras7ioseakj26zdnys7kavllisdq4syxua6qlc2uvrvm/ricomaverick.png',
      foreignAddresses: {
        matic: {
          name: 'Polygon',
          symbol: 'matic',
          address: '0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31'
        },
        eth: {
          name: 'Ethereum',
          symbol: 'eth',
          address: '0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31'
        },
        arb: {
          name: 'Arbitrum',
          symbol: 'arb',
          address: '0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31'
        },
        avax: {
          name: 'Avalanche',
          symbol: 'avax',
          address: '0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31'
        },
        bsc: {
          name: 'BSC',
          symbol: 'bsc',
          address: '0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31'
        },
        nim: {
          name: 'Nimiq',
          symbol: 'nim',
          address: 'NQ47 04KA G5JP DHBQ 22HD NMAR S0KN E9N0 P1YX'
        }
      },
      email: 'enrique.ferrater@selfcrypto.io',
      createdAt: '2024-11-22T16:47:03.780Z'
    })
  })
) as jest.Mock;

describe('MetadataResolver', () => {
  let resolver: MetadataResolver;

  beforeEach(() => {
    resolver = new MetadataResolver();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default options', () => {
      const resolver = new MetadataResolver();
      expect(resolver).toBeInstanceOf(MetadataResolver);
    });

    it('should initialize with custom options', () => {
      const resolver = new MetadataResolver({
        rpcUrl: 'https://custom.rpc.url',
        ipfsGateway: 'https://custom.ipfs.gateway/'
      });
      expect(resolver).toBeInstanceOf(MetadataResolver);
    });
  });

  describe('resolve', () => {
    it('should resolve metadata for existing name', async () => {
      const metadata = await resolver.resolve('ricomaverick');
      expect(metadata).toEqual({
        name: 'ricomaverick',
        description: '',
        image: 'ipfs://bafybeibgf3k6srras7ioseakj26zdnys7kavllisdq4syxua6qlc2uvrvm/ricomaverick.png',
        foreignAddresses: {
          matic: {
            name: 'Polygon',
            symbol: 'matic',
            address: '0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31'
          },
          eth: {
            name: 'Ethereum',
            symbol: 'eth',
            address: '0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31'
          },
          arb: {
            name: 'Arbitrum',
            symbol: 'arb',
            address: '0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31'
          },
          avax: {
            name: 'Avalanche',
            symbol: 'avax',
            address: '0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31'
          },
          bsc: {
            name: 'BSC',
            symbol: 'bsc',
            address: '0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31'
          },
          nim: {
            name: 'Nimiq',
            symbol: 'nim',
            address: 'NQ47 04KA G5JP DHBQ 22HD NMAR S0KN E9N0 P1YX'
          }
        },
        email: 'enrique.ferrater@selfcrypto.io',
        createdAt: '2024-11-22T16:47:03.780Z'
      });
    });

    it('should throw error for non-existent name', async () => {
      await expect(resolver.resolve('nonexistent'))
        .rejects
        .toThrow('Failed to resolve metadata for nonexistent');
    });

    it('should throw error for empty name', async () => {
      await expect(resolver.resolve(''))
        .rejects
        .toThrow('Name is required');
    });
  });

  describe('resolveAddress', () => {
    it('should resolve ETH address', async () => {
      const address = await resolver.resolveAddress('ricomaverick', 'eth');
      expect(address).toBe('0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31');
    });

    it('should resolve Nimiq address', async () => {
      const address = await resolver.resolveAddress('ricomaverick', 'nim');
      expect(address).toBe('NQ47 04KA G5JP DHBQ 22HD NMAR S0KN E9N0 P1YX');
    });

    it('should return null for non-existent chain', async () => {
      const address = await resolver.resolveAddress('ricomaverick', 'nonexistent' as any);
      expect(address).toBeNull();
    });
  });
}); 