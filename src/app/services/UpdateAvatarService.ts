import fs from 'node:fs';
import path from 'node:path';
import { inject, injectable } from 'tsyringe';
import uploadConfig from '../../config/upload';
import { User } from '../../entities/User';
import { UnauthorizedError } from '../../helpers/api-errors';
import { IUsersRepository } from '../../interfaces/Users';

interface UpdateAvatarDTO {
  userId: string;
  avatarFileName: string | undefined;
}

@injectable()
export class UpdateAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async updateAvatarService({
    userId,
    avatarFileName,
  }: UpdateAvatarDTO): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedError(
        'Only authenticated users can change the avatar.',
      );
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;
    return await this.usersRepository.update(user);
  }
}
