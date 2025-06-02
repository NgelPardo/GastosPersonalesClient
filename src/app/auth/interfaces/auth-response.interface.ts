import { User } from './user.interface';

export interface AuthResponse {
  usuario: User;
  token: string;
}
