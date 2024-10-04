import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { Group } from '../entities/group.entity';

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
