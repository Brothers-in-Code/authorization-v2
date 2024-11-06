import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import {
  FindOptionsOrder,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Group } from '../entities/group.entity';

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
  json: string;
};

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  findOne(id: number): Promise<Post> {
    return this.postRepository.findOneBy({ id });
  }

  async getPostsByGroupList(data: {
    groupList: Group[];
    offset: number;
    limit: number;
    likesMin?: number;
    viewsMin?: number;
    begDate?: number;
    endDate?: number;
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
    if (data.begDate) {
      whereConditions['timestamp_post'] = MoreThanOrEqual(data.begDate);
    }
    if (data.endDate) {
      whereConditions['timestamp_post'] = LessThanOrEqual(data.endDate);
    }
    const total = await this.postRepository.count({
      where: whereConditions,
    });

    // NOTE сбор условий сортировки
    const order: FindOptionsOrder<Post> = {};

    if (data.sortByLikes !== 0) {
      order.likes = data.sortByLikes === 1 ? 'DESC' : 'ASC';
    }

    if (data.sortByViews !== 0) {
      order.views = data.sortByViews === 1 ? 'DESC' : 'ASC';
    }

    if (data.sortByComments !== 0) {
      order.comments = data.sortByComments === 1 ? 'DESC' : 'ASC';
    }

    const posts = await this.postRepository
      .find({
        where: whereConditions,
        relations: { group: true },
        skip: data.offset,
        take: data.limit,
        order: order,
      })
      .then((postList) =>
        postList.map((post) => {
          return {
            id: post.id,
            group: {
              id: post.group.vkid,
              name: post.group.name,
            },
            post: post.json,
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

  async createPost(postParams: {
    group_vkid: number;
    post_vkid: number;
    json: string;
  }): Promise<Post> {
    const post = new Post();
    const group = await this.groupRepository.findOneBy({
      vkid: postParams.group_vkid,
    });

    post.group = group;
    post.post_vkid = postParams.post_vkid;

    post.json = postParams.json;
    return this.postRepository.save(post);
  }

  createNewPost() {
    return new Post();
  }

  async createOrUpdatePostList(group: Group, postParamsList: PostParamsType[]) {
    const postList = [];

    const existPostList = await this.postRepository.find({
      where: {
        post_vkid: In(postParamsList.map((post) => post.post_vkid)),
        group: { vkid: group.vkid },
      },
      relations: ['group'],
    });

    const existPostVkIdList = existPostList.map((post) => post.post_vkid);
    const updatedExistPostList = this.updateExistPostList(
      group,
      postParamsList,
      existPostList,
    );
    postList.push(...updatedExistPostList);

    const newPostParamsList = postParamsList.filter(
      (post) => !existPostVkIdList.includes(post.post_vkid),
    );

    if (newPostParamsList.length > 0) {
      const newPostList = this.createNewPostList(group, newPostParamsList);
      postList.push(...newPostList);
    }

    return this.postRepository.save(postList);
  }

  private updateExistPostList(
    group: Group,
    postParamsList: PostParamsType[],
    existPostList: Post[],
  ) {
    return postParamsList.map((post) => {
      const existPost = existPostList.find(
        (postExist) =>
          postExist.post_vkid === post.post_vkid &&
          postExist.group.vkid === group.vkid,
      );
      if (existPost) {
        existPost.group = group;
        existPost.likes = post.likes;
        existPost.views = post.views;
        existPost.comments = post.comments;
        existPost.timestamp_post = post.timestamp_post;
        existPost.json = post.json;
      }
      return existPost;
    });
  }

  private createNewPostList(group: Group, postParamsList: PostParamsType[]) {
    return postParamsList.map((post) => {
      const newPost = this.createNewPost();
      newPost.group = group;
      newPost.post_vkid = post.post_vkid;
      newPost.likes = post.likes;
      newPost.views = post.views;
      newPost.comments = post.comments;
      newPost.timestamp_post = post.timestamp_post;
      newPost.json = post.json;
      return newPost;
    });
  }

  deletePost(post: Post): Promise<Post> {
    return this.postRepository.remove(post);
  }
}
