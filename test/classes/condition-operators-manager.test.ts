import { ConditionOperatorsManager } from '../../';
import { InvalidConditionValueError } from '../../src/classes/errors/invalid-condition-value';
import { InvalidEnvironmentValueError } from '../../src/classes/errors/invalid-enviroment-value';

describe('ConditionOperatorsManager', () => {
  const handlersManager = new ConditionOperatorsManager();

  describe('#stringEquals()', () => {
    it('should throw if env value is not a string', () => {
      expect(() => {
        handlersManager.stringEquals('34', 34);
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should return true if values match', () => {
      expect(handlersManager.stringEquals('foo', 'foo')).to.equal(true);
    });
    it('should return false if values differ', () => {
      expect(handlersManager.stringEquals('foo', 'bar')).to.equal(false);
    });
  });
  describe('#stringNotEquals()', () => {
    it('should throw if env value is not a string', () => {
      expect(() => {
        handlersManager.stringNotEquals('34', 34);
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should return true if values differ', () => {
      expect(handlersManager.stringNotEquals('foo', 'bar')).to.equal(true);
    });
    it('should return false if values match', () => {
      expect(handlersManager.stringNotEquals('foo', 'foo')).to.equal(false);
    });
  });
  describe('#stringImplies()', () => {
    it('should throw if env value is not a string', () => {
      expect(() => {
        handlersManager.stringImplies('34', 34);
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should return true if values match', () => {
      expect(handlersManager.stringImplies('foo.*', 'foo.bar')).to.equal(true);
    });
    it('should return false if values differ', () => {
      expect(handlersManager.stringImplies('foo.bar', 'foo.baz')).to.equal(false);
    });
  });
  describe('#stringNotImplies()', () => {
    it('should throw if env value is not a string', () => {
      expect(() => {
        handlersManager.stringNotImplies('34', 34);
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should return true if values match', () => {
      expect(handlersManager.stringNotImplies('foo.*', 'foo.bar')).to.equal(false);
    });
    it('should return false if values differ', () => {
      expect(handlersManager.stringNotImplies('foo.bar', 'foo.baz')).to.equal(true);
    });
  });
  describe('#numberEquals()', () => {
    it('should throw if env value is not a number', () => {
      expect(() => {
        handlersManager.numberEquals('3', '3');
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should return true if values match', () => {
      expect(handlersManager.numberEquals('3', 3)).to.equal(true);
    });
    it('should return false if values differ', () => {
      expect(handlersManager.numberEquals('3', 4)).to.equal(false);
    });
    it('should throw if condition value is not a number', () => {
      expect(() => {
        handlersManager.numberEquals('12rwe', 12);
      }).to.throw(InvalidConditionValueError);
    });
  });
  describe('#numberNotEquals()', () => {
    it('should throw if env value is not a number', () => {
      expect(() => {
        handlersManager.numberNotEquals('3', '3');
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should return false if values match', () => {
      expect(handlersManager.numberNotEquals('3', 3)).to.equal(false);
    });
    it('should return true if values differ', () => {
      expect(handlersManager.numberNotEquals('3', 4)).to.equal(true);
    });
    it('should throw if condition value is not a number', () => {
      expect(() => {
        handlersManager.numberNotEquals('12rwe', 12);
      }).to.throw(InvalidConditionValueError);
    });
  });
  describe('#numberGreaterThan()', () => {
    it('should throw if env value is not a number', () => {
      expect(() => {
        handlersManager.numberGreaterThan('3', '3');
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should throw if condition value is not a number', () => {
      expect(() => {
        handlersManager.numberGreaterThan('12rwe', 12);
      }).to.throw(InvalidConditionValueError);
    });
    it('should return false if lower', () => {
      expect(handlersManager.numberGreaterThan('23', 12)).to.equal(false);
    });
    it('should return true if greater', () => {
      expect(handlersManager.numberGreaterThan('23', 28)).to.equal(true);
    });
  });
  describe('#numberGreaterThanEquals()', () => {
    it('should throw if env value is not a number', () => {
      expect(() => {
        handlersManager.numberGreaterThanEquals('3', '3');
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should throw if condition value is not a number', () => {
      expect(() => {
        handlersManager.numberGreaterThanEquals('12rwe', 12);
      }).to.throw(InvalidConditionValueError);
    });
    it('should return false if lower', () => {
      expect(handlersManager.numberGreaterThanEquals('23', 12)).to.equal(false);
    });
    it('should return true if greater', () => {
      expect(handlersManager.numberGreaterThanEquals('23', 28)).to.equal(true);
    });
    it('should return true if equal', () => {
      expect(handlersManager.numberGreaterThanEquals('23', 23)).to.equal(true);
    });
  });
  describe('#numberLowerThan()', () => {
    it('should throw if env value is not a number', () => {
      expect(() => {
        handlersManager.numberLowerThan('3', '3');
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should throw if condition value is not a number', () => {
      expect(() => {
        handlersManager.numberLowerThan('12rwe', 12);
      }).to.throw(InvalidConditionValueError);
    });
    it('should return true if lower', () => {
      expect(handlersManager.numberLowerThan('23', 12)).to.equal(true);
    });
    it('should return false if greater', () => {
      expect(handlersManager.numberLowerThan('23', 28)).to.equal(false);
    });
  });
  describe('#numberLowerThanEquals()', () => {
    it('should throw if env value is not a number', () => {
      expect(() => {
        handlersManager.numberLowerThanEquals('3', '3');
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should throw if condition value is not a number', () => {
      expect(() => {
        handlersManager.numberLowerThanEquals('12rwe', 12);
      }).to.throw(InvalidConditionValueError);
    });
    it('should return true if lower', () => {
      expect(handlersManager.numberLowerThanEquals('23', 12)).to.equal(true);
    });
    it('should return false if greater', () => {
      expect(handlersManager.numberLowerThanEquals('23', 28)).to.equal(false);
    });
    it('should return true if equal', () => {
      expect(handlersManager.numberLowerThanEquals('23', 23)).to.equal(true);
    });
  });
  describe('#bool()', () => {
    it('should throw if env value is not a boolean', () => {
      expect(() => {
        handlersManager.bool('true', 23);
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should throw if condition value is not a boolean', () => {
      expect(() => {
        handlersManager.bool('trues', true);
      }).to.throw(InvalidConditionValueError);
    });
    it('should return true if values match (true)', () => {
      expect(handlersManager.bool('true', true)).to.equal(true);
    });
    it('should return false if values differ (true)', () => {
      expect(handlersManager.bool('true', false)).to.equal(false);
    });
    it('should return true if values match (false)', () => {
      expect(handlersManager.bool('false', false)).to.equal(true);
    });
    it('should return false if values differ (false)', () => {
      expect(handlersManager.bool('false', true)).to.equal(false);
    });
  });
  describe('#null()', () => {
    it('should throw if condition value is not a boolean', () => {
      expect(() => {
        handlersManager.null('trues', true);
      }).to.throw(InvalidConditionValueError);
    });
    it('should return true if values match (true - null)', () => {
      expect(handlersManager.null('true', null)).to.equal(true);
    });
    it('should return false if values differ (true - not null)', () => {
      expect(handlersManager.null('true', true)).to.equal(false);
    });
    it('should return true if values match (false - null)', () => {
      expect(handlersManager.null('false', true)).to.equal(true);
    });
    it('should return false if values differ (false - not null)', () => {
      expect(handlersManager.null('false', null)).to.equal(false);
    });
  });
  describe('#dateEquals()', () => {
    const now = new Date();
    const other = new Date(now.getTime() + 1);

    it('should throw if env value is not a date', () => {
      expect(() => {
        handlersManager.dateEquals(now.toISOString(), 'foo');
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should throw if condition value is not a date', () => {
      expect(() => {
        handlersManager.dateEquals('foo', now.toISOString());
      }).to.throw(InvalidConditionValueError);
    });
    it('should throw if env value is date but NaN', () => {
      expect(() => {
        handlersManager.dateEquals(now.toISOString(), new Date('abc'));
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should return true is values match (timestamp)', () => {
      expect(handlersManager.dateEquals(now.toISOString(), now.getTime())).to.equal(true);
    });
    it('should return true is values match (date)', () => {
      expect(handlersManager.dateEquals(now.toISOString(), now)).to.equal(true);
    });
    it('should return true is values match (iso)', () => {
      expect(handlersManager.dateEquals(now.toISOString(), now.toISOString())).to.equal(true);
    });
    it('should return false is values differ (timestamp)', () => {
      expect(handlersManager.dateEquals(now.toISOString(), other.getTime())).to.equal(false);
    });
    it('should return false is values differ (date)', () => {
      expect(handlersManager.dateEquals(now.toISOString(), other)).to.equal(false);
    });
    it('should return false is values differ (iso)', () => {
      expect(handlersManager.dateEquals(now.toISOString(), other.toISOString())).to.equal(false);
    });
  });
  describe('#dateNotEquals()', () => {
    const now = new Date();
    const other = new Date(now.getTime() + 1);

    it('should throw if env value is not a date', () => {
      expect(() => {
        handlersManager.dateNotEquals(now.toISOString(), 'foo');
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should throw if condition value is not a date', () => {
      expect(() => {
        handlersManager.dateNotEquals('foo', now.toISOString());
      }).to.throw(InvalidConditionValueError);
    });
    it('should throw if env value is date but NaN', () => {
      expect(() => {
        handlersManager.dateNotEquals(now.toISOString(), new Date('abc'));
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should return false is values match (timestamp)', () => {
      expect(handlersManager.dateNotEquals(now.toISOString(), now.getTime())).to.equal(false);
    });
    it('should return false is values match (date)', () => {
      expect(handlersManager.dateNotEquals(now.toISOString(), now)).to.equal(false);
    });
    it('should return false is values match (iso)', () => {
      expect(handlersManager.dateNotEquals(now.toISOString(), now.toISOString())).to.equal(false);
    });
    it('should return true is values differ (timestamp)', () => {
      expect(handlersManager.dateNotEquals(now.toISOString(), other.getTime())).to.equal(true);
    });
    it('should return true is values differ (date)', () => {
      expect(handlersManager.dateNotEquals(now.toISOString(), other)).to.equal(true);
    });
    it('should return true is values differ (iso)', () => {
      expect(handlersManager.dateNotEquals(now.toISOString(), other.toISOString())).to.equal(true);
    });
  });
  describe('#dateGreaterThan()', () => {
    const now = new Date();
    const greater = new Date(now.getTime() + 1);
    const lower = new Date(now.getTime() - 1);

    it('should throw if env value is not a date', () => {
      expect(() => {
        handlersManager.dateGreaterThan(now.toISOString(), 'foo');
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should throw if condition value is not a date', () => {
      expect(() => {
        handlersManager.dateGreaterThan('foo', now.toISOString());
      }).to.throw(InvalidConditionValueError);
    });
    it('should return true if greater', () => {
      expect(handlersManager.dateGreaterThan(now.toISOString(), greater)).to.equal(true);
    });
    it('should return false if lower', () => {
      expect(handlersManager.dateGreaterThan(now.toISOString(), lower)).to.equal(false);
    });
    it('should return false if equal', () => {
      expect(handlersManager.dateGreaterThan(now.toISOString(), now)).to.equal(false);
    });
  });
  describe('#dateGreaterThanEquals()', () => {
    const now = new Date();
    const greater = new Date(now.getTime() + 1);
    const lower = new Date(now.getTime() - 1);

    it('should throw if env value is not a date', () => {
      expect(() => {
        handlersManager.dateGreaterThanEquals(now.toISOString(), 'foo');
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should throw if condition value is not a date', () => {
      expect(() => {
        handlersManager.dateGreaterThanEquals('foo', now.toISOString());
      }).to.throw(InvalidConditionValueError);
    });
    it('should return true if greater', () => {
      expect(handlersManager.dateGreaterThanEquals(now.toISOString(), greater)).to.equal(true);
    });
    it('should return false if lower', () => {
      expect(handlersManager.dateGreaterThanEquals(now.toISOString(), lower)).to.equal(false);
    });
    it('should return true if equal', () => {
      expect(handlersManager.dateGreaterThanEquals(now.toISOString(), now)).to.equal(true);
    });
  });
  describe('#dateLowerThan()', () => {
    const now = new Date();
    const greater = new Date(now.getTime() + 1);
    const lower = new Date(now.getTime() - 1);

    it('should throw if env value is not a date', () => {
      expect(() => {
        handlersManager.dateLowerThan(now.toISOString(), 'foo');
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should throw if condition value is not a date', () => {
      expect(() => {
        handlersManager.dateLowerThan('foo', now.toISOString());
      }).to.throw(InvalidConditionValueError);
    });
    it('should return false if greater', () => {
      expect(handlersManager.dateLowerThan(now.toISOString(), greater)).to.equal(false);
    });
    it('should return true if lower', () => {
      expect(handlersManager.dateLowerThan(now.toISOString(), lower)).to.equal(true);
    });
    it('should return false if equal', () => {
      expect(handlersManager.dateLowerThan(now.toISOString(), now)).to.equal(false);
    });
  });
  describe('#dateLowerThanEquals()', () => {
    const now = new Date();
    const greater = new Date(now.getTime() + 1);
    const lower = new Date(now.getTime() - 1);

    it('should throw if env value is not a date', () => {
      expect(() => {
        handlersManager.dateLowerThanEquals(now.toISOString(), 'foo');
      }).to.throw(InvalidEnvironmentValueError);
    });
    it('should throw if condition value is not a date', () => {
      expect(() => {
        handlersManager.dateLowerThanEquals('foo', now.toISOString());
      }).to.throw(InvalidConditionValueError);
    });
    it('should return false if greater', () => {
      expect(handlersManager.dateLowerThanEquals(now.toISOString(), greater)).to.equal(false);
    });
    it('should return true if lower', () => {
      expect(handlersManager.dateLowerThanEquals(now.toISOString(), lower)).to.equal(true);
    });
    it('should return true if equal', () => {
      expect(handlersManager.dateLowerThanEquals(now.toISOString(), now)).to.equal(true);
    });
  });
});
