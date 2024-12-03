import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiInternalGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  private readonly logger = new Logger(ApiInternalGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secret = this.configService.get('app.apiInternalSecret');
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.warn('API_INTERNAL_GUARD: There is no Authorization header');
      throw new UnauthorizedException(
        'API_INTERNAL_GUARD: There is no Authorization header',
      );
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || token !== secret) {
      this.logger.warn('API_INTERNAL_GUARD: Wrong Authorization header');
      throw new UnauthorizedException(
        'API_INTERNAL_GUARD: Wrong Authorization header',
      );
    }
    if (token !== secret) {
      this.logger.warn('API_INTERNAL_GUARD: Wrong token');
      throw new UnauthorizedException('API_INTERNAL_GUARD: Wrong token');
    }
    return true;
  }
}

// request.headers.Authorization = `Bearer ${userToken}`;
