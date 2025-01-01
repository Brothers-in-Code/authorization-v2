import { SubscriptionGuard } from './subscription.guard';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { UnauthorizedStatus } from 'src/shared/enum/unauthorized-enum';

describe('SubscriptionGuard Unit Tests', () => {
  let guard: SubscriptionGuard;
  let jwtService: Partial<JwtService>;
  let context: ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn((prop: string) => {
              if (prop === 'mockUserToken') {
                return { sub: 1 };
              } else {
                return {};
              }
            }),
          },
        },
      ],
    }).compile();

    guard = module.get<SubscriptionGuard>(SubscriptionGuard);
    jwtService = module.get<JwtService>(JwtService);

    context = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {
            user_token: 'mockUserToken',
            user_subscription: 'mockUserSubscription',
          },
        }),
      }),
    } as ExecutionContext;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true', async () => {
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: 1 });
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({
      subscription: true,
      endDate: Date.now() + 1000,
    });
    const result = await guard.canActivate(context);
    expect(result).toBeTruthy();
  });

  it('should return EXPIRED_TOKEN', async () => {
    // jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: 1 });
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({
      subscription: true,
      endDate: Date.now() - 1000,
    });
    const result = guard.canActivate(context);
    // todo спросить Павла как вернуть userId
    await expect(result).rejects.toThrow(
      new UnauthorizedException(
        `SUBSCRIPTION_GUARD: userId undefined, ${UnauthorizedStatus.EXPIRED_TOKEN}`,
      ),
    );
  });

  it('should return NO_TOKEN', async () => {
    context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user_token: 'mockUserToken',
        }),
      }),
    } as ExecutionContext;

    const result = guard.canActivate(context);
    await expect(result).rejects.toThrow(
      new UnauthorizedException(
        `SUBSCRIPTION_GUARD: userId null, ${UnauthorizedStatus.NO_TOKEN}`,
      ),
    );
  });
});
