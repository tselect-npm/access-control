import { ConditionEvaluator } from '../../';
import { MalformedConditionError } from '../../src/classes/errors/malformed-condition';
import { UnmappedConditionOperatorError } from '../../src/classes/errors/unmapped-condition-operator';

class TestableConditionEvaluator extends ConditionEvaluator {

}

describe('ConditionEvaluator', () => {
  const conditionEvaluator = new TestableConditionEvaluator();

  describe('#evaluate()', () => {
    it('should return a positive evaluation if no condition', () => {
      const evaluation = conditionEvaluator.evaluate(null, {});
      expect(evaluation.succeeded()).to.equal(true);
    });
    it('should return a positive evaluation for an empty condition', () => {
      const evaluation = conditionEvaluator.evaluate({}, {});
      expect(evaluation.succeeded()).to.equal(true);
    });
    it('should throw if condition is invalid', () => {
      expect(() => conditionEvaluator.evaluate([] as any, {})).to.throw(MalformedConditionError);
    });
    it('should throw if condition contains an unknown operator', () => {
      expect(() => conditionEvaluator.evaluate({
        wrong: { foo: 'blah' }
      } as any, { foo: '' })).to.throw(UnmappedConditionOperatorError);
    });
    it('should return a positive evaluation if condition is met', () => {
      const evaluation = conditionEvaluator.evaluate({
        numberGreaterThan: {
          foo: '13'
        }
      }, { foo: 15 });
      expect(evaluation.succeeded()).to.equal(true);
    });
    it('should return a positive evaluation if env is undefined but operator if optional', () => {
      const evaluation = conditionEvaluator.evaluate({
        numberGreaterThanIfExists: {
          foo: '13'
        }
      }, {});
      expect(evaluation.succeeded()).to.equal(true);
    });
    it('should return a negative evaluation if condition is NOT met', () => {
      const evaluation = conditionEvaluator.evaluate({
        numberGreaterThanIfExists: {
          foo: '13'
        }
      }, { foo: 11 });
      expect(evaluation.succeeded()).to.equal(false);
    });
    it('should return a negative evaluation if condition is NOT met', () => {
      const evaluation = conditionEvaluator.evaluate({
        numberGreaterThanIfExists: {
          foo: '13'
        }
      }, { foo: 11 });
      expect(evaluation.succeeded()).to.equal(false);
    });
    it('should return a negative evaluation if env is undefined and operator not optional', () => {
      const evaluation = conditionEvaluator.evaluate({
        numberGreaterThan: {
          foo: '13'
        }
      }, {});
      expect(evaluation.succeeded()).to.equal(false);
    });
  });
});