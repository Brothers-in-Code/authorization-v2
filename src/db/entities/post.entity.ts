import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../entities/abstract.entity';
import { Group } from './group.entity';

// TODO добавить поле is_private (для таблицы group)

@Entity()
export class Post extends AbstractEntity {
  @ManyToOne(() => Group, (group) => group.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column()
  post_vkid: number;

  @Column('json')
  json: any;
}
