import { isIfExistsOperator } from '../../src/utils/is-if-exists-operator';
import { ComparisonOperator } from '../../src/constants/comparison-operator';

export { isIfExistsOperator } from '../../';

describe('isIfExistsOperator()', () => {
  it('should return true', () => {
    expect(isIfExistsOperator('abcIfExists' as ComparisonOperator)).to.equal(true);
  });
  it('should return false', () => {
    expect(isIfExistsOperator('abc' as ComparisonOperator)).to.equal(false);
  });
});