import { ConditionModifiersManager } from '../../';

describe('ConditionModifiersManager', () => {
  const handlersManager = new ConditionModifiersManager();

  describe('#simpleValue()', () => {
    it('should return true', () => {
      expect(handlersManager.simpleValue(() => true, ['foo'], [null])).to.equal(true);
    });
    it('should return false', () => {
      expect(handlersManager.simpleValue(() => false, ['foo'], [null])).to.equal(false);
    });
  });

  describe('#simpleValueIfExists()', () => {
    it('should return true if not exists', () => {
      expect(handlersManager.simpleValueIfExists(() => false, ['foo'], [undefined])).to.equal(true);
    });
    it('should return true', () => {
      expect(handlersManager.simpleValueIfExists(() => true, ['foo'], [null])).to.equal(true);
    });
    it('should return false', () => {
      expect(handlersManager.simpleValueIfExists(() => false, ['foo'], [null])).to.equal(false);
    });
  });

  describe('#forAllValues()', () => {
    it('should return true if all return true', () => {
      expect(handlersManager.forAllValues(() => true, ['foo', 'bar'], ['bar'])).to.equal(true);
    });
    it('should return false if all return false', () => {
      expect(handlersManager.forAllValues(() => false, ['foo', 'bar'], ['bar'])).to.equal(false);
    });
    it('should return false if one return false', () => {
      expect(handlersManager.forAllValues((a, b) => a === b, ['foo', 'bar', 'baz'], ['bar', 'boz'])).to.equal(false);
    });
  });

  describe('#forAllValuesIfExists()', () => {
    it('should return true if not exists', () => {
      expect(handlersManager.forAllValuesIfExists(() => false, ['foo'], [undefined])).to.equal(true);
    });
    it('should return true if all return true', () => {
      expect(handlersManager.forAllValuesIfExists(() => true, ['foo', 'bar'], ['bar'])).to.equal(true);
    });
    it('should return false if all return false', () => {
      expect(handlersManager.forAllValuesIfExists(() => false, ['foo', 'bar'], ['bar'])).to.equal(false);
    });
    it('should return false if one return false', () => {
      expect(handlersManager.forAllValuesIfExists((a, b) => a === b, ['foo', 'bar', 'baz'], ['bar', 'boz'])).to.equal(false);
    });
  });

  describe('#forAnyValue()', () => {
    it('should return true if all return true', () => {
      expect(handlersManager.forAnyValue(() => true, ['foo', 'bar'], ['bar'])).to.equal(true);
    });
    it('should return false if all return false', () => {
      expect(handlersManager.forAnyValue(() => false, ['foo', 'bar'], ['bar'])).to.equal(false);
    });
    it('should return true if one return false', () => {
      expect(handlersManager.forAnyValue((a, b) => a === b, ['foo', 'bar', 'baz'], ['bar', 'boz'])).to.equal(true);
    });
  });

  describe('#forAnyValueIfExists()', () => {
    it('should return true if not exists', () => {
      expect(handlersManager.forAnyValueIfExists(() => false, ['foo'], [undefined])).to.equal(true);
    });
    it('should return true if all return true', () => {
      expect(handlersManager.forAnyValueIfExists(() => true, ['foo', 'bar'], ['bar'])).to.equal(true);
    });
    it('should return false if all return false', () => {
      expect(handlersManager.forAnyValueIfExists(() => false, ['foo', 'bar'], ['bar'])).to.equal(false);
    });
    it('should return true if one return false', () => {
      expect(handlersManager.forAnyValueIfExists((a, b) => a === b, ['foo', 'bar', 'baz'], ['bar', 'boz'])).to.equal(true);
    });
  });
});