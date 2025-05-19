import * as bcrypt from 'bcrypt';

export async function hashPassword(planPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(planPassword, salt);
}

export async function isPasswordMatch(
  plainPassword: string,
  encPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, encPassword);
}