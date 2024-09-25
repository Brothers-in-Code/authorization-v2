import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

type UpdateTokenParamsType = {
  user_vkid: number;
  access_token: string;
  refresh_token: string;
  expires_date: Date;
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(user_vkid: number): Promise<User> {
    return this.userRepository.findOneBy({ user_vkid });
  }

  async deleteUser(user: User) {
    return this.userRepository.remove(user);
  }

  createUser(userParams: Partial<User>): Promise<User> {
    const newUser = new User();
    Object.assign(newUser, userParams);
    return this.userRepository.save(newUser);
  }

  updateToken({
    user_vkid,
    access_token,
    refresh_token,
    expires_date,
  }: UpdateTokenParamsType): Promise<{ message: string }> {
    Logger.log({ user_vkid, access_token, refresh_token, expires_date });
    return this.userRepository
      .update(user_vkid, {
        access_token,
        refresh_token,
        expires_date,
      })
      .then(() => ({
        message: 'Token updated successfully',
      }))
      .catch((error) => ({ message: `Failed to update token. ${error}` }));
  }
}
