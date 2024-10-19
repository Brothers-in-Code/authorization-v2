import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Comment } from './comment.entity';
import { Report } from './report.entity';

@Entity()
export class ReportComment extends AbstractEntity {
  @ManyToOne(() => Report, (report) => report.id)
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @ManyToOne(() => Comment, (comment) => comment.id)
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;
}
