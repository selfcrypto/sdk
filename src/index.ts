import { NameResolver } from './resolvers/nameResolver';
import { MetadataResolver } from './resolvers/metadataResolver';
import { hashName, isValidName } from './utils';
import type { ResolverOptions, ChainIntegrationKey, Metadata } from './types';

export class SelfSDK {
  private nameResolver: NameResolver;
  private metadataResolver: MetadataResolver;

  constructor(options?: ResolverOptions) {
    this.nameResolver = new NameResolver(options);
    this.metadataResolver = new MetadataResolver(options);
  }

  /**
   * Resolves a SELF name to default address i.e owner of the name(NFT)
   */
  async resolveName(name: string): Promise<string> {
    return this.nameResolver.resolve(name);
  }

  /**
   * Resolves a SELF name to its address on a specific chain
   */
  async resolveCrossChain(name: string, chain: ChainIntegrationKey): Promise<string | null> {
    return this.metadataResolver.resolveAddress(name, chain);
  }

  /**
   * Resolves complete metadata for a SELF name
   */
  async resolveMetadata(name: string): Promise<Metadata | null> {
    return this.metadataResolver.resolve(name);
  }

  /**
   * Utility method to hash a name
   */
  hashName(name: string): string {
    return hashName(name);
  }

  /**
   * Utility method to validate a name
   */
  isValidName(name: string): boolean {
    return isValidName(name);
  }
}

export default SelfSDK; 