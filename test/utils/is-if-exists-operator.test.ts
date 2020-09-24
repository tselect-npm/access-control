import { expect } from 'chai';

export { isIfExistsModifier } from '../../src';
import { isIfExistsModifier } from '../../src/utils/is-if-exists-modifier';
import { ConditionOperator } from '../../src/constants/condition-operator';

describe('isIfExistsOperator()', () => {
  it('should return true', () => {
    expect(isIfExistsModifier('abcIfExists' as ConditionOperator)).to.equal(true);
  });
  it('should return false', () => {
    expect(isIfExistsModifier('abc' as ConditionOperator)).to.equal(false);
  });
});
