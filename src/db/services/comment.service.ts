import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { DatabaseServiceError } from 'src/errors/service-errors';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  private readonly logger = new Logger(CommentService.name);

  async createOrUpdate(user: User, post: Post, text: string): Promise<Comment> {
    let newComment: Comment;
    const existingComment = await this.commentRepository.findOne({
      where: { user: { id: user.id }, post: { id: post.id } },
    });
    if (existingComment) {
      await this.update(existingComment.id, { text });
      newComment = await this.findByKey<number>('id', existingComment.id);
    } else {
      newComment = await this.create(user, post, text);
    }

    return newComment;
  }

  createCommentObj() {
    return new Comment();
  }

  async findByKey<T>(key: string, value: T): Promise<Comment> {
    const commentList = await this.commentRepository.find({
      where: { [key]: value },
      relations: ['user', 'post'],
      order: { id: 'DESC' },
      take: 1,
    });

    if (commentList.length === 0) {
      throw new DatabaseServiceError(
        `func: CommentService.findByKey. Comment ${key}: ${value} not found`,
      );
    } else {
      return commentList[0];
    }
  }

  private create(user: User, post: Post, text: string) {
    const comment = this.createCommentObj();
    comment.user = user;
    comment.post = post;
    comment.text = text;
    return this.commentRepository.save(comment);
  }

  private async update(
    commentId: number,
    data: Partial<Comment>,
  ): Promise<UpdateResult> {
    return this.commentRepository
      .update({ id: commentId }, data)
      .then((result) => {
        if (result.affected === 0) {
          throw new DatabaseServiceError(
            `Comment vkid ${commentId} not updated`,
          );
        }
        return result;
      })
      .catch((error) => {
        throw new DatabaseServiceError(
          `Comment vkid ${commentId} not updated. ${error}`,
        );
      });
  }
}
