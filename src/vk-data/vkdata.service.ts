import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as qs from 'qs';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/db/services/user.service';

const VK_API = 'https://api.vk.com/method';

@Injectable()
export class VkDataService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async getUserGroupListFromVK(user_vkid: number, extended: number) {
    const user = await this.userService.findOne(user_vkid);
    if (!user) {
      throw new Error(`User with id = ${user_vkid} not found`);
    }
    // TODO добавить проверку date_expires

    const params = {
      user_id: user_vkid,
      client_id: this.configService.get('vk.appId'),
      v: 5.199,
      extended: extended,
      access_token: user.access_token,
    };
    const response = await this.httpService.axiosRef.post(
      `${VK_API}/groups.get`,
      qs.stringify(params),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    return response.data;
  }

  async getWallPublicGroup(owner_id: number, extended: number) {
    const params = {
      owner_id: -owner_id,
      client_id: this.configService.get('vk.appId'),
      v: 5.199,
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
}

// {
//     "user_vkid": 1267318,
//     "access_token": "vk2.a.8e3o3K9pSA8xsLADuWBArFFCrUkvbiIqEidOAg-kxh_E04ZGyvbWkAShFLOk4TM0gc_7gi1Li09rmEebJEzD4olBYeR1s0UuUy1dTkAAwwuZttMk8uWqgAVdJYYbRlKtyDRT-S9m-p44i4vsMQMAu-shhQBHXRamKJ1tZqbYCmXSEZcYClaR_vsSj3MoLA7OBsNPBVH8g7z23G4zo-Aca2Ft5k0kimek40z7J7bJvyiT0Lv-RNGObvLLFI5PkpnX",
//     "refresh_token": "vk2.a.jKMTOxjh4USJy9W7n5qBc5xSUxu2JkJz65GzLtJkcV6BOUvfHk4eBG-xaatAHRZLeNO9i4EutHbumLmHsvral1BNn2aSYPhUhciD2AIkobQRqgEXoe5rVP_gwD3s92j07WV2h67dmHApq_JLVuOp1XUyxFBh_D2H7zn8vojTZfROR6uGrGiHtYEbMLbBAUZf6axCKBryG8YuQcVWq63Ol4v_x4IR-iqi99I6LMOUwes",
//     "expires_date": "2024-09-25T18:51:45.757Z"
//   }
