import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const subscriptionToken = request.cookies?.subscription_token;

    if (!subscriptionToken) {
      throw new UnauthorizedException(
        'There is no subscription_token in cookies',
      );
    }
    try {
      await this.jwtService.verifyAsync(subscriptionToken);

      request['subscription'] = {
        subscription: true,
      };
    } catch (error) {
      throw new UnauthorizedException('Wrong subscription_token');
    }
    return true;
  }
}
