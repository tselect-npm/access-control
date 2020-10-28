import { expect } from 'chai';

import { Subject, AccessControl, MemoryStore, Access } from '../../src';

describe('AccessControl', () => {
  class TestSubject extends Subject<{ id: number }> {
    getPrincipal() { return this.get('id'); }
  }

  const store = new MemoryStore();
  const accessControl = new AccessControl({ store });
  const subject = new TestSubject({ id: 1 });

  describe('#authorize()', () => {
    it('should return an access', async () => {
      const access = await accessControl.authorize(subject, 'foo', 'bar', {});
      expect(access).to.be.instanceOf(Access);
    });
  });
  describe('#can()', () => {
    it('should return the access result', async () => {
      const can = await accessControl.can(subject, 'foo', 'bar', {});
      expect(can).to.be.equal(false);
    });
  });
});
