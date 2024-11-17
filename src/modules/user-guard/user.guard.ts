// user.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.user_token;

    if (!token) {
      throw new UnauthorizedException(
        'USER_GUARD: There is no user_token in cookies',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token); // теперь использует конфигурированный секретный ключ
      request['user'] = {
        id: payload.sub,
        name: payload.user_name,
        email: payload.email,
      };
    } catch (error) {
      throw new UnauthorizedException(`USER_GUARD: Wrong user_token: ${error}`);
    }

    return true;
  }
}
