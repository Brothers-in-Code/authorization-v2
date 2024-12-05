import { Body, Controller, Post } from '@nestjs/common';

@Controller('api/vkdata/wall')
export class VkWallDataController {
  @Post('posts')
  async getPosts(
    @Body() body: { access_token: string; group_id: number; daysLimit: number },
  ) {
    return 'posts';
  }
}
