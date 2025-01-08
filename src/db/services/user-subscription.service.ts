import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSubscription } from '../entities/user_subscription.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { SubscriptionType } from 'src/shared/enum/subscription-type-enum';

@Injectable()
export class UserSubscriptionService {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepository: Repository<UserSubscription>,
  ) {}

  addPermission(
    user: User,
    subscription: boolean,
    subscriptionTypeId: SubscriptionType,
    endDate: Date,
  ): Promise<UserSubscription> {
    const userSubscription = new UserSubscription();
    userSubscription.user = user;
    userSubscription.subscription = subscription;
    userSubscription.subscriptionTypeId = subscriptionTypeId;
    return this.userSubscriptionRepository.save(userSubscription);
  }

  async findPermission(
    user_id: number,
  ): Promise<{ subscription: boolean; endDate: Date }> {
    const userSubscription = await this.userSubscriptionRepository.findOne({
      where: {
        user: {
          id: user_id,
        },
      },
    });
    if (!userSubscription) {
      return {
        subscription: false,
        endDate: null,
      };
    }
    return {
      subscription: userSubscription.subscription,
      endDate: userSubscription.endDate,
    };
  }
}
