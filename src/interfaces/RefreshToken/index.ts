import { RefreshToken } from '../../entities/RefreshToken';

export interface CreateRefreshTokenDTO {
  userId: string;
  token: string;
  expires: Date;
  isValid: boolean;
}

export interface IRefreshTokenRepository {
  create({
    expires,
    token,
    userId,
    isValid,
  }: CreateRefreshTokenDTO): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  invalidate(refresh_token: RefreshToken): Promise<void>;
}
