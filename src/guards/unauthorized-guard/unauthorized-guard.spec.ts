import { UnauthorizedGuard } from './unauthorized-guard';

describe('UnauthorizedGuard', () => {
  it('should be defined', () => {
    expect(new UnauthorizedGuard()).toBeDefined();
  });
});
