import { expect } from 'chai';

import { Keys } from '../../src';

const makePayload = () => ({
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  password: 'p@ssw0rd',
  password_reset_required: false,
  preferences: {
    email: { news: true, newPost: false },
    sms: { newComment: true }
  },
  posts: [{
    id: 1,
    title: 'RBAC',
    content: 'Lorem ipsum',
    comments: [{
      user_id: 3,
      content: 'Super cool'
    }, {
      user_id: 18,
      content: 'Ugh?'
    }, {
      user_id: 13
    }],
    self_comment: 'Do not disclose',
    rating: '**'
  }, {
    id: 2,
    title: 'ABAC',
    content: 'Lorem ipsum',
    rating: '***',
    tags: ['acl', 'abac']
  }]
});

describe('AttributesUtil', () => {
  describe('#getValue()', () => {
    it('should retrieve first level value', () => {
      expect(Keys.getValues(makePayload(), 'last_name')).to.deep.equal(['Doe']);
    });
    it('should return nested value', () => {
      expect(Keys.getValues(makePayload(), 'preferences.email.news')).to.deep.equal([true]);
    });
    it('should return undefined for non existing deep value', () => {
      expect(Keys.getValues(makePayload(), 'preferences.foo.bar')).to.deep.equal([undefined]);
    });
    it('should return array values', () => {
      expect(Keys.getValues(makePayload(), 'posts.[].comments.[].content')).to.deep.equal(['Super cool', 'Ugh?', undefined, undefined]);
    });
    it('should return primitive array values', () => {
      expect(Keys.getValues(makePayload(), 'posts.[].tags.[]')).to.deep.equal([undefined, 'acl', 'abac']);
    });
    it('should retrieve values from an array', () => {
      const payload = makePayload();
      expect(Keys.getValues([payload.posts[0], makePayload().posts[1]], 'comments.[].content')).to.deep.equal(['Super cool', 'Ugh?', undefined, undefined]);
    });
  });
  describe('#filter()', () => {
    it('should keep first level property', () => {
      const filtered = Keys.filter(makePayload(), 'first_name');
      expect(filtered).to.deep.equal({ first_name: 'John' });
    });
    it('should keep multiple first level property', () => {
      const filtered = Keys.filter(makePayload(), ['last_name', 'first_name']);
      expect(filtered).to.deep.equal({ first_name: 'John', last_name: 'Doe' });
    });
    it('should keep nested property', () => {
      const filtered = Keys.filter(makePayload(), 'preferences.email.news');
      expect(filtered).to.deep.equal({ preferences: { email: { news: true } } });
    });
    it('should keep nested array property', () => {
      const filtered = Keys.filter(makePayload(), 'posts.[].title');
      expect(filtered).to.deep.equal({ posts: [{ title: 'RBAC' }, { title: 'ABAC' }] });
    });
    it('should keep full array', () => {
      const filtered = Keys.filter(makePayload(), 'posts');
      expect(filtered).to.deep.equal({
        posts: [{
          id: 1,
          title: 'RBAC',
          content: 'Lorem ipsum',
          comments: [{
            user_id: 3,
            content: 'Super cool'
          }, {
            user_id: 18,
            content: 'Ugh?'
          }, {
            user_id: 13
          }],
          self_comment: 'Do not disclose',
          rating: '**'
        }, {
          id: 2,
          title: 'ABAC',
          content: 'Lorem ipsum',
          rating: '***',
          tags: ['acl', 'abac']
        }]
      });
    });
    it('should keep all but negated', () => {
      const filtered = Keys.filter(makePayload(), ['!password', '!posts', '!preferences.email']);
      expect(filtered).to.deep.equal({
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        password_reset_required: false,
        preferences: {
          sms: { newComment: true }
        },
      });
    });
    it('should not mismatch similar properties', () => {
      expect(Keys.filter(makePayload(), ['password'])).to.deep.equal({ password: 'p@ssw0rd' });
    });
    it('should mismatch similar properties', () => {
      expect(Keys.filter(makePayload(), ['password*'])).to.deep.equal({ password: 'p@ssw0rd', password_reset_required: false });
    });
    it('should keep nothing', () => {
      const filtered = Keys.filter(makePayload(), []);
      expect(filtered).to.deep.equal({});
    });
    it('should keep everything', () => {
      const payload = makePayload();
      const filtered = Keys.filter(payload, '*');
      expect(filtered).to.deep.equal(payload);
    });
    it('should filter an array', () => {
      const data = [{ foo: 'foo', bar: 'bar' }, { foo: 'bar', bar: 'foo' }];
      expect(Keys.filter(data, 'foo')).to.deep.equal([{ foo: 'foo' }, { foo: 'bar' }]);
    });
    it('should return an array with empty objects', () => {
      const data = [{ foo: 'foo', bar: 'bar' }, { foo: 'bar', bar: 'foo' }];
      expect(Keys.filter(data, [])).to.deep.equal([{}, {}]);
    });
    it('should keep nested properties', () => {
      const filtered = Keys.filter(makePayload(), ['preferences.*']);
      expect(filtered).to.deep.equal({
        preferences: {
          email: { news: true, newPost: false },
          sms: { newComment: true }
        }
      });
    });
    it('should throw if pattern starts with a wild card', () => {
      expect(() => {
        Keys.filter({}, ['*.foo']);
      }).to.throw(/invalid/i);
    });
    it('should throw if pattern starts with unwind', () => {
      expect(() => {
        Keys.filter({}, ['[].foo']);
      }).to.throw(/invalid/i);
    });
    it('should throw if pattern starts with a dot', () => {
      expect(() => {
        Keys.filter({}, ['.foo']);
      }).to.throw(/invalid/i);
    });
    it('should return a new, deep copy of the original object', () => {
      const payload = makePayload();
      const filtered = Keys.filter(payload, '*', false);
      expect(filtered).to.not.equal(payload); // 'reference' (not deep) equality
    });
    it('should return the original object itself', () => {
      const payload = makePayload();
      const filtered = Keys.filter(payload, '*', true);
      expect(filtered).to.equal(payload); // 'reference' (not deep) equality
    });
  });
});
