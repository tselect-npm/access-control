import { AccessAuthorizer, PermissionEffect, TPermission, TResource, TAction } from '../../';
import { DecisionCode } from '../../src/constants/decision-code';
import { IAttributeConditionEvaluation } from '../../src/interfaces/attribute-condition-evaluation';
import { IConditionEvaluation } from '../../src/interfaces/condition-evaluation';

class TestableAuthorizer extends AccessAuthorizer {
  public filterRelevantPermissions(resource: TResource, action: TAction, permissions: TPermission[]): TPermission[] {
    return super.filterRelevantPermissions(resource, action, permissions);
  }
}

describe('AccessAuthorizer', () => {
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
    const authorizer = new TestableAuthorizer();

    it('should explicitly deny', () => {
      const permissions: TPermission[] = [
        { id: '1', effect: PermissionEffect.DENY, resource: ['tables:post'], action: 'create' },
        { id: '2', effect: PermissionEffect.ALLOW, resource: 'tables:*', action: 'read' },
        { id: '3', effect: PermissionEffect.ALLOW, resource: '*', action: 'count' },
        { id: '4', effect: PermissionEffect.DENY, resource: ['tables:user'], action: ['count'] },
        { id: '5', effect: PermissionEffect.DENY, resource: 'tables:post:1', action: 'read' },
        { id: '6', effect: PermissionEffect.ALLOW, resource: 'tables:*', action: 'create' },
        { id: '7', effect: PermissionEffect.DENY, resource: 'tables:post:3', action: ['create'] }
      ];

      const access = authorizer.authorize('tables:post', 'create', permissions);
      expect(access.isAllowed()).to.equal(false);
      expect(access.getDecisionCode()).to.equal(DecisionCode.EXPLICIT_DENY);
      expect((<TPermission>access.getDecisivePermission()).id).to.equal('1');
      expect(access.getConsideredPermissions().map(perm => perm.id)).to.have.members(['1', '6']);
    });

    it('should explicitly allow', () => {
      const permissions: TPermission[] = [
        { id: '1', effect: PermissionEffect.DENY, resource: ['tables:post'], action: 'create' },
        { id: '2', effect: PermissionEffect.ALLOW, resource: 'tables:*', action: 'read' },
        { id: '3', effect: PermissionEffect.ALLOW, resource: '*', action: 'count' },
        { id: '4', effect: PermissionEffect.DENY, resource: ['tables:user'], action: ['count'] },
        { id: '5', effect: PermissionEffect.DENY, resource: 'tables:post:1', action: 'read' },
        { id: '6', effect: PermissionEffect.ALLOW, resource: 'tables:*', action: 'create' },
        { id: '7', effect: PermissionEffect.DENY, resource: 'tables:post:3', action: ['create'] }
      ];

      const access = authorizer.authorize('tables:foo', 'create', permissions);
      expect(access.isAllowed()).to.equal(true);
      expect(access.getDecisionCode()).to.equal(DecisionCode.EXPLICIT_ALLOW);
      expect((<TPermission>access.getDecisivePermission()).id).to.equal('6');
      expect(access.getConsideredPermissions().map(perm => perm.id)).to.have.members(['6']);
    });

    it('should explicitly allow', () => {
      const permissions: TPermission[] = [
        { id: '1', effect: PermissionEffect.DENY, resource: ['tables:post'], action: 'create' },
        { id: '2', effect: PermissionEffect.ALLOW, resource: 'tables:*', action: 'read' },
        { id: '3', effect: PermissionEffect.ALLOW, resource: '*', action: 'count' },
        { id: '4', effect: PermissionEffect.DENY, resource: ['tables:user'], action: ['count'] },
        { id: '5', effect: PermissionEffect.DENY, resource: 'tables:post:1', action: 'read' },
        { id: '6', effect: PermissionEffect.ALLOW, resource: 'tables:*', action: 'create' },
        { id: '7', effect: PermissionEffect.DENY, resource: 'tables:post:3', action: ['create'] }
      ];

      const access = authorizer.authorize('tables:foo', 'count', permissions);
      expect(access.isAllowed()).to.equal(true);
      expect(access.getDecisionCode()).to.equal(DecisionCode.EXPLICIT_ALLOW);
      expect((<TPermission>access.getDecisivePermission()).id).to.equal('3');
      expect(access.getConsideredPermissions().map(perm => perm.id)).to.have.members(['3']);
    });

    it('should explicitly deny', () => {
      const permissions: TPermission[] = [
        { id: '1', effect: PermissionEffect.DENY, resource: ['tables:post'], action: 'create' },
        { id: '2', effect: PermissionEffect.ALLOW, resource: 'tables:*', action: 'read' },
        { id: '3', effect: PermissionEffect.ALLOW, resource: '*', action: 'count' },
        { id: '4', effect: PermissionEffect.DENY, resource: ['tables:user'], action: ['count'] },
        { id: '5', effect: PermissionEffect.DENY, resource: 'tables:post:1', action: 'read' },
        { id: '6', effect: PermissionEffect.ALLOW, resource: 'tables:*', action: 'create' },
        { id: '7', effect: PermissionEffect.DENY, resource: 'tables:post:3', action: ['create'] }
      ];

      const access = authorizer.authorize('tables:user', 'count', permissions);
      expect(access.isAllowed()).to.equal(false);
      expect(access.getDecisionCode()).to.equal(DecisionCode.EXPLICIT_DENY);
      expect((<TPermission>access.getDecisivePermission()).id).to.equal('4');
      expect(access.getConsideredPermissions().map(perm => perm.id)).to.have.members(['3', '4']);
    });

    it('should deny because no relevant permissions', () => {
      const access = authorizer.authorize('tables:user', 'count', []);
      expect(access.isAllowed()).to.equal(false);
      expect(access.getDecisionCode()).to.equal(DecisionCode.NO_RELEVANT_PERMISSIONS);
      expect(access.getConsideredPermissions()).to.deep.equal([]);
    });

    it('should explicitly deny because no deny condition matched', () => {
      const permissions: TPermission[] = [{
        id: '1',
        effect: PermissionEffect.DENY,
        resource: 'tables:post',
        action: 'create',
        condition: {
          numberGreaterThan: {
            exactValue: {
              foo: '15'
            }
          }
        }
      }];

      const access = authorizer.authorize('tables:post', 'create', permissions, { foo: 17 });
      expect(access.isAllowed()).to.equal(false);
      expect(access.getDecisionCode()).to.equal(DecisionCode.EXPLICIT_DENY);
      expect((<TPermission>access.getDecisivePermission()).id).to.equal('1');
      expect(access.getConsideredPermissions().map(perm => perm.id)).to.deep.equal(['1']);
    });

    it('should deny because no allow permission', () => {
      const permissions: TPermission[] = [{
        id: '1',
        effect: PermissionEffect.DENY,
        resource: 'tables:post',
        action: 'create',
        condition: {
          numberGreaterThan: {
            exactValue: {
              foo: '15'
            }
          }
        }
      }];

      const access = authorizer.authorize('tables:post', 'create', permissions, { foo: 12 });
      expect(access.isAllowed()).to.equal(false);
      expect(access.getDecisionCode()).to.equal(DecisionCode.NO_ALLOW_PERMISSIONS);
      expect(access.getDecisivePermission()).to.equal(null);
      expect(access.getConsideredPermissions().map(perm => perm.id)).to.deep.equal(['1']);
    });

    it('should deny because allow condition failed', () => {
      const permissions: TPermission[] = [{
        id: '1',
        effect: PermissionEffect.ALLOW,
        resource: 'tables:post',
        action: 'create',
        condition: {
          numberGreaterThan: {
            exactValue: {
              foo: '15'
            }
          }
        }
      }];

      const access = authorizer.authorize('tables:post', 'create', permissions, { foo: 12 });
      expect(access.isAllowed()).to.equal(false);
      expect(access.getDecisionCode()).to.equal(DecisionCode.EXPLICIT_ALLOW_FAILED_CONDITION);
      expect((<TPermission>access.getDecisivePermission()).id).to.equal('1');
      // expect((<IAttributeConditionEvaluation>(<IConditionEvaluation>access.getDecisiveConditionEvaluation()).getFailedAttributeConditionEvaluation()).getAttributeName()).to.equal('foo');
      expect(access.getConsideredPermissions().map(perm => perm.id)).to.deep.equal(['1']);
    });
  });
});