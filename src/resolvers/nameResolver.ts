import { ethers } from "ethers";
import { SELF_NFT_ABI, SELF_NFT_ADDRESS, DEFAULT_RPC_URL } from "../constants";
import { hashName } from "../utils";
import type { ResolverOptions } from "../types";

export class NameResolver {
  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor(options?: ResolverOptions) {
    const rpcUrl = options?.rpcUrl || DEFAULT_RPC_URL;
    
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
      throw new Error(`Failed to initialize NameResolver: Invalid RPC URL - ${rpcUrl}`);
    }
  }

  async resolve(name: string): Promise<string> {
    if (!name) throw new Error("Name is required");
    
    try {
      const hashedName = hashName(name);
      return await this.contract.ownerOf(hashedName);
    } catch (error: any) {
      throw new Error(`Failed to resolve name ${name}: ${error.message}`);
    }
  }
} 