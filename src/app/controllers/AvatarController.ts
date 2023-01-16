import { Request, Response } from 'express';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';
import { UpdateAvatarService } from '../services/UpdateAvatarService';

export class AvatarController {
  async upload(request: Request, response: Response): Promise<Response> {
    const updateAvatarService = container.resolve(UpdateAvatarService);
    const user = await updateAvatarService.updateAvatar({
      userId: request.user.id,
      avatarFileName: request.file?.filename,
    });

    return response.json(instanceToInstance(user));
  }
}
