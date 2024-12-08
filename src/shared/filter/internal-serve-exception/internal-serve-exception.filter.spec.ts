import { InternalServeExceptionFilter } from './internal-serve-exception.filter';
import { ArgumentsHost, InternalServerErrorException } from '@nestjs/common';

describe('InternalServeExceptionFilter', () => {
  let filter: InternalServeExceptionFilter;

  beforeEach(() => {
    filter = new InternalServeExceptionFilter();
  });

  it('should be defined', () => {
    expect(new InternalServeExceptionFilter()).toBeDefined();
  });

  it('redirect', () => {
    const mockResponse = {
      redirect: jest.fn(),
    };
    const mockRequest = {
      originalUrl: '/test-route',
    };
    const mockArgumentHost = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => mockRequest),
        getResponse: jest.fn(() => mockResponse),
      })),
    } as unknown as ArgumentsHost;

    const exception = new InternalServerErrorException();

    filter.catch(exception, mockArgumentHost);
    expect(mockResponse.redirect).toHaveBeenCalledWith(
      '/internal-server-error?redirectTo=/test-route',
    );
  });
});
