import { hashName, isValidName } from '../index';

describe('Utils', () => {


  describe('isValidName', () => {
    it('should return true for valid names', () => {
      expect(isValidName('satoshi')).toBe(true);
      expect(isValidName('alice123')).toBe(true);
      expect(isValidName('crypto_punk')).toBe(true);
    });

    it('should return false for invalid names', () => {
      expect(isValidName('')).toBe(false);
      expect(isValidName('hello!')).toBe(false);
      expect(isValidName('space name')).toBe(false);
      expect(isValidName('emoji😊')).toBe(false);
    });
  });
});
