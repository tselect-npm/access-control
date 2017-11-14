import { isIfExistsModifier } from '../../src/utils/is-if-exists-modifier';
import { ConditionOperator } from '../../src/constants/condition-operator';

export { isIfExistsModifier } from '../../';

describe('isIfExistsOperator()', () => {
  it('should return true', () => {
    expect(isIfExistsModifier('abcIfExists' as ConditionOperator)).to.equal(true);
  });
  it('should return false', () => {
    expect(isIfExistsModifier('abc' as ConditionOperator)).to.equal(false);
  });
});