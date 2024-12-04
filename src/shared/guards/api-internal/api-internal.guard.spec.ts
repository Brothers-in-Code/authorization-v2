import { ConfigService } from '@nestjs/config';
import { ApiInternalGuard } from './api-internal.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('InternalGuard', () => {
  let guard: ApiInternalGuard;
  let configServiceMock: Partial<ConfigService>;

  beforeEach(() => {
    configServiceMock = {
      get: jest.fn().mockReturnValue('test-secret'),
    } as unknown as Partial<ConfigService>;
    guard = new ApiInternalGuard(configServiceMock as ConfigService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: 'Bearer test-secret',
        },
      }),
    };
    const result = await guard.canActivate(context as any);
    expect(result).toBe(true);
  });

  it('should return error', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: 'Bearer wrang-secret',
        },
      }),
    };
    const result = guard.canActivate(context as unknown as ExecutionContext);
    expect(result).rejects.toThrow(
      new UnauthorizedException(
        'API_INTERNAL_GUARD: Wrong Authorization header',
      ),
    );
  });

  it('should return error', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: 'WrongBearer test-secret',
        },
      }),
    };
    const result = guard.canActivate(context as unknown as ExecutionContext);
    expect(result).rejects.toThrow(
      new UnauthorizedException(
        'API_INTERNAL_GUARD: Wrong Authorization header',
      ),
    );
  });

  it('should return error', () => {
    const context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      }),
    };

    const result = guard.canActivate(context as unknown as ExecutionContext);
    expect(result).rejects.toThrow(
      new UnauthorizedException(
        'API_INTERNAL_GUARD: There is no Authorization header',
      ),
    );
  });
});
