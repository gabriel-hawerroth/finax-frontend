import { UserAccess, UserSignature } from '../../enums/user-enums';

export type AuthProvider = 'LOCAL' | 'GOOGLE';

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  access: UserAccess;
  active: Boolean;
  canChangePassword: boolean;
  signature: UserSignature;
  signatureExpiration?: Date;
  profileImage?: string;
  provider?: AuthProvider;
}
