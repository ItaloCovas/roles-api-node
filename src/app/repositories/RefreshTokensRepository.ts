import { Repository } from 'typeorm';
import { dataSource } from '../../database';
import { RefreshToken } from '../../entities/RefreshToken';
import { NotFoundError } from '../../helpers/api-errors';
import {
  CreateRefreshTokenDTO,
  IRefreshTokenRepository,
} from '../../interfaces/RefreshToken';

export class RefreshTokenRepository implements IRefreshTokenRepository {
  private repository: Repository<RefreshToken>;

  constructor() {
    this.repository = dataSource.getRepository(RefreshToken);
  }

  async create({
    expires,
    token,
    userId,
    isValid,
  }: CreateRefreshTokenDTO): Promise<RefreshToken> {
    const refreshToken = this.repository.create({
      expires,
      token,
      userId,
      isValid,
    });
    return this.repository.save(refreshToken);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.repository.findOneBy({ token });
  }

  async invalidate(refresh_token: RefreshToken): Promise<void> {
    const refreshToken = await this.findByToken(refresh_token.token);
    if (!refreshToken) {
      throw new NotFoundError('Refresh Token not found');
    }
    refreshToken.isValid = false;
    await this.repository.save(refreshToken);
  }
}
