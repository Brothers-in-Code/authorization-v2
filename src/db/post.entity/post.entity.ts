import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// TODO добавить поле is_private

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group_id: number;

  @Column()
  post_id: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column()
  deleted_at: Date;

  @Column('json')
  json: any;
}
