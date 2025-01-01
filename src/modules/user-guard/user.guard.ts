// user.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedStatus } from 'src/shared/enum/unauthorized-enum';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  private readonly logger = new Logger(UserGuard.name);
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.user_token;

    if (!token) {
      throw new UnauthorizedException(
        'USER_GUARD: There is no user_token in cookies',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar: payload.avatar,
      };
      const nowTimestamp = Date.now();
      const tokenExpiresTimestamp = Number(payload.exp) * 1000;

      if (tokenExpiresTimestamp < nowTimestamp) {
        throw new UnauthorizedException(
          `USER_GUARD: userId: ${payload.sub} ${UnauthorizedStatus.EXPIRED_TOKEN}`,
        );
      }
    } catch (error) {
      throw new UnauthorizedException(
        `USER_GUARD: ${UnauthorizedStatus.WRONG_TOKEN}: ${error}`,
      );
    }

    return true;
  }
}
