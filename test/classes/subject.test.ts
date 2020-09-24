import { expect } from 'chai';

import { Subject } from '../../src'

class TestSubject extends Subject<{ id: number, name: string }> {
  getPrincipal() { return this.get('id'); }
}

describe('Subject', () => {
  describe('#get()', () => {
    it('should retrieve value', () => {
      const subject = new TestSubject({ id: 1, name: 'John' });
      expect(subject.get('name')).to.equal('John');
    });
  });
  describe('#set()', () => {
    it('should set value', () => {
      const subject = new TestSubject({ id: 1, name: 'John' });
      subject.set('name', 'Jane');
      expect(subject.get('name')).to.equal('Jane');
    });
  });
  describe('#getPrincipal()', () => {
    it('should return subject principal', () => {
      const subject = new TestSubject({ id: 1, name: 'John' });
      expect(subject.getPrincipal()).to.equal(1);
    });
  });
});
