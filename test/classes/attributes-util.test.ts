import { AttributesUtil } from '../../';

describe('AttributesUtil', () => {
  const util = new AttributesUtil();

  const payload = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    password: 'p@ssw0rd',
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
    },{
      id: 2,
      title: 'ABAC',
      content: 'Lorem ipsum',
      rating: '***',
      tags: ['acl', 'abac']
    }]
  };

  describe('.filter()', () => {
    it('should keep first level property', () => {
      const filtered = util.filter(payload, 'first_name');
      expect(filtered).to.deep.equal({ first_name: 'John' });
    });
    it('should keep multiple first level property', () => {
      const filtered = util.filter(payload, ['last_name', 'first_name']);
      expect(filtered).to.deep.equal({ first_name: 'John', last_name: 'Doe' });
    });
    it('should keep nested property', () => {
      const filtered = util.filter(payload, 'preferences.email.news');
      expect(filtered).to.deep.equal({ preferences: { email: { news: true } } });
    });
    it('should keep nested array property', () => {
      const filtered = util.filter(payload, 'posts.[].title');
      expect(filtered).to.deep.equal({ posts: [{ title: 'RBAC' }, { title: 'ABAC' }] });
    });
    it('should keep full array', () => {
      const filtered = util.filter(payload, 'posts');
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
        },{
          id: 2,
          title: 'ABAC',
          content: 'Lorem ipsum',
          rating: '***',
          tags: ['acl', 'abac']
        }]
      });
    });
    it('should keep all but negated', () => {
      const filtered = util.filter(payload, ['!password', '!posts', '!preferences.email']);
      expect(filtered).to.deep.equal({
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        preferences: {
          sms: { newComment: true }
        },
      });
    });
    it('should keep nothing', () => {
      const filtered = util.filter(payload, []);
      expect(filtered).to.deep.equal({});
    });
    it('should keep everything', () => {
      const filtered = util.filter(payload, '*');
      expect(filtered).to.deep.equal(payload);
    });
    it('should filter an array', () => {
      const data = [{ foo: 'foo', bar: 'bar' }, { foo: 'bar', bar: 'foo' }];
      expect(util.filter(data, 'foo')).to.deep.equal([{ foo: 'foo' }, { foo: 'bar' }]);
    });
  });
});