import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { UnauthorizedStatus } from 'src/shared/enum/unauthorized-enum';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(UnauthorizedExceptionFilter.name);

  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    if (
      exception instanceof UnauthorizedException &&
      exception.message.includes('USER_GUARD')
    ) {
      this.logger.warn(`UserGuard Exception caught: ${exception.message}`);
      const redirectTo = request.originalUrl;
      let message: string;
      if (exception.message.includes(UnauthorizedStatus.EXPIRED_TOKEN)) {
        message = 'Время сеанса закончилось';
      }
      response.redirect(
        `/login?redirectTo=${encodeURIComponent(
          redirectTo,
        )}&message=${message}`,
      );
    } else if (
      exception instanceof UnauthorizedException &&
      exception.message.includes('SUBSCRIPTION_GUARD')
    ) {
      this.logger.warn(`UserGuard Exception caught: ${exception.message}`);
      const redirectTo = request.originalUrl;
      let message: string;

      if (exception.message.includes(UnauthorizedStatus.EXPIRED_TOKEN)) {
        message = 'К сожалению подписка закончилась';
      }
      if (exception.message.includes(UnauthorizedStatus.EXPIRED_TOKEN)) {
      }
      response.redirect(
        `subscription?redirectTo=${encodeURIComponent(
          redirectTo,
        )}&message=${message}`,
      );
    } else {
      throw exception;
    }
  }
}
