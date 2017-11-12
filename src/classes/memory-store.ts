import { Store } from './store';
import { ISubject } from '../interfaces/subject';
import { TSubjectPrincipal } from '../types/subject-principal';
import { TPermissionId } from '../types/permission-id';
import { TSubjectOrPrincipal } from '../types/subject-or-principal';
import { toSubjectPrincipal } from '../utils/to-subject-principal';
import { TRole } from '../types/role';
import { TPermissionOrId } from '../types/permission-or-id';
import { toPermissionId } from '../types/to-permission-id';
import { IStore } from '../interfaces/store';
import { TPermission } from '../types/permission';


export class MemoryStore extends Store implements IStore {
  private permissions: Map<TPermissionId, TPermission>;
  private subjects: Map<TSubjectPrincipal, ISubject<any>>;
  private subjectRoles: Map<TSubjectPrincipal, Set<TRole>>;
  private rolePermissions: Map<TRole, Set<TPermissionId>>;

  public constructor() {
    super();
    this.subjects = new Map();
    this.permissions = new Map();
  }

  public async findRolesForSubject(subjectOrPrincipal: TSubjectOrPrincipal): Promise<TRole[]> {
    const principal = toSubjectPrincipal(subjectOrPrincipal);
    await this.assertIsRegisteredSubject(principal);
    return Array.from(this.subjectRoles.get(principal) || []);
  }

  public async findPermissionsForRole(role: TRole): Promise<TPermission[]> {
    return Array.from(this.rolePermissions.get(role) || []).map(id => {
      return this.permissions.get(id) as TPermission;
    });
  }

  public async createPermission(permission: TPermission): Promise<TPermission> {
    this.permissions.set(permission.id, permission);
    return permission;
  }

  public async upsertPermission(permission: TPermission): Promise<void> {
    this.permissions.set(permission.id, permission);
  }

  public async deletePermission(permissionOrId: TPermissionOrId): Promise<void> {
    const id = toPermissionId(permissionOrId);
    this.permissions.delete(id);
    for (const set of this.rolePermissions.values()) {
      set.delete(id);
    }
  }

  public async addPermissionToRole(role: string, permissionOrId: TPermissionOrId): Promise<void> {
    const id = toPermissionId(permissionOrId);
    await this.assertIsRegisteredPermission(id);
    if (this.rolePermissions.has(role)) {
      (<Set<TPermissionId>>this.rolePermissions.get(role)).add(id);
    } else {
      this.rolePermissions.set(role, new Set([id]));
    }
  }

  public async removePermissionFromRole(role: TRole, permissionOrId: TPermissionOrId): Promise<void> {
    const id = toPermissionId(permissionOrId);
    await this.assertIsRegisteredPermission(id);
    if (this.rolePermissions.has(role)) {
      (<Set<TPermissionId>>this.rolePermissions.get(role)).delete(id);
    }
  }

  public async registerSubject(subject: ISubject<any>): Promise<void> {
    this.subjects.set(subject.getPrincipal(), subject);
  }

  public async deleteSubject(subjectOrPrincipal: TSubjectOrPrincipal): Promise<void> {
    const principal = toSubjectPrincipal(subjectOrPrincipal);
    this.subjects.delete(principal);
    this.subjectRoles.delete(principal);
  }

  public async addRoleToSubject(subjectOrPrincipal: TSubjectOrPrincipal, role: TRole): Promise<void> {
    const principal = toSubjectPrincipal(subjectOrPrincipal);
    await this.assertIsRegisteredSubject(principal);
    if (this.subjectRoles.has(principal)) {
      (<Set<TRole>>this.subjectRoles.get(principal)).add(role);
    } else {
      this.subjectRoles.set(principal, new Set([role]));
    }
  }

  public async removeRoleFromSubject(subjectOrPrincipal: TSubjectOrPrincipal, role: TRole): Promise<void> {
    const principal = toSubjectPrincipal(subjectOrPrincipal);
    await this.assertIsRegisteredSubject(principal);
    if (this.subjectRoles.has(principal)) {
      (<Set<TRole>>this.subjectRoles.get(principal)).delete(role);
    }
  }

  public async isRegisteredSubject(subjectOrPrincipal: TSubjectOrPrincipal): Promise<boolean> {
    const principal = toSubjectPrincipal(subjectOrPrincipal);
    return this.subjects.has(principal);
  }

  public async assertIsRegisteredSubject(subjectOrPrincipal: TSubjectOrPrincipal): Promise<void> {
    const principal = toSubjectPrincipal(subjectOrPrincipal);
    const isRegistered = await this.isRegisteredSubject(principal);
    if (!isRegistered) {
      throw new Error(`Not a registered subject: ${principal}`);
    }
  }

  public async isRegisteredPermission(permissionOrId: TPermissionOrId): Promise<boolean> {
    const id = toPermissionId(permissionOrId);
    return this.permissions.has(id);
  }

  public async assertIsRegisteredPermission(permissionOrId: TPermissionOrId): Promise<void> {
    const id = toPermissionId(permissionOrId);
    const isRegistered = await this.isRegisteredPermission(id);
    if (!isRegistered) {
      throw new Error(`Not a registered permission: ${id}`);
    }
  }
}