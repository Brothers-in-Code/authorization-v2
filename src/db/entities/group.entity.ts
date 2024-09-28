import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../entities/abstract.entity';

@Entity()
export class Group extends AbstractEntity {
  @Column()
  group_vkid: number;

  @Column()
  group_name: string;

  @Column()
  is_private: boolean;

  @Column({ default: null, type: 'varchar', length: 1000 })
  photo: string;

  @Column()
  last_group_scan_date: Date;
}
