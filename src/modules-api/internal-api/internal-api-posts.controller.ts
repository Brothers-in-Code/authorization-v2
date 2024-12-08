import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiInternalGuard } from 'src/shared/guards/api-internal/api-internal.guard';
import { PostService } from 'src/db/services/post.service';
import { PostWithKeywordsRequest } from 'src/modules-api/internal-api/dto/keywords.dto';

@UseGuards(ApiInternalGuard)
@Controller('internal-api/posts')
export class InternalApiPostsController {
  constructor(private postsService: PostService) {}

  @Get('no-keywords')
  getPosts(
    @Query() { limit = 10, offset = 0 }: { limit?: number; offset?: number },
  ) {
    return this.postsService.findFreshPostWithoutKeywords(limit, offset);
  }

  @Post('set-keywords')
  setPostsKeywords(@Body() body: PostWithKeywordsRequest) {
    const list = body.items.map(({ id, keywords }) => {
      return {
        id,
        keywords: keywords.join('|'),
      };
    });

    return this.postsService.saveKeywords(list);
  }
}
