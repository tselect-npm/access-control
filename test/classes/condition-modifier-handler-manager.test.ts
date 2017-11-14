import { ConditionModifierHandlersManager } from '../../';

describe('ConditionModifierHandlersManager', () => {
  const handlersManager = new ConditionModifierHandlersManager();

  describe('#exactValue()', () => {
    it('should return true', () => {
      expect(handlersManager.exactValue(() => true, [], null)).to.equal(true);
    });
    it('should return false', () => {
      expect(handlersManager.exactValue(() => false, [], null)).to.equal(false);
    });
  });

  describe('#exactValueIfExists()', () => {
    it('should return true if not exists', () => {
      expect(handlersManager.exactValueIfExists(() => false, [], undefined)).to.equal(true);
    });
    it('should return true', () => {
      expect(handlersManager.exactValueIfExists(() => true, [], null)).to.equal(true);
    });
    it('should return false', () => {
      expect(handlersManager.exactValueIfExists(() => false, [], null)).to.equal(false);
    });
  });

  describe('#forAllValues()', () => {
    it('should return true if all return true', () => {
      expect(handlersManager.forAllValues(() => true, ['foo', 'bar'], 'bar')).to.equal(true);
    });
    it('should return false if all return false', () => {
      expect(handlersManager.forAllValues(() => false, ['foo', 'bar'], 'bar')).to.equal(false);
    });
    it('should return false if one return false', () => {
      let count = 3;
      expect(handlersManager.forAllValues(() => --count !== 0, ['foo', 'bar', 'baz'], 'bar')).to.equal(false);
    });
  });

  describe('#forAllValuesIfExists()', () => {
    it('should return true if not exists', () => {
      expect(handlersManager.forAllValuesIfExists(() => false, [], undefined)).to.equal(true);
    });
    it('should return true if all return true', () => {
      expect(handlersManager.forAllValuesIfExists(() => true, ['foo', 'bar'], 'bar')).to.equal(true);
    });
    it('should return false if all return false', () => {
      expect(handlersManager.forAllValuesIfExists(() => false, ['foo', 'bar'], 'bar')).to.equal(false);
    });
    it('should return false if one return false', () => {
      let count = 3;
      expect(handlersManager.forAllValuesIfExists(() => --count !== 0, ['foo', 'bar', 'baz'], 'bar')).to.equal(false);
    });
  });

  describe('#forAnyValue()', () => {
    it('should return true if all return true', () => {
      expect(handlersManager.forAnyValue(() => true, ['foo', 'bar'], 'bar')).to.equal(true);
    });
    it('should return false if all return false', () => {
      expect(handlersManager.forAnyValue(() => false, ['foo', 'bar'], 'bar')).to.equal(false);
    });
    it('should return true if one return false', () => {
      let count = 3;
      expect(handlersManager.forAnyValue(() => --count !== 0, ['foo', 'bar', 'baz'], 'bar')).to.equal(true);
    });
  });

  describe('#forAnyValueIfExists()', () => {
    it('should return true if not exists', () => {
      expect(handlersManager.forAnyValueIfExists(() => false, [], undefined)).to.equal(true);
    });
    it('should return true if all return true', () => {
      expect(handlersManager.forAnyValueIfExists(() => true, ['foo', 'bar'], 'bar')).to.equal(true);
    });
    it('should return false if all return false', () => {
      expect(handlersManager.forAnyValueIfExists(() => false, ['foo', 'bar'], 'bar')).to.equal(false);
    });
    it('should return true if one return false', () => {
      let count = 3;
      expect(handlersManager.forAnyValueIfExists(() => --count !== 0, ['foo', 'bar', 'baz'], 'bar')).to.equal(true);
    });
  });
});