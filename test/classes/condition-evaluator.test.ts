import { ConditionEvaluator } from '../../';
import { ConditionEvaluationResultCode } from '../../src/constants/condition-evaluation-result-code';
import { ConditionEvaluationErrorCode } from '../../src/constants/condition-evaluation-error-code';

class TestableConditionEvaluator extends ConditionEvaluator {

}

describe('ConditionEvaluator', () => {
  const conditionEvaluator = new TestableConditionEvaluator();

  describe('#evaluate()', () => {
    it('should return a positive evaluation if no condition', () => {
      const evaluation = conditionEvaluator.evaluate(null, {});
      expect(evaluation.succeeded()).to.equal(true);
      expect(evaluation.getResultCode()).to.equal(ConditionEvaluationResultCode.SUCCESS);
      expect(evaluation.getErrorCode()).to.equal(null);
      expect(evaluation.getErrorDetails()).to.equal(null);
    });
    it('should return a positive evaluation for an empty condition', () => {
      const evaluation = conditionEvaluator.evaluate({}, {});
      expect(evaluation.succeeded()).to.equal(true);
      expect(evaluation.getResultCode()).to.equal(ConditionEvaluationResultCode.SUCCESS);
      expect(evaluation.getErrorCode()).to.equal(null);
      expect(evaluation.getErrorDetails()).to.equal(null);
    });
    it('should return a negative evaluation if condition is invalid', () => {
      const evaluation = conditionEvaluator.evaluate([] as any, {});
      expect(evaluation.succeeded()).to.equal(false);
      expect(evaluation.getResultCode()).to.equal(ConditionEvaluationResultCode.ERROR);
      expect(evaluation.getErrorCode()).to.equal(ConditionEvaluationErrorCode.MALFORMED_CONDITION);
      expect(evaluation.getErrorDetails()).to.deep.equal({ value: [] });
    });
    it('should return a negative evaluation if condition contains an unknown operator', () => {
      const evaluation = conditionEvaluator.evaluate({
        wrong: { exactValue: 'blah' }
      } as any, { foo: '' });
      expect(evaluation.succeeded()).to.equal(false);
      expect(evaluation.getResultCode()).to.equal(ConditionEvaluationResultCode.ERROR);
      expect(evaluation.getErrorCode()).to.equal(ConditionEvaluationErrorCode.UNKNOWN_OPERATOR);
      expect(evaluation.getErrorDetails()).to.deep.equal({ value: 'wrong' });
    });
    it('should return a negative evaluation if condition contains an unknown modifier', () => {
      const evaluation = conditionEvaluator.evaluate({
        numberGreaterThan: { foo: 'blah' }
      } as any, { foo: '' });
      expect(evaluation.succeeded()).to.equal(false);
      expect(evaluation.getResultCode()).to.equal(ConditionEvaluationResultCode.ERROR);
      expect(evaluation.getErrorCode()).to.equal(ConditionEvaluationErrorCode.UNKNOWN_MODIFIER);
      expect(evaluation.getErrorDetails()).to.deep.equal({ value: 'foo' });
    });
    it('should return a positive evaluation if condition is met', () => {
      const evaluation = conditionEvaluator.evaluate({
        numberGreaterThan: {
          simpleValue: {
            foo: '13'
          }
        }
      }, { foo: 15 });
      expect(evaluation.succeeded()).to.equal(true);
    });
    it('should return a positive evaluation if env is undefined but operator is optional', () => {
      const evaluation = conditionEvaluator.evaluate({
        numberGreaterThan: {
          simpleValueIfExists: {
            foo: '13'
          }
        }
      }, {});
      expect(evaluation.succeeded()).to.equal(true);
    });
    it('should return a negative evaluation if condition is NOT met', () => {
      const evaluation = conditionEvaluator.evaluate({
        numberGreaterThan: {
          simpleValueIfExists: {
            foo: '13'
          }
        }
      }, { foo: 11 });
      expect(evaluation.succeeded()).to.equal(false);
    });
    it('should return a negative evaluation if condition is NOT met', () => {
      const evaluation = conditionEvaluator.evaluate({
        numberGreaterThan: {
          simpleValueIfExists: {
            foo: '13'
          }
        }
      }, { foo: 11 });
      expect(evaluation.succeeded()).to.equal(false);
      expect(evaluation.getResultCode()).to.equal(ConditionEvaluationResultCode.FAILURE);
      expect(evaluation.getErrorCode()).to.equal(null);
      expect(evaluation.getErrorDetails()).to.equal(null);
    });
    it('should return a negative evaluation if env value is invalid', () => {
      const evaluation = conditionEvaluator.evaluate({
        numberGreaterThan: {
          simpleValueIfExists: {
            foo: '13'
          }
        }
      }, { foo: true });
      expect(evaluation.succeeded()).to.equal(false);
      expect(evaluation.getResultCode()).to.equal(ConditionEvaluationResultCode.ERROR);
      expect(evaluation.getErrorCode()).to.equal(ConditionEvaluationErrorCode.INVALID_ENVIRONMENT_VALUE);
      expect(evaluation.getErrorDetails()).to.deep.equal({ attribute: 'foo', operator: 'numberGreaterThan', modifier: 'simpleValueIfExists', value: true });
    });
    it('should return a negative evaluation if condition value is invalid', () => {
      const evaluation = conditionEvaluator.evaluate({
        numberGreaterThan: {
          simpleValueIfExists: {
            foo: 'true'
          }
        }
      }, { foo: 13 });
      expect(evaluation.succeeded()).to.equal(false);
      expect(evaluation.getResultCode()).to.equal(ConditionEvaluationResultCode.ERROR);
      expect(evaluation.getErrorCode()).to.equal(ConditionEvaluationErrorCode.INVALID_CONDITION_VALUE);
      expect(evaluation.getErrorDetails()).to.deep.equal({ attribute: 'foo', operator: 'numberGreaterThan', modifier: 'simpleValueIfExists', value: 'true' });
    });
  });
});