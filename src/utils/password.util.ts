import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const passwordUtil = {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
  },

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  },
};