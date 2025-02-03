import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomUnauthorizedException } from 'src/errors/http-custom-exception';
import { UnauthorizedStatus } from 'src/shared/enum/unauthorized-enum';

type Request = any;
type Payload = any;

@Injectable()
export abstract class BaseUserGuard implements CanActivate {
  constructor(protected readonly jwtService: JwtService) {}
  private readonly logger = new Logger(BaseUserGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.getToken(request);

    if (!token) {
      this.handleMissingToken();
    }

    try {
      const payload: Payload = await this.getPayload(token);
      this.validatePayload(payload);
      this.attachUserToRequest(request, payload);
    } catch (error) {
      this.handleError(error);
    }
    return true;
  }

  protected getToken(request: Request) {
    return request.cookies?.user_token;
  }

  protected attachUserToRequest(request: Request, payload: Payload) {
    request['user'] = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      avatar: payload.avatar,
    };
  }

  protected validatePayload(payload: Payload) {
    const nowTimestamp = Date.now();
    const tokenExpiresTimestamp = Number(payload.exp) * 1000;

    if (tokenExpiresTimestamp < nowTimestamp) {
      throw new CustomUnauthorizedException(
        `USER_GUARD: userId: ${payload.sub} ${UnauthorizedStatus.EXPIRED_TOKEN}`,
      );
    }
  }

  protected handleMissingToken() {
    throw new CustomUnauthorizedException(
      `USER_GUARD: ${UnauthorizedStatus.NO_TOKEN}`,
    );
  }

  protected async getPayload(token: any) {
    return await this.jwtService.verifyAsync(token);
  }

  protected handleError(error: any) {
    if (error instanceof CustomUnauthorizedException) {
      throw error;
    } else {
      throw new UnauthorizedException(
        `USER_GUARD: ${UnauthorizedStatus.WRONG_TOKEN}: ${error}`,
      );
    }
  }
}
