import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';

@Entity('userSubscription')
export class UserSubscription extends AbstractEntity {
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  subscription: boolean;
}
