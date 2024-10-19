import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../entities/abstract.entity';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity()
export class Comment extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_user_id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ type: 'text' })
  text: string;
}
