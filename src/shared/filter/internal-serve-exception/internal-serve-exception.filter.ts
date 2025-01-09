import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(InternalServerErrorException)
export class InternalServeExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(InternalServeExceptionFilter.name);

  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // note поставил чтобы продебажить редирект на internal-server-error
    this.logger.debug(`InternalServeExceptionFilter ${exception}`);

    if (exception instanceof InternalServerErrorException) {
      this.logger.warn(
        `filter: InternalServeExceptionFilter; catch internal server error: ${exception.message}`,
        exception.stack,
      );
      const redirectTo = request.originalUrl;
      response.redirect(`/internal-server-error?redirectTo=${redirectTo}`);
    } else {
      throw exception;
    }
  }
}
