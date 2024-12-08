import { Body, Controller, Post } from '@nestjs/common';
import { VkWallDataService } from './vk-wall.service';

@Controller('api/vkdata/wall')
export class VkWallDataController {
  constructor(private readonly vkWallDataService: VkWallDataService) {}
  @Post('posts')
  async getPosts(
    @Body() body: { accessToken: string; groupVKId: number; daysLimit: number },
  ) {
    this.vkWallDataService.getWallPosts(body);
    return 'posts';
  }
}
