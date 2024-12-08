import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiInternalGuard } from 'src/shared/guards/api-internal/api-internal.guard';
import { PostService } from 'src/db/services/post.service';

@UseGuards(ApiInternalGuard)
@Controller('internal-api/posts')
export class InternalApiPostsController {
  constructor(private postsService: PostService) {}

  @Get('no-keywords')
  getPosts(@Query() { limit }: { limit?: number }) {
    return this.postsService.findFreshPostWithoutKeywords(limit);
  }
}
