import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  findOne(id: number): Promise<Post> {
    return this.postRepository.findOneBy({ id });
  }

  async createPost(post: Post): Promise<Post> {
    return this.postRepository.save(post);
  }

  async createPostList(postList: Post[]): Promise<Post[]> {
    return this.postRepository.save(postList);
  }

  async deletePost(post: Post): Promise<Post> {
    return this.postRepository.remove(post);
  }
}
