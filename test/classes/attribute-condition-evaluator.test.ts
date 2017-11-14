import { AttributeConditionEvaluation, ConditionOperator } from '../../';

describe('AttributeConditionEvaluator', () => {
  describe('getters', () => {
    const evaluation = new AttributeConditionEvaluation({
      result: true,
      attributeName: 'foo',
      environmentValue: null,
      operator: 'foo' as ConditionOperator
    });

    const tests = [
      ['getResult', true],
      ['getAttributeName', 'foo'],
      ['getEnvironmentValue', null],
      ['getOperator', 'foo']
    ];

    for (const tuple of tests) {
      it(`should call getter ${tuple[0]}()`, () => {
        expect((evaluation[tuple[0] as keyof AttributeConditionEvaluation])()).to.equal(tuple[1]);
      });
    }
  });

  describe('#succeeded()', () => {
    it('should return true', () => {
      const evaluation = new AttributeConditionEvaluation({
        result: true,
        attributeName: 'foo',
        environmentValue: null,
        operator: 'foo' as ConditionOperator
      });
      expect(evaluation.succeeded()).to.equal(true);
    });
    it('should return false', () => {
      const evaluation = new AttributeConditionEvaluation({
        result: false,
        attributeName: 'foo',
        environmentValue: null,
        operator: 'foo' as ConditionOperator
      });
      expect(evaluation.succeeded()).to.equal(false);
    });
  });

  describe('#failed()', () => {
    it('should return true', () => {
      const evaluation = new AttributeConditionEvaluation({
        result: false,
        attributeName: 'foo',
        environmentValue: null,
        operator: 'foo' as ConditionOperator
      });
      expect(evaluation.failed()).to.equal(true);
    });
    it('should return false', () => {
      const evaluation = new AttributeConditionEvaluation({
        result: true,
        attributeName: 'foo',
        environmentValue: null,
        operator: 'foo' as ConditionOperator
      });
      expect(evaluation.failed()).to.equal(false);
    });
  });

  describe('#toJSON()', () => {
    it('should return a JSON representation', () => {
      const options = {
        result: true,
        attributeName: 'foo',
        environmentValue: null,
        operator: 'foo' as ConditionOperator
      };

      const evaluation = new AttributeConditionEvaluation(options);
      expect(evaluation.toJSON()).to.deep.equal(options);
    });
  });
});