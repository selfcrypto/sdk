import { ethers } from "ethers";

export function hashName(name: string): string {
  return BigInt(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name))).toString();
}

export function isValidName(name: string): boolean {
  // Return false if name doesn't exist
  if (!name) return false;

  // Check max length (40 chars)
  if (name.length > 40) return false;

  // Check for valid characters (lowercase letters, numbers, underscores)
  const validCharRegex = /^[a-z0-9_]+$/;
  if (!validCharRegex.test(name)) return false;

  // Check for consecutive underscores
  const noConsecutiveUnderscores = /^(?!.*__).*/;
  if (!noConsecutiveUnderscores.test(name)) return false;

  return true;
} 
