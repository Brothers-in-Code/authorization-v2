import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.user_token;
    const payload = await this.jwtService.verifyAsync(token);
    Logger.log(payload);
    if (!token) {
      throw new UnauthorizedException('There is no user_token in cookies');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);

      request['user'] = {
        id: payload.sub,
        name: payload.user_name,
        email: payload.email,
      };
    } catch (error) {
      throw new UnauthorizedException('Wrong user_token');
    }

    return true;
  }
}
