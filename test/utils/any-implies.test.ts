import { anyImplies } from '../../';

describe('anyImplies()', () => {
  it('should return true for matching value', () => {
    expect(anyImplies(['foo', 'bar'], 'foo')).to.equal(true);
  });
  it('should return true for wild card', () => {
    expect(anyImplies(['*', 'bar'], 'foo')).to.equal(true);
  });
  it('should return false for no matching value', () => {
    expect(anyImplies(['foo', 'bar'], 'baz')).to.equal(false);
  });
});