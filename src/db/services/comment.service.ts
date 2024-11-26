import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { InsertResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  private readonly logger = new Logger(CommentService.name);
  // NOTE здесь есть только insert. Надо разделить существующие комменты и новые . Обрабатывать соответственно
  async createCommentList(data: {
    userId: number;
    postList: { post_id: number; comment: string }[];
  }): Promise<InsertResult> {
    const queryBuilder = this.commentRepository.createQueryBuilder();
    const insertQuery = await queryBuilder
      .insert()
      .into(Comment)
      .values(
        data.postList.map((item) => {
          return {
            user: { id: data.userId },
            post: { id: item.post_id },
            text: item.comment,
          };
        }),
      )
      .execute();

    return insertQuery;
  }

  patchCommentText(commentId: number, comment: string): Promise<UpdateResult> {
    return this.commentRepository.update(commentId, { text: comment });
  }
}
