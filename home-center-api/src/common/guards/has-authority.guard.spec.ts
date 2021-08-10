import { HasAuthorityGuard } from './has-authority.guard';

describe('HasAuthorityGuard', () => {
  it('should be defined', () => {
    expect(new HasAuthorityGuard()).toBeDefined();
  });
});
