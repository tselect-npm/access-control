import { ConditionEvaluation } from '../../';

describe('ConditionEvaluation', () => {
  describe('getters', () => {
    const evaluation = new ConditionEvaluation({ result: false, failedAttributeConditionEvaluation: 'foo' as any });
    const tests = [
      ['getResult', false],
      ['getFailedAttributeConditionEvaluation', 'foo']
    ];

    for (const tuple of tests) {
      it(`should call getter ${tuple[0]}()`, () => {
        expect(evaluation[tuple[0] as keyof ConditionEvaluation]()).to.equal(tuple[1]);
      });
    }
  });

  describe('#succeeded()', () => {
    it('should return true', () => {
      const evaluation = new ConditionEvaluation({
        result: true
      });
      expect(evaluation.succeeded()).to.equal(true);
    });
    it('should return false', () => {
      const evaluation = new ConditionEvaluation({
        result: false
      });
      expect(evaluation.succeeded()).to.equal(false);
    });
  });

  describe('#failed()', () => {
    it('should return true', () => {
      const evaluation = new ConditionEvaluation({
        result: false
      });
      expect(evaluation.failed()).to.equal(true);
    });
    it('should return false', () => {
      const evaluation = new ConditionEvaluation({
        result: true
      });
      expect(evaluation.failed()).to.equal(false);
    });
  });

  describe('#toJSON()', () => {
    it('should return a JSON representation', () => {
      const options = {
        result: true,
        failedAttributeConditionEvaluation: null
      };

      const evaluation = new ConditionEvaluation(options);
      expect(evaluation.toJSON()).to.deep.equal(options);
    });
    it('should return a JSON representation including failed attribute', () => {
      const evaluation = new ConditionEvaluation({
        result: true,
        failedAttributeConditionEvaluation: { toJSON: () => ({ foo: 'bar' }) } as any
      });
      expect(evaluation.toJSON()).to.deep.equal({
        result: true,
        failedAttributeConditionEvaluation: { foo: 'bar' }
      });
    });
  });
});