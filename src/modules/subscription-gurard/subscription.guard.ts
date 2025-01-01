import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedStatus } from 'src/shared/enum/unauthorized-enum';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const subscriptionToken = request.cookies?.user_subscription;
    const userToken = request.cookies?.user_token;
    let userId: number | null;

    if (userToken) {
      const payload = await this.jwtService.verifyAsync(userToken);
      userId = payload.sub;
    } else {
      userId = null;
    }

    if (!subscriptionToken) {
      throw new UnauthorizedException(
        `SUBSCRIPTION_GUARD: userId ${userId}, ${UnauthorizedStatus.NO_TOKEN}`,
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync(subscriptionToken);

      request['subscription'] = {
        subscription: payload.subscription,
        endDate: payload.endDate,
      };

      const nowTimestamp = Date.now();
      if (payload.endDate < nowTimestamp) {
        throw new UnauthorizedException(
          `SUBSCRIPTION_GUARD: userId ${userId}, ${UnauthorizedStatus.EXPIRED_TOKEN}`,
        );
      }
    } catch (error) {
      throw new UnauthorizedException(`SUBSCRIPTION_GUARD:  ${error}`);
    }
    return true;
  }
}
