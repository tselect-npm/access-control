import { StringConditionOperationMatcher } from '../../../';
import { ComparisonOperator } from '../../../src/constants/comparison-operator';
import { UnmappedConditionOperatorError } from '../../../src/classes/errors/unmapped-condition-operator';

describe.only('StringConditionOperationMatcher', () => {
  const matcher = new StringConditionOperationMatcher();

  describe('#matches()', () => {
    it('should throw for an unmapped operator', () => {
      expect(() => {
        matcher.matches('abc' as ComparisonOperator, [], null);
      }).to.throw(UnmappedConditionOperatorError);
    });

    for (const operator of [ComparisonOperator.STRING_EQUALS, ComparisonOperator.STRING_EQUALS_IF_EXISTS]) {
      describe(operator, () => {
        it('should return true if string matches (single value)', () => {
          expect(matcher.matches(operator, ['foo'], 'foo')).to.equal(true);
        });
        it('should return false if string does NOT matches (single value)', () => {
          expect(matcher.matches(operator, ['foo'], 'bar')).to.equal(false);
        });
        it('should return true if string matches (multi value)', () => {
          expect(matcher.matches(operator, ['bar', 'foo'], 'foo')).to.equal(true);
        });
        it('should return false if string does NOT matches (multi value)', () => {
          expect(matcher.matches(operator, ['foo', 'bar'], 'baz')).to.equal(false);
        });
        it('should return if env is not a string', () => {
          expect(matcher.matches(operator, ['foo'], 123)).to.equal(false);
        });
      });
    }

    for (const operator of [ComparisonOperator.STRING_NOT_EQUALS, ComparisonOperator.STRING_NOT_EQUALS_IF_EXISTS]) {
      describe(operator, () => {
        it('should return true if string matches (single value)', () => {
          expect(matcher.matches(operator, ['foo'], 'bar')).to.equal(true);
        });
        it('should return false if string does NOT matches (single value)', () => {
          expect(matcher.matches(operator, ['foo'], 'foo')).to.equal(false);
        });
        it('should return true if string matches (multi value)', () => {
          expect(matcher.matches(operator, ['bar', 'foo'], 'baz')).to.equal(true);
        });
        it('should return false if string does NOT matches (multi value)', () => {
          expect(matcher.matches(operator, ['foo', 'bar'], 'foo')).to.equal(false);
        });
        it('should return if env is not a string', () => {
          expect(matcher.matches(operator, ['foo'], 123)).to.equal(false);
        });
      });
    }
  });
});