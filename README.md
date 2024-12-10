# Self SDK

A JavaScript/TypeScript SDK for interacting with Self Crypto names and their metadata.

## Installation

```bash
npm install @selfcrypto/sdk ethers@5.7.2
```
or
```bash
yarn add @selfcrypto/sdk ethers@5.7.2
```
or
```bash
pnpm add @selfcrypto/sdk ethers@5.7.2
```

## Quick Start

```typescript
import { SelfSDK } from "@selfcrypto/sdk";
const sdk = new SelfSDK();

// Resolve a name to its BSC address
const address = await sdk.resolveName("ricomaverick");
console.log(address); // 0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31

// Get cross-chain address
const ethAddress = await sdk.resolveCrossChain("ricomaverick", "eth");
console.log(ethAddress); // 0x383D8ee00c3Ea31dd4eb6e5eCf649Bc9C08D8e31

// Get complete metadata
const metadata = await sdk.resolveMetadata("ricomaverick");
console.log(metadata);
```

## Configuration

You can customize the SDK with your own RPC URL and IPFS gateway:

```typescript
const sdk = new SelfSDK({
rpcUrl: "https://your-rpc-url",
ipfsGateway: "https://your-ipfs-gateway/ipfs/"
});
```

## API Reference

### `resolveName(name: string): Promise<string>`
Resolves a SELF name to default address i.e owner of the name(NFT).

### `resolveCrossChain(name: string, chain: string): Promise<string>`
Resolves a SELF name to its address on a specific chain.

### `resolveMetadata(name: string): Promise<Metadata>`
Resolves a SELF name to its metadata.

The metadata includes:
- Name
- Description
- Profile image
- Email (if available)
- Cross-chain addresses

### Utility Functions

#### `hashName(name: string): string`
Utility method to hash a name.

#### `isValidName(name: string): boolean`
Utility method to validate a name.

## Types

```typescript
interface ResolverOptions {
  rpcUrl?: string;
  ipfsGateway?: string;
}

interface Metadata {
  name: string;
  description: string;
  image: string;
  email?: string;
  foreignAddresses: {
    [key in ChainIntegrationKey]?: {
      address: string;
    };
  };
}

type ChainIntegrationKey = "eth" | "bsc" | "btc" | /* ... other chains ... */;
```

## Error Handling

The SDK throws errors in these cases:
- Invalid name format
- Non-existent name
- Network errors
- Invalid RPC URL
- Failed metadata resolution

## Supported chains:
- EVM: `eth`, `bsc`, `polygon`, `avax`, `arb`
- Non-EVM: `btc`, `ltc`, `xmr`, `trx`, `nim`, `ada`, `sol`, `xlm`, `xrp`, `eos`, `klv`, `dot`
- Other: `bnb`, `strk`

## Upcoming Features

The following features are planned for future releases:

- `hasChainAddress()` - Check if name has an address for a specific chain
- `getConfiguredChains()` - Get all chains with configured addresses
- `getSummary()` - Get a quick summary of name metadata
- `getDescription()` - Get name description
- `getEmail()` - Get associated email
- `getImage()` - Get profile image URL

## Development

### Prerequisites
- Node.js 16+
- pnpm (`npm install -g pnpm`)

### Setup
```bash
# Install dependencies
pnpm install
```

### Development Workflow
```bash
# Watch mode - rebuilds on file changes
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type checking
pnpm lint
```

### Building
```bash
# Build the package
pnpm build
```

### Publishing
This package uses [changesets](https://github.com/changesets/changesets) for versioning and publishing.

```bash
# Create a new changeset
pnpm changeset

# Push your changes
git push origin main
```

The publishing process is automated through GitHub Actions:

1. After pushing changes with a changeset:
   - GitHub Actions will build and test the code
   - If tests pass, it creates a "Version Packages" PR
   - The PR includes version bumps and CHANGELOG updates

2. When the PR is merged:
   - GitHub Actions automatically publishes to npm
   - Creates a new git tag
   - Updates the CHANGELOG.md

> Note: Make sure your changes include a changeset file (created with `pnpm changeset`) describing the changes. This is required for the automated release process.

### Environment Variables
- `NPM_TOKEN` - Required for publishing to npm

### Project Structure
```
src/
├── constants/     # Constants and configuration
├── resolvers/     # Core resolver implementations
├── types/        # TypeScript type definitions
├── utils/        # Internal utilities
└── index.ts      # Main entry point
```

### Testing
Tests are written using Jest. Each resolver has its own test file in a `__tests__` directory.

```bash
src/
├── resolvers/
│   ├── __tests__/
│   │   ├── nameResolver.test.ts
│   │   ├── metadataResolver.test.ts
│   │   └── integration.test.ts
└── utils/
    └── __tests__/
        └── utils.test.ts
```
