import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.user_token;
    if (!token) {
      throw new UnauthorizedException('There is no user_token in cookies');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.APP_JWT_SECRET,
      });

      request['user'] = {
        id: payload.sub,
        name: payload.username,
        email: payload.email,
      };
    } catch (error) {
      throw new UnauthorizedException('Wrong user_token');
    }

    return true;
  }
}
