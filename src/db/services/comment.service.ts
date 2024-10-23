import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { InsertResult, Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  private readonly logger = new Logger(CommentService.name);

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
}
