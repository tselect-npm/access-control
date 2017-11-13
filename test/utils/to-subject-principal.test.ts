import { toSubjectPrincipal } from '../../';
import { ISubject } from '../../src/interfaces/subject';

describe('toSubjectPrincipal()', () => {
  it('should return the parameter value', () => {
    expect(toSubjectPrincipal('1')).to.equal('1');
  });
  it('should return the subject principal', () => {
    expect(toSubjectPrincipal(<ISubject<any>>{ getPrincipal: () => '1' })).to.equal('1');
  });
});