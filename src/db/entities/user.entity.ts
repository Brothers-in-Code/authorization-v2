import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '../entities/abstract.entity';

@Entity()
@Index('IDX_USER_USER_ID', ['user_id'], { unique: true })
export class User extends AbstractEntity {
  @Column()
  user_id: number;

  @Column({ type: 'varchar', length: 1000 })
  access_token: string;

  @Column({ type: 'varchar', length: 1000 })
  refresh_token: string;

  @Column()
  expires_date: Date;
}
