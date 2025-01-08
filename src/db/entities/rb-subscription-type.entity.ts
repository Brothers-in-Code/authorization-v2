import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserSubscription } from './user_subscription.entity';

@Entity('rbSubscriptionType')
export class RbSubscriptionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 64 })
  name: string;

  @OneToMany(
    () => UserSubscription,
    (userSubscription) => userSubscription.subscriptionType,
  )
  userSubscriptions: UserSubscription[];
}
