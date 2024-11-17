import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

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
      this.logger.warn(
        `UserGuard Exception caught: ${exception.message}`,
        exception.stack,
      );
      const redirectTo = request.originalUrl;
      response.redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
    } else {
      throw exception;
    }
  }
}
