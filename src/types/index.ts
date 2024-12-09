export type ChainIntegrationKey =
  // Network Support
  | "btc"    // Bitcoin
  | "ltc"    // Litecoin
  | "xmr"    // Monero
  | "trx"    // Tron
  | "nim"    // Nimiq
  | "ada"    // Cardano
  | "sol"    // Solana
  | "xlm"    // Stellar
  | "xrp"    // Ripple
  | "eos"    // EOS
  | "klv"    // Klever
  | "dot"    // Polkadot
  // EVM Networks
  | "eth"    // Ethereum
  | "bsc"    // BNB Smart Chain
  | "polygon"// Polygon
  | "avax"   // Avalanche
  | "arb"    // Arbitrum
  | "tet"    // Tectum
  // Other Protocols
  | "bnb"    // BNB Beacon Chain
  | "strk"   // Starknet
  | "email"; // Email

export interface ForeignAddressType {
  address: string;
}

export interface Metadata {
  name: string;
  description: string;
  image: string;
  email?: string;
  foreignAddresses: {
    [key in ChainIntegrationKey]?: ForeignAddressType;
  };
}

export interface ResolverOptions {
  /**
   * Custom RPC URL for the blockchain provider
   * @default "https://bsc-dataseed1.binance.org/"
   */
  rpcUrl?: string;

  /**
   * Custom IPFS gateway URL
   * @default "https://ipfs.io/ipfs/"
   * @example "https://gateway.pinata.cloud/ipfs/"
   */
  ipfsGateway?: string;
}
