import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as qs from 'qs';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/db/services/user.service';

import {
  VKMethodGroupsGetResponseType,
  VKGroupType,
  VKMethodGroupsGetByIdResponseType,
} from 'src/types/vk-group-get-response-type';
import { PostService } from 'src/db/services/post.service';

import { VKWallType } from 'src/types/vk-wall-type';
import { Group } from 'src/db/entities/group.entity';
import { GroupService } from 'src/db/services/group.service';
import { VK_API_Error } from 'src/errors/vk-errors';
import { VKResponseApiErrorType } from 'src/types/vk-error-type';
import { DatabaseServiceError } from 'src/errors/service-errors';

const VK_API = 'https://api.vk.com/method';
const VK_API_VERSION = 5.199;

@Injectable()
export class VkDataService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private userService: UserService,
    private postService: PostService,
    private groupService: GroupService,
  ) {}

  async getGroupInfo(access_token: string, groupIdList: (string | number)[]) {
    const params = {
      group_ids: groupIdList.join(','),
      v: VK_API_VERSION,
      access_token,
    };
    const response =
      await this.httpService.axiosRef.get<VKMethodGroupsGetByIdResponseType>(
        `${VK_API}/groups.getById`,
        {
          params,
        },
      );
    return response.data;
  }

  async getUserGroupListFromVK(
    user_vkid: number,
    access_token: string,
    extended: number,
  ) {
    const params = {
      user_id: user_vkid,
      client_id: this.configService.get('vk.appId'),
      v: VK_API_VERSION,
      extended: extended,
      access_token,
    };
    const response =
      await this.httpService.axiosRef.post<VKMethodGroupsGetResponseType>(
        `${VK_API}/groups.get`,
        qs.stringify(params),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
    return response.data;
  }

  /**
   * сохраняя группы вспомни, что их надо привязать к пользователю
   * UserGroupService create или createUserGroupList
   * @param id: number;
   * @param is_closed: number;
   * @param name: string;
   * @param photo_50: string;
   * @param photo_100: string;
   * @param photo_200: string;
   * @param screen_name: string;
   * @param type: string;
   */
  async saveGroupList(vkGroupList: VKGroupType[]) {
    const groupList = vkGroupList.map((item) => {
      const newGroup = this.groupService.createNewGroup();
      Object.assign(newGroup, {
        vkid: item.id,
        name: item.name,
        screen_name: item.screen_name,
        is_private: Boolean(item.is_closed),
        photo: item.photo_100,
      });
      return newGroup;
    });
    return this.groupService.createGroupList(groupList);
  }

  async getWallPublicGroup(owner_id: number, extended: number) {
    const params = {
      owner_id: -owner_id,
      client_id: this.configService.get('vk.appId'),
      v: VK_API_VERSION,
      extended: extended,
    };
    const response = await this.httpService.axiosRef.post(
      `${VK_API}/wall.get`,
      qs.stringify(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${this.configService.get('vk.serviceKey')}`,
        },
      },
    );
    return response.data;
  }

  async getWallPrivetGroup({
    access_token,
    owner_id,
    extended,
  }: {
    access_token: string;
    owner_id: number;
    extended: number;
  }) {
    const params = {
      owner_id: -owner_id,
      client_id: this.configService.get('vk.appId'),
      v: VK_API_VERSION,
      extended: extended,
      access_token,
    };
    const response = await this.httpService.axiosRef.post<VKWallType>(
      `${VK_API}/wall.get`,
      qs.stringify(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    if (response.data.hasOwnProperty('error')) {
      const error = response.data as unknown as VKResponseApiErrorType;
      throw new VK_API_Error(error.error.error_msg);
    }
    return response.data;
  }

  async getWallByDomain({
    user_vkid,
    domain,
    extended,
  }: {
    user_vkid: number;
    domain: string;
    extended: number;
  }) {
    const user = await this.userService.findOne(user_vkid);
    if (!user) {
      throw new Error(`User with id = ${user_vkid} not found`);
    }
    const access_token = user.access_token;
    const params = {
      domain,
      client_id: this.configService.get('vk.appId'),
      v: VK_API_VERSION,
      access_token,
      extended,
    };
    const response = await this.httpService.axiosRef.post(
      `${VK_API}/wall.get`,
      qs.stringify(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return response.data;
  }

  async savePostList(
    group: Group,
    postParamsList: {
      post_vkid: number;
      likes: number;
      views: number;
      comments: number;
      timestamp_post: number;
      json: string;
    }[],
  ) {
    const postList = await this.postService.createOrUpdatePostList(
      group,
      postParamsList,
    );
    if (!postList) {
      throw new DatabaseServiceError(
        'func: savePostList. Ошибка сохранения постов',
      );
    }
    return postList;
  }
}
