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

// user_vkid": 1267318,
//   "access_token": "vk2.a.3pdcYTenpw2s9_KlFEiwvIjdcZSMcTTIxMBASa-s2poWy7sFbuD-oorqapIwRt_vBzz869OHDW4mRVkgM3hCRZ7id6vswKSawEKAqqzNB-16HGxWLiB_64lPG73vqBQiArJWIBu8EbmzvmCwtFBM0uzMG5FRhYYS5gZbnCmK-AT2ZEjkrfPCllooyqej36k7BCr0R9X9rn9Lag16tPrpD89N67uDxDMDQCiXyAxRrAPtK_bAHnBnJqXlJ8OxCSM5",
//   "refresh_token": "vk2.a.GPjkRAtjxU_QLNAzlIXr3DqUmn7MLsvIyy8bIfGD9BPDIQuhSzkZxz7QBH16GtQUvo6JkNcEcTBqu2xUtMhvUEh1eGlHZfZ2jO2DOvByz_sETd2Ef7EhaFTGbbbY54agHV4LWxGjJYJmd-f9GzSVE_Onha5pFSwejwUgitcQdvjVuIIdIkVKXdZtVt0b5N6E_PpoW2rWusH2qqXc825wh0X7VMszUh566lsKh5Xwm5w6XjBU8Lz8iD0pgO61W4zS",
//   "expires_date": "2024-09-23T22:51:41.911Z"
