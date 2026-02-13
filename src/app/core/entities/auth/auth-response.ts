import { User } from '../user/user';

export interface AuthResponse {
  user: User;
  token?: string;
}
