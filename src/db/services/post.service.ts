import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import {
  Between,
  FindOptionsOrder,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Group } from '../entities/group.entity';
import {
  IndicatorsType,
  PostIndicators,
} from 'src/db/entities/postIndicators.entity';

type PostListOutputType = {
  total: number;
  offset: number;
  limit: number;
  posts: { group: { id: number; name: string }; post: string }[];
};

type PostParamsType = {
  post_vkid: number;
  likes: number;
  views: number;
  comments: number;
  timestamp_post: number;
  json: object;
};

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  private readonly logger = new Logger(PostService.name);

  findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  findFreshPostWithoutKeywords(take: number, skip: number) {
    return this.postRepository.find({
      order: {
        timestamp_post: 'DESC',
      },
      where: { keywords: IsNull() },
      take,
      skip,
    });
  }

  async saveKeywords(list: { id: number; keywords: string }[]) {
    const queryBuilder = this.postRepository.createQueryBuilder();

    const updatePromises = list.map(({ id, keywords }) =>
      queryBuilder
        .update()
        .set({ keywords })
        .where('id = :id', { id })
        .execute()
        .then(() => ({ id: true }))
        .catch(() => ({ id: false })),
    );

    return await Promise.all(updatePromises);
  }

  findOne(id: number): Promise<Post> {
    return this.postRepository.findOneBy({ id });
  }

  async getPostsByGroupList(data: {
    groupList: Group[];
    offset: number;
    limit: number;
    likesMin: number | null;
    viewsMin: number | null;
    begDate: number | null;
    endDate: number | null;
    sortByLikes: number;
    sortByViews: number;
    sortByComments: number;
  }): Promise<PostListOutputType> {
    // NOTE сбор условий фильтрации
    const idList = data.groupList.map((group) => group.id);
    const whereConditions = {
      group: { id: In(idList) },
    };
    if (data.likesMin) {
      whereConditions['likes'] = MoreThanOrEqual(data.likesMin);
    }
    if (data.viewsMin) {
      whereConditions['views'] = MoreThanOrEqual(data.viewsMin);
    }
    if (data.begDate && data.endDate) {
      whereConditions['timestamp_post'] = Between(data.begDate, data.endDate);
    } else if (data.begDate) {
      whereConditions['timestamp_post'] = MoreThanOrEqual(data.begDate);
    } else if (data.endDate) {
      whereConditions['timestamp_post'] = LessThanOrEqual(data.endDate);
    }
    const total = await this.postRepository.count({
      where: whereConditions,
    });

    // NOTE сбор условий сортировки
    const order: FindOptionsOrder<Post> = {};
    let isOrderEmpty = true;
    if (data.sortByLikes !== 0) {
      order.likes = data.sortByLikes === 1 ? 'DESC' : 'ASC';
      isOrderEmpty = false;
    }

    if (data.sortByViews !== 0) {
      order.views = data.sortByViews === 1 ? 'DESC' : 'ASC';
      isOrderEmpty = false;
    }

    if (data.sortByComments !== 0) {
      order.comments = data.sortByComments === 1 ? 'DESC' : 'ASC';
      isOrderEmpty = false;
    }

    if (isOrderEmpty) {
      order.timestamp_post = 'DESC';
    }

    const posts = await this.postRepository
      .find({
        where: whereConditions,
        relations: { group: true, postIndicators: true },
        skip: data.offset,
        take: data.limit,
        order: order,
      })
      .then((postList) =>
        postList.map((post) => {
          return {
            id: post.id,
            updated_at: post.updated_at,
            group: {
              id: post.group.vkid,
              name: post.group.name,
            },
            post: post.json,
            keywords: post.keywords,
            indicatorsList: post.postIndicators
              ? post.postIndicators.indicatorsList
              : [],
          };
        }),
      );
    return {
      total,
      offset: data.offset,
      limit: data.limit,
      posts,
    };
  }

  //   TODO удалить в будущем (закомичено 14.11.2024)
  //   async createPost(postParams: {
  //     group_vkid: number;
  //     post_vkid: number;
  //     json: string;
  //   }): Promise<Post> {
  //     const post = new Post();
  //     const group = await this.groupRepository.findOneBy({
  //       vkid: postParams.group_vkid,
  //     });

  //     post.group = group;
  //     post.post_vkid = postParams.post_vkid;

  //     post.json = postParams.json;
  //     return this.postRepository.save(post);
  //   }

  async createOrUpdatePostList(group: Group, postParamsList: PostParamsType[]) {
    const existPostList = await this.postRepository.find({
      where: {
        post_vkid: In(postParamsList.map((post) => post.post_vkid)),
        group: { vkid: group.vkid },
      },
      relations: ['group'],
    });

    const postList = postParamsList.map((params) => {
      let post = existPostList.find(
        (post) => post.post_vkid === params.post_vkid,
      );
      if (!post) {
        post = this.createNewPost();
      }
      return this.updatePostProperty(group, params, post);
    });

    return this.postRepository.save(postList);
  }

  private updatePostProperty(
    group: Group,
    postParams: PostParamsType,
    post: Post,
  ) {
    post.group = group;
    post.post_vkid = postParams.post_vkid;
    post.likes = postParams.likes;
    post.views = postParams.views;
    post.comments = postParams.comments;
    post.timestamp_post = postParams.timestamp_post;
    post.json = postParams.json;
    return post;
  }

  createNewPost() {
    return new Post();
  }

  deletePost(post: Post): Promise<Post> {
    return this.postRepository.remove(post);
  }
}
