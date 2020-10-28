import { expect } from 'chai';

import { Access } from '../../src';
import { TPermission } from '../../src/types/permission';
import { PermissionEffect } from '../../src/constants/permission-effect';
import { DecisionCode } from '../../src/constants/decision-code';
import { TAccessJournalEntry } from '../../src/types/access-journal';
import { ConditionEvaluationResultCode } from '../../src/constants/condition-evaluation-result-code';
import { TAccessJSON } from '../../src/types/access-json';

describe('Access', () => {
  describe('#getConsideredPermissions()', () => {
    it('should return considered permissions', () => {
      const permission: TPermission = { id: 'perm', effect: PermissionEffect.DENY, resource: '*', action: '*' };
      const access = new Access({ consideredPermissions: [permission], environment: {}, resource: 'foo', action: 'bar' });
      expect(access.getConsideredPermissions()).to.deep.equal([permission]);
    });
  });
  describe('#getEnvironment()', () => {
    it('should return the environment', () => {
      const access = new Access({ consideredPermissions: [], environment: {}, resource: 'foo', action: 'bar' });
      expect(access.getEnvironment()).to.deep.equal({});
    });
  });
  describe('#allow()', () => {
    it('should allow access', () => {
      const permission: TPermission = { id: 'perm', effect: PermissionEffect.ALLOW, resource: '*', action: '*' };
      const access = new Access({ consideredPermissions: [permission], environment: {}, resource: 'foo', action: 'bar' });
      access.allow(permission);
      expect(access.isAllowed()).to.equal(true);
      expect(access.isDenied()).to.equal(false);
      expect(access.isEvaluated()).to.equal(true);
      expect(access.getDecisionCode()).to.equal(DecisionCode.EXPLICITLY_ALLOWED);
      expect(access.getDecisivePermission()).to.equal(permission);
    });
  });
  describe('#deny()', () => {
    it('should deny access', () => {
      const permission: TPermission = { id: 'perm', effect: PermissionEffect.DENY, resource: '*', action: '*' };
      const access = new Access({ consideredPermissions: [permission], environment: {}, resource: 'foo', action: 'bar' });
      access.deny(DecisionCode.EXPLICITLY_DENIED, permission);
      expect(access.isAllowed()).to.equal(false);
      expect(access.isDenied()).to.equal(true);
      expect(access.isEvaluated()).to.equal(true);
      expect(access.getDecisionCode()).to.equal(DecisionCode.EXPLICITLY_DENIED);
      expect(access.getDecisivePermission()).to.equal(permission);
    });
    it('should reset decisive permission', () => {
      const permission: TPermission = { id: 'perm', effect: PermissionEffect.DENY, resource: '*', action: '*' };
      const access = new Access({ consideredPermissions: [permission], environment: {}, resource: 'foo', action: 'bar' });
      access.deny(DecisionCode.EXPLICITLY_DENIED, permission);
      access.deny(DecisionCode.NO_EXPLICIT_ALLOW_PERMISSION_FOUND);
      expect(access.getDecisivePermission()).to.equal(null);
    });
  });
  describe('#logJournalEntry()', () => {
    it('should add an entry to the journal', () => {
      const permission: TPermission = { id: 'perm', effect: PermissionEffect.DENY, resource: '*', action: '*' };
      const access = new Access({ consideredPermissions: [permission], environment: {}, resource: 'foo', action: 'bar' });
      const entry: TAccessJournalEntry = {
        permissionId: permission.id,
        conditionEvaluation: {
          succeeded: true,
          resultCode: ConditionEvaluationResultCode.SUCCESS,
          errorDetails: null,
          errorCode: null
        }
      };
      access.logJournalEntry(entry);
      expect(access.getJournal()).to.be.an('array').and.have.lengthOf(1);
      expect(access.getJournal()[0]).to.equal(entry);
    });
  });
  describe('#toJSON()', () => {
    it('should return a JSON representation', () => {
      const permission: TPermission = { id: 'perm', effect: PermissionEffect.DENY, resource: '*', action: '*' };
      const access = new Access({ consideredPermissions: [permission], environment: {}, resource: 'foo', action: 'bar' });
      const entry: TAccessJournalEntry = {
        permissionId: permission.id,
        conditionEvaluation: {
          succeeded: true,
          resultCode: ConditionEvaluationResultCode.SUCCESS,
          errorDetails: null,
          errorCode: null
        }
      };
      access.logJournalEntry(entry);
      const json = access.toJSON();
      expect(json).to.have.keys(['allowed', 'decisionCode', 'decisivePermission', 'environment', 'consideredPermissions', 'journal', 'resource', 'action']);
      expect(json.journal).to.be.an('array').and.have.lengthOf(1);
      expect(json.consideredPermissions).to.be.an('array').and.have.lengthOf(1);
    });
  });
  describe('.fromJSON()', () => {
    it('should construct from a JSON representation', () => {
      const permission: TPermission = { id: 'perm', effect: PermissionEffect.DENY, resource: '*', action: '*' };
      const json: TAccessJSON = {
        allowed: true,
        resource: 'foo',
        action: 'bar',
        decisionCode: DecisionCode.EXPLICITLY_ALLOWED,
        decisivePermission: permission,
        consideredPermissions: [permission],
        environment: {},
        journal: [{
          permissionId: permission.id,
          conditionEvaluation: {
            succeeded: true,
            resultCode: ConditionEvaluationResultCode.SUCCESS,
            errorDetails: null,
            errorCode: null
          }
        }]
      };
      const access = Access.fromJSON(json);
      expect(access.isAllowed()).to.equal(true);
      expect(access.getDecisivePermission()).to.be.an('object');
      expect(access.getDecisionCode()).to.eql(DecisionCode.EXPLICITLY_ALLOWED);
      expect(access.getConsideredPermissions()).to.be.an('array').and.have.lengthOf(1);
      expect(access.getJournal()).to.be.an('array').and.have.lengthOf(1);
      expect(access.getResource()).to.equal('foo');
      expect(access.getAction()).to.equal('bar');
    });
  });
});
