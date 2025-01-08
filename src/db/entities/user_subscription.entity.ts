import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';
import { RbSubscriptionType } from './rb-subscription-type.entity';

@Entity('userSubscription')
export class UserSubscription extends AbstractEntity {
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: 0 })
  subscription: boolean;

  @ManyToOne(
    () => RbSubscriptionType,
    (rbSubscriptionType) => rbSubscriptionType.userSubscriptions,
  )
  @JoinColumn({ name: 'subscriptionTypeId' })
  subscriptionType: RbSubscriptionType;
  @Column({ name: 'subscriptionTypeId', default: 1 })
  subscriptionTypeId: number;

  @Column('timestamp')
  endDate: Date;
}
