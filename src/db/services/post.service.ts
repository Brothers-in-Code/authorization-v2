import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { In, Repository } from 'typeorm';
import { Group } from '../entities/group.entity';

type PostListOutputType = {
  total: number;
  offset: number;
  limit: number;
  posts: { group: { id: number; name: string }; post: string }[];
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

  async getPostsByGroupList({
    groupList,
    offset,
    limit,
  }: {
    groupList: Group[];
    offset: number;
    limit: number;
  }): Promise<PostListOutputType> {
    const idList = groupList.map((group) => group.id);
    const total = await this.postRepository.count({
      where: { group: { id: In(idList) } },
    });
    const posts = await this.postRepository
      .find({
        where: { group: { id: In(idList) } },
        relations: { group: true },
        skip: offset,
        take: limit,
      })
      .then((postList) =>
        postList.map((post) => {
          return {
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
      offset,
      limit,
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

  createPostList(postList: Post[]): Promise<Post[]> {
    return this.postRepository.save(postList);
  }

  deletePost(post: Post): Promise<Post> {
    return this.postRepository.remove(post);
  }
}
