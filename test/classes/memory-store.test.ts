import { expect } from 'chai';

import { MemoryStore } from '../../src';
import { PermissionEffect } from '../../src/constants/permission-effect';
import { TPermission } from '../../src/types/permission';
import { Subject } from '../../src/classes/subject';

describe('MemoryStore', () => {
  class TestSubject extends Subject<{ id: number }> {
    getPrincipal() { return this.get('id') };
  }

  describe('#createPermission()', () => {
    it('should assign an id', () => {
      const store = new MemoryStore();
      const permission = store.createPermission({ effect: PermissionEffect.ALLOW, resource: '*', action: '*' });
      expect(permission.id).to.be.a('string');
    });
    it('should preserve the existing id', () => {
      const store = new MemoryStore();
      const permission = store.createPermission({ id: '1', effect: PermissionEffect.ALLOW, resource: '*', action: '*' });
      expect(permission.id).to.be.equal('1');
    });
  });
  describe('#deletePermission()', () => {
    it('should delete permission', () => {
      const store = new MemoryStore();
      const permission = store.createPermission({ effect: PermissionEffect.ALLOW, resource: '*', action: '*' });
      expect(store.getPermissionById(permission.id)).to.exist;
      store.deletePermission(permission.id);
      expect(store.getPermissionById(permission.id)).to.not.exist;
    });
    it('should delete permission from role permissions', () => {
      const store = new MemoryStore();
      const permission: TPermission = { id: '1', effect: PermissionEffect.ALLOW, resource: '*', action: '*' };
      store.addPermissionToRole('admin', permission);
      let rolePermissions = store.getPermissionsForRole('admin');
      expect(rolePermissions).to.have.lengthOf(1);
      store.deletePermission('1');
      rolePermissions = store.getPermissionsForRole('admin');
      expect(rolePermissions).to.have.lengthOf(0);
    });
  });
  describe('#replacePermission()', () => {
    it('should replace permission', () => {
      const store = new MemoryStore();
      const permission = store.createPermission({ id: '1', effect: PermissionEffect.ALLOW, resource: '*', action: '*' });
      expect(store.getPermissionById(permission.id)).to.equal(permission);
      const newPermission = { id: '1', effect: PermissionEffect.DENY, resource: '*', action: '*' };
      store.replacePermission(newPermission);
      expect(store.getPermissionById(permission.id)).to.equal(newPermission);
    });
  });
  describe('#addPermissionToRole()', () => {
    it('should add an existing permission to role', () => {
      const store = new MemoryStore();
      const permission = store.createPermission({ id: '1', effect: PermissionEffect.ALLOW, resource: '*', action: '*' });
      store.addPermissionToRole('admin', permission.id);
      const rolePermissions = store.getPermissionsForRole('admin');
      expect(rolePermissions).to.have.lengthOf(1);
      expect(rolePermissions[0].id).to.equal('1');
    });
    it('should add a non existing permission to role', () => {
      const store = new MemoryStore();
      const permission = { id: '1', effect: PermissionEffect.ALLOW, resource: '*', action: '*' };
      store.addPermissionToRole('admin', permission);
      const rolePermissions = store.getPermissionsForRole('admin');
      expect(rolePermissions).to.have.lengthOf(1);
      expect(rolePermissions[0].id).to.equal('1');
    });
    it('should throw if permission does not exist', () => {
      const store = new MemoryStore();
      expect(() => {
        store.addPermissionToRole('admin', '1');
      }).to.throw(/permission/);
    });
    it('should add a second permission', () => {
      const store = new MemoryStore();
      const permission1 = { id: '1', effect: PermissionEffect.ALLOW, resource: '*', action: '*' };
      const permission2 = { id: '2', effect: PermissionEffect.ALLOW, resource: '*', action: '*' };
      store.addPermissionToRole('admin', permission1);
      let rolePermissions = store.getPermissionsForRole('admin');
      expect(rolePermissions).to.have.lengthOf(1);
      store.addPermissionToRole('admin', permission2);
      rolePermissions = store.getPermissionsForRole('admin');
      expect(rolePermissions).to.have.lengthOf(2);
    });
  });
  describe('#removePermissionFromRole()', () => {
    it('should remove permission from role', () => {
      const store = new MemoryStore();
      const permission = store.createPermission({ id: '1', effect: PermissionEffect.ALLOW, resource: '*', action: '*' });
      store.addPermissionToRole('admin', permission.id);
      store.removePermissionFromRole('admin', permission.id);
      const rolePermissions = store.getPermissionsForRole('admin');
      expect(rolePermissions).to.have.lengthOf(0);
    });
    it('should not throw if permission does not belong to role', () => {
      const store = new MemoryStore();
      const permission = store.createPermission({ id: '1', effect: PermissionEffect.ALLOW, resource: '*', action: '*' });
      expect(() => {
        store.removePermissionFromRole('admin', permission);
      }).to.not.throw();
    });
  });
  describe('#addRoleToSubject()', () => {
    it('should add role to subject', () => {
      const subject = new TestSubject({ id: 1 });
      const store = new MemoryStore();
      store.addRoleToSubject(subject, 'admin');
      expect(store.getRolesForSubject(subject.getPrincipal())).to.have.lengthOf(1);
    });
    it('should throw if subject does not exist', () => {
      const store = new MemoryStore();
      expect(() => {
        store.addRoleToSubject(1, 'admin');
      }).to.throw(/existing/);
    });
    it('should add a second role to subject', () => {
      const subject = new TestSubject({ id: 1 });
      const store = new MemoryStore();
      store.addRoleToSubject(subject, 'admin').addRoleToSubject(subject, 'employee');
      expect(store.getRolesForSubject(subject.getPrincipal())).to.have.lengthOf(2);
    });
  });
  describe('#removeRoleFromSubject()', () => {
    it('should remove role from subject', () => {
      const subject = new TestSubject({ id: 1 });
      const store = new MemoryStore();
      store.addRoleToSubject(subject, 'admin').addRoleToSubject(subject, 'employee');
      store.removeRoleFromSubject(subject, 'admin');
      expect(store.getRolesForSubject(subject.getPrincipal())).to.have.lengthOf(1);
    });
    it('should remove not throw if subject does not exists', () => {
      const store = new MemoryStore();
      const subject = new TestSubject({ id: 1 });
      expect(() => {
        store.removeRoleFromSubject(subject, 'admin');
      }).to.not.throw();
    });
  });
  describe('#getPermissionsForRole()', () => {
    it('should return the role permissions', () => {
      const store = new MemoryStore();
      const permission1 = { id: '1', effect: PermissionEffect.ALLOW, resource: '*', action: '*' };
      const permission2 = { id: '2', effect: PermissionEffect.ALLOW, resource: '*', action: '*' };
      store.addPermissionsToRole('admin', [permission1, permission2]);
      expect(store.getPermissionsForRole('admin')).to.have.lengthOf(2);
    });
    it('should default to an empty list', () => {
      const store = new MemoryStore();
      expect(store.getPermissionsForRole('admin')).to.have.lengthOf(0);
    });
  });
  describe('#getPermissionsForSubject()', () => {
    it('should find permissions for subject', () => {
      const subject = new TestSubject({ id: 1 });
      const store = new MemoryStore();
      const permission1 = { id: '1', effect: PermissionEffect.ALLOW, resource: '*', action: '*' };
      const permission2 = { id: '2', effect: PermissionEffect.ALLOW, resource: '*', action: '*' };
      store.addPermissionToRole('admin', permission1);
      store.addPermissionToRole('employee', permission2);
      store.addRoleToSubject(subject, 'admin');
      store.addRoleToSubject(subject, 'employee');
      const subjectPermissions = store.getPermissionsForSubject(subject);
      expect(subjectPermissions).to.have.lengthOf(2);
      expect(subjectPermissions[0].id).to.equal('1');
      expect(subjectPermissions[1].id).to.equal('2');
    });
  });
  describe('#getRolesForSubject()', () => {
    it('should return the subject roles', () => {
      const subject = new TestSubject({ id: 1 });
      const store = new MemoryStore();
      store.createSubject(subject);
      store.addRoleToSubject(1, 'admin');
      expect(store.getRolesForSubject(subject)).to.deep.equal(['admin']);
    });
    it('should return an empty list', () => {
      const subject = new TestSubject({ id: 1 });
      const store = new MemoryStore();
      store.createSubject(subject);
      expect(store.getRolesForSubject(subject)).to.deep.equal([]);
    });
  });
  describe('#deleteSubject()', () => {
    it('should delete subject', () => {
      const store = new MemoryStore();
      const subject = new TestSubject({ id: 1 });
      store.createSubject(subject);
      expect(store.getSubjects()).to.have.lengthOf(1);
      store.deleteSubject(subject);
      expect(store.getSubjects()).to.have.lengthOf(0);
    });
  });
  describe('#getPermissions()', () => {
    it('should list all permissions', () => {
      const store = new MemoryStore();
      const permission1 = { id: '1', effect: PermissionEffect.ALLOW, resource: '*', action: '*' };
      const permission2 = { id: '2', effect: PermissionEffect.ALLOW, resource: '*', action: '*' };
      store.createPermission(permission1);
      store.createPermission(permission2);
      expect(store.getPermissions()).to.have.lengthOf(2);
    });
  });
  describe('#getSubjectByPrincipal()', () => {
    it('should retrieve subject by principal', () => {
      const store = new MemoryStore();
      const subject = new TestSubject({ id: 1 });
      store.createSubject(subject);
      expect(store.getSubjectByPrincipal(1)).to.equal(subject);
    });
  });
});
