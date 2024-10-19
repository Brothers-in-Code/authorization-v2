import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../entities/abstract.entity';
import { Comment } from './comment.entity';

@Entity()
export class Report extends AbstractEntity {
  @ManyToOne(() => Comment, (comment) => comment.id)
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @Column({
    type: 'varchar',
    length: 100,
    default: Date.now().toLocaleString('ru-RU'),
  })
  name: string;

  @Column({ type: 'date', default: null })
  start_date_period: Date;

  @Column({ type: 'date', default: null })
  end_date_period: Date;
}
