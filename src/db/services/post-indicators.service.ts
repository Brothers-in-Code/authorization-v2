import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostIndicators } from 'src/db/entities/postIndicators.entity';

type IndicatorsType = {
  datetime: number;
  views: number;
  likes: number;
  repost: number;
  comment: number;
};

type PostIndicatorPropType = {
  postId: number;
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
    postIndicatorList: PostIndicatorPropType[],
  ) {
    const existingPostIndicatorList = await this.postIndicatorsRepository.find({
      where: { post: { id: In(postIndicatorList.map((item) => item.postId)) } },
    });

    const newPostIndicatorList = postIndicatorList.map((item) => {
      let postIndicator = existingPostIndicatorList.find(
        (existingItem) => existingItem.post.id === item.postId,
      );
      if (!postIndicator) {
        postIndicator = this.implementPostIndicator();
      }
      return this.updatePostIndicatorProperty(postIndicator, item);
    });

    return this.postIndicatorsRepository.save(newPostIndicatorList);
  }

  private updatePostIndicatorProperty(
    postIndicator: PostIndicators,
    props: PostIndicatorPropType,
  ) {
    postIndicator.post.id = postIndicator.id;
    postIndicator.indicatorsList.push(props.indicators);

    return postIndicator;
  }
}
