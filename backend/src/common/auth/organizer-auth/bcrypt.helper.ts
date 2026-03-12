import * as bcrypt from 'bcrypt';

export const hashPassword = async (plain: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(plain, saltRounds);
};

export const comparePassword = async (
  plain: string,
  hashed: string,
): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
