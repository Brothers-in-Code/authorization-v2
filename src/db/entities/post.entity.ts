import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../entities/abstract.entity';

// TODO добавить поле is_private (для таблицы group)

@Entity()
export class Post extends AbstractEntity {
  @Column()
  group_id: number;

  @Column()
  post_id: number;

  @Column('json')
  json: any;
}
