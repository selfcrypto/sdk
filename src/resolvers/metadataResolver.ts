import { ethers } from "ethers";
import { SELF_NFT_ABI, SELF_NFT_ADDRESS, DEFAULT_RPC_URL, DEFAULT_IPFS_GATEWAY } from "../constants";
import { hashName } from "../utils";
import type { ResolverOptions, Metadata, ChainIntegrationKey } from "../types";

export class MetadataResolver {
  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;
  private ipfsGateway: string;

  constructor(options?: ResolverOptions) {
    const rpcUrl = options?.rpcUrl || DEFAULT_RPC_URL;
    this.ipfsGateway = options?.ipfsGateway || DEFAULT_IPFS_GATEWAY;

    if (!this.ipfsGateway.endsWith('/')) {
      this.ipfsGateway += '/';
    }
    
    try {
      this.provider = new ethers.providers.JsonRpcProvider({
        url: rpcUrl,
        skipFetchSetup: true
      });
      
      this.contract = new ethers.Contract(
        SELF_NFT_ADDRESS,
        SELF_NFT_ABI,
        this.provider
      );
    } catch (error) {
      throw new Error(`Failed to initialize MetadataResolver: Invalid RPC URL - ${rpcUrl}`);
    }
  }

  /**
   * Fetches the complete metadata for a SELF name
   * @param name The SELF name to fetch metadata for
   * @returns The complete metadata object or null if not found
   */
  async resolve(name: string): Promise<Metadata | null> {
    if (!name) throw new Error("Name is required");

    try {
      const hashedName = hashName(name);
      const tokenUri = await this.contract.tokenURI(hashedName);
      const cid = tokenUri.replace("ipfs://", "");
      
      const baseGateway = this.ipfsGateway.endsWith('/') 
        ? this.ipfsGateway.slice(0, -1) 
        : this.ipfsGateway;
        
      const httpUrl = baseGateway.includes('?')
        ? baseGateway.replace('?', `${cid}?`)
        : `${baseGateway}/${cid}`;
      
      const response = await fetch(httpUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }
      
      const metadata: Metadata = await response.json();
      return metadata;
    } catch (error: any) {
      throw new Error(`Failed to resolve metadata for ${name}: ${error.message}`);
    }
  }

  /**
   * Resolves a SELF name to its address on a specific chain
   */
  async resolveAddress(name: string, chain: ChainIntegrationKey): Promise<string | null> {
    const metadata = await this.resolve(name);
    return metadata?.foreignAddresses[chain]?.address || null;
  }
}
