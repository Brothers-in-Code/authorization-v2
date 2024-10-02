import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

type UpdateTokenParamsType = {
  user_vkid: number;
  access_token: string;
  refresh_token: string;
  device_id: string;
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
    Logger.log(`findOne user_vkid = ${user_vkid}`);
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

  async updateToken({
    user_vkid,
    access_token,
    refresh_token,
    device_id,
    expires_date,
  }: UpdateTokenParamsType): Promise<User> {
    const user = await this.userRepository.findOneBy({ user_vkid });

    if (!user) {
      throw new Error(`User with id = ${user_vkid} not found`);
    }

    user.access_token = access_token;
    user.refresh_token = refresh_token;
    user.device_id = device_id;
    user.expires_date = expires_date;

    return this.userRepository.save(user);
  }
}
