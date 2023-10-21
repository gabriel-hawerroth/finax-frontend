export interface User {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  access: string;
  activate: Boolean;
  canChangePassword: boolean;
  signature: string;
  signatureExpiration: Date;
  profileImage: Blob;
}
