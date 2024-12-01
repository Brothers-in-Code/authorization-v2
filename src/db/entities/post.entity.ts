import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../entities/abstract.entity';
import { Group } from './group.entity';

@Entity()
export class Post extends AbstractEntity {
  @ManyToOne(() => Group, (group) => group.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column()
  post_vkid: number;

  @Column()
  likes: number;

  @Column()
  views: number;

  @Column()
  comments: number;

  @Column({ type: 'bigint' })
  timestamp_post: number;

  @Column('json')
  json: any;
}
