import { AbstractEntity } from '../entities/abstract.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Post } from './post.entity';

@Entity('postIndicators')
export class PostIndicators extends AbstractEntity {
  @OneToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ type: 'json', name: 'indicatorsList' })
  indicatorsList: any;
}
