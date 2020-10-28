import { expect } from 'chai';

import { implies } from '../../src';

describe('implies()', () => {
  it('should return true for matching values', () => {
    expect(implies('foo', 'foo')).to.equal(true);
  });
  it('should return true for left wild card', () => {
    expect(implies('foo', 'foo')).to.equal(true);
  });
  it('should return false for non matching values', () => {
    expect(implies('foo', 'bar')).to.equal(false);
  });
  it('should return false for right wild card', () => {
    expect(implies('foo', '*')).to.equal(false);
  });
});
