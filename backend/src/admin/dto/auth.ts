import * as bcrypt from 'bcryptjs';

export class Auth {
  async HashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  }
  async ComparePassword(password: string, hashedPassword: string) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }
}
