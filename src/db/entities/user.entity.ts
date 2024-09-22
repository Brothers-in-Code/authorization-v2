import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '../entities/abstract.entity';

@Entity()
@Index('IDX_USER_USER_VKID', ['user_vkid'], { unique: true })
export class User extends AbstractEntity {
  @Column()
  user_vkid: number;

  @Column({ type: 'varchar', length: 1000 })
  access_token: string;

  @Column({ type: 'varchar', length: 1000 })
  refresh_token: string;

  @Column()
  expires_date: Date;
}
