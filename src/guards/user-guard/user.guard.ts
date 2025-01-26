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

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar: payload.avatar,
      };
    } catch (error) {}
    return true;
  }
}
