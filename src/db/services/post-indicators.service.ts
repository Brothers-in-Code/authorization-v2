import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { PostIndicators } from 'src/db/entities/postIndicators.entity';
import { Post } from 'src/db/entities/post.entity';

export type IndicatorsType = {
  datetime: number;
  views: number;
  likes: number;
  repost: number;
  comment: number;
};

export type PostIndicatorParamsType = {
  post: Post;
  indicators: IndicatorsType;
};

@Injectable()
export class PostIndicatorsService {
  constructor(
    @InjectRepository(PostIndicators)
    private readonly postIndicatorsRepository: Repository<PostIndicators>,
  ) {}

  implementPostIndicator() {
    return new PostIndicators();
  }

  async createOrUpdatePostIndicatorList(
    postIndicatorList: PostIndicatorParamsType[],
  ) {
    const existingPostIndicatorList = await this.postIndicatorsRepository.find({
      where: {
        post: { id: In(postIndicatorList.map((item) => item.post.id)) },
      },
      relations: ['post'],
    });

    const newPostIndicatorList = postIndicatorList.map((item) => {
      let postIndicator = existingPostIndicatorList.find(
        (existingItem) => existingItem.post.id === item.post.id,
      );
      if (!postIndicator) {
        postIndicator = this.implementPostIndicator();
        postIndicator.post = item.post;
        postIndicator.indicatorsList = [];
      }
      postIndicator.indicatorsList.push(item.indicators);
      return postIndicator;
    });

    return this.postIndicatorsRepository.save(newPostIndicatorList);
  }
}
