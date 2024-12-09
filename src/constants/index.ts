export const SELF_NFT_ADDRESS = "0x125Bb13F77f3565d421bD22e92aaFfC795D97a72";
export const DEFAULT_RPC_URL = "https://bsc-dataseed1.binance.org/";
export const DEFAULT_IPFS_GATEWAY = "https://self-sdk-ts.mypinata.cloud/ipfs/?pinataGatewayToken=Se0QJ3_l05NJh-vqBacA9MLKhThdCXn7YbI2dQbXRtTYw5pyDQZKuorTZlSMxqVk";

export const SELF_NFT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  }
];
