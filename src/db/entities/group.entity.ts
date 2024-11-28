import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../entities/abstract.entity';

@Entity('vk_group')
export class Group extends AbstractEntity {
  @Column()
  vkid: number;

  @Column()
  name: string;

  @Column()
  screen_name: string;

  @Column({ default: null, type: 'varchar' })
  is_private: boolean;

  @Column({ default: null, type: 'varchar', length: 1000 })
  photo: string;

  @Column({ default: null })
  last_group_scan_date: Date;
}
