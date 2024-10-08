import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPermission } from '../entities/user_permission.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserPermissionService {
  constructor(
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
  ) {}

  addPermission(user: User, permission: boolean): Promise<UserPermission> {
    const userPermission = new UserPermission();
    userPermission.user = user;
    userPermission.permission = permission;
    return this.userPermissionRepository.save(userPermission);
  }

  findPermission(user_vkid: number): Promise<boolean> {
    return this.userPermissionRepository
      .findOne({
        where: {
          user: {
            user_vkid,
          },
        },
      })
      .then((userPermission) => userPermission.permission);
  }
}
