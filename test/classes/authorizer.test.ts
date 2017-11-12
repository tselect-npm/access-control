import { Authorizer, PermissionEffect, TPermission, TResource, TAction } from '../../';

class TestableAuthorizer extends Authorizer {
  public filterRelevantPermissions(resource: TResource, action: TAction, permissions: TPermission[]): TPermission[] {
    return super.filterRelevantPermissions(resource, action, permissions);
  }
}

describe('Authorizer', () => {
  describe('#filterRelevantPermissions()', () => {
    const permissions: TPermission[] = [
      { id: '1', effect: PermissionEffect.DENY, resource: 'tables:post', action: 'create' },
      { id: '2', effect: PermissionEffect.ALLOW, resource: 'tables:*', action: 'read' },
      { id: '3', effect: PermissionEffect.ALLOW, resource: ['*'], action: 'count' },
      { id: '4', effect: PermissionEffect.DENY, resource: 'tables:user', action: ['count'] },
      { id: '5', effect: PermissionEffect.DENY, resource: ['tables:post:1'], action: ['read'] },
      { id: '6', effect: PermissionEffect.ALLOW, resource: 'tables:*', action: 'create' },
      { id: '7', effect: PermissionEffect.DENY, resource: 'tables:post:3', action: 'create' }
    ];

    const authorizer = new TestableAuthorizer();

    it('Use case #1', () => {
      const relevant = authorizer.filterRelevantPermissions('tables:post', 'create', permissions);
      const ids = relevant.map(perm => perm.id);
      expect(ids).to.have.members(['1', '6']);
    });

    it('Use case #2', () => {
      const relevant = authorizer.filterRelevantPermissions('tables', 'create', permissions);
      const ids = relevant.map(perm => perm.id);
      expect(ids).to.have.members(['6']);
    });

    it('Use case #3', () => {
      const relevant = authorizer.filterRelevantPermissions('tables:user', 'count', permissions);
      const ids = relevant.map(perm => perm.id);
      expect(ids).to.have.members(['3', '4']);
    });

    it('Use case #4', () => {
      const relevant = authorizer.filterRelevantPermissions('tables:post:1', 'read', permissions);
      const ids = relevant.map(perm => perm.id);
      expect(ids).to.have.members(['2', '5']);
    });

    it('Use case #5', () => {
      const relevant = authorizer.filterRelevantPermissions('tables:post:1', 'create', permissions);
      const ids = relevant.map(perm => perm.id);
      expect(ids).to.have.members(['1', '6']);
    });

    it('Use case #6', () => {
      const relevant = authorizer.filterRelevantPermissions('tables:foo', 'create', permissions);
      const ids = relevant.map(perm => perm.id);
      expect(ids).to.have.members(['6']);
    });

    it('Use case #7', () => {
      const relevant = authorizer.filterRelevantPermissions('tables:post:3', 'create', permissions);
      const ids = relevant.map(perm => perm.id);
      expect(ids).to.have.members(['1', '6', '7']);
    });
  });

  describe('#authorize()', () => {
    const permissions: TPermission[] = [
      { id: '1', effect: PermissionEffect.DENY, resource: ['tables:post'], action: 'create' },
      { id: '2', effect: PermissionEffect.ALLOW, resource: 'tables:*', action: 'read' },
      { id: '3', effect: PermissionEffect.ALLOW, resource: '*', action: 'count' },
      { id: '4', effect: PermissionEffect.DENY, resource: ['tables:user'], action: ['count'] },
      { id: '5', effect: PermissionEffect.DENY, resource: 'tables:post:1', action: 'read' },
      { id: '6', effect: PermissionEffect.ALLOW, resource: 'tables:*', action: 'create' },
      { id: '7', effect: PermissionEffect.DENY, resource: 'tables:post:3', action: ['create'] }
    ];

    const authorizer = new TestableAuthorizer();

    it('Use case #1', () => {
      const access = authorizer.authorize('tables:post', 'create', permissions);
      expect(access.isAllowed()).to.equal(false);
    });

    it('Use case #2', () => {
      const access = authorizer.authorize('tables:foo', 'create', permissions);
      expect(access.isAllowed()).to.equal(true);
    });

    it('Use case #3', () => {
      const access = authorizer.authorize('tables:foo', 'count', permissions);
      expect(access.isAllowed()).to.equal(true);
    });

    it('Use case #4', () => {
      const access = authorizer.authorize('tables:user', 'count', permissions);
      expect(access.isAllowed()).to.equal(false);
    });
  });
});