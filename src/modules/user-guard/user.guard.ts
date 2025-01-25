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
import { CustomUnauthorizedException } from 'src/errors/http-custom-exception';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  private readonly logger = new Logger(UserGuard.name);
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.user_token;

    if (!token) {
      throw new CustomUnauthorizedException(
        `USER_GUARD: ${UnauthorizedStatus.NO_TOKEN}`,
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
        throw new CustomUnauthorizedException(
          `USER_GUARD: userId: ${payload.sub} ${UnauthorizedStatus.EXPIRED_TOKEN}`,
        );
      }
    } catch (error) {
      if (error instanceof CustomUnauthorizedException) {
        throw error;
      } else {
        throw new UnauthorizedException(
          `USER_GUARD: ${UnauthorizedStatus.WRONG_TOKEN}: ${error}`,
        );
      }
    }

    return true;
  }
}
