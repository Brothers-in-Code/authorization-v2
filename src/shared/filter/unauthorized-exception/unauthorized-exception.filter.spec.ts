import {
  ArgumentsHost,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UnauthorizedExceptionFilter } from './unauthorized-exception.filter';

describe('UnauthorizedExceptionFilter', () => {
  let filter: UnauthorizedExceptionFilter;

  beforeEach(() => {
    filter = new UnauthorizedExceptionFilter();
  });

  it('should be defined', () => {
    expect(new UnauthorizedExceptionFilter()).toBeDefined();
  });
});
