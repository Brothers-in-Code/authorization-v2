import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractEntity } from '../entities/abstract.entity';
import { Post } from './post.entity';

export type IndicatorsType = {
  datetime: number;
  views: number;
  likes: number;
  repost: number;
  comment: number;
};

@Entity('postIndicators')
export class PostIndicators extends AbstractEntity {
  @OneToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ type: 'json', name: 'indicatorsList', default: [] })
  indicatorsList: IndicatorsType[];
}
