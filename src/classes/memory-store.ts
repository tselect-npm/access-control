import { ISubject } from '../interfaces/subject';
import { TSubjectPrincipal } from '../types/subject-principal';
import { TPermissionId } from '../types/permission-id';
import { TRole } from '../types/role';
import { TPermission } from '../types/permission';
import { TCreatePermission } from '../types/create-permission';
import * as UUID from 'uuid';
import { toSubjectPrincipal } from '../utils/to-subject-principal';
import { Subject } from './subject';
import { TSubjectOrPrincipal } from '../types/subject-or-principal';
import { TPermissionOrId } from '../types/permission-or-id';
import { toPermissionId } from '../utils/to-permission-id';
import * as Lodash from 'lodash';
import { IStore } from '../interfaces/store';

export class MemoryStore implements IStore {
  private permissions: Map<TPermissionId, TPermission>;
  private subjects: Map<TSubjectPrincipal, ISubject<any>>;
  private subjectRoles: Map<TSubjectPrincipal, Set<TRole>>;
  private rolePermissions: Map<TRole, Set<TPermissionId>>;

  public constructor() {
    this.subjects = new Map();
    this.permissions = new Map();
    this.subjectRoles = new Map();
    this.rolePermissions = new Map();
  }

  public createPermission(permission: TCreatePermission): TPermission {
    if (!permission.id) {
      permission.id = UUID.v4();
    }
    this.permissions.set(permission.id, permission as TPermission);
    return permission as TPermission;
  }

  public deletePermission(permissionOrId: TPermissionOrId): this {
    const id = toPermissionId(permissionOrId);
    this.permissions.delete(id);
    for (const set of this.rolePermissions.values()) {
      set.delete(id);
    }
    return this;
  }

  public replacePermission(permission: TPermission): this {
    this.permissions.set(permission.id, permission);
    return this;
  }

  public addPermissionToRole(role: TRole, permissionOrId: TPermissionOrId): this {
    const id = toPermissionId(permissionOrId);
    if (!this.permissions.has(id)) {
      if (Lodash.isPlainObject(permissionOrId)) {
        this.createPermission(permissionOrId as TPermission);
      } else {
        throw new Error(`Not an existing permission: ${id}.`);
      }
    }
    if (this.rolePermissions.get(role)) {
      (<Set<TPermissionId>>this.rolePermissions.get(role)).add(id);
    } else {
      this.rolePermissions.set(role, new Set([id]));
    }
    return this;
  }

  public addPermissionsToRole(role: TRole, permissions: TPermissionOrId[]): this {
    permissions.forEach(permission => this.addPermissionToRole(role, permission));
    return this;
  }

  public removePermissionFromRole(role: string, permissionOrId: TPermissionOrId): this {
    const id = toPermissionId(permissionOrId);
    if (this.rolePermissions.has(role)) {
      (<Set<TPermissionId>>this.rolePermissions.get(role)).delete(id);
    }
    return this;
  }

  public addRoleToSubject(subjectOrPrincipal: TSubjectOrPrincipal, role: string): this {
    const principal = toSubjectPrincipal(subjectOrPrincipal);
    if (!this.subjects.has(principal)) {
      if (subjectOrPrincipal instanceof Subject) {
        this.createSubject(subjectOrPrincipal);
      } else {
        throw new Error(`Not an existing subject: ${principal}`);
      }
    }
    if (this.subjectRoles.has(principal)) {
      (<Set<TRole>>this.subjectRoles.get(principal)).add(role);
    } else {
      this.subjectRoles.set(principal, new Set([role]));
    }
    return this;
  }

  public removeRoleFromSubject(subjectOrPrincipal: TSubjectOrPrincipal, role: string): this {
    const principal = toSubjectPrincipal(subjectOrPrincipal);
    if (this.subjectRoles.has(principal)) {
      (<Set<TRole>>this.subjectRoles.get(principal)).delete(role);
    }
    return this;
  }

  public getRolesForSubject(subjectOrPrincipal: TSubjectOrPrincipal): string[] {
    return Array.from(this.subjectRoles.get(toSubjectPrincipal(subjectOrPrincipal)) || []);
  }

  public getPermissionsForRole(role: string): TPermission[] {
    return (Array.from(this.rolePermissions.get(role) || [])).map(id => {
      return this.permissions.get(id) as TPermission;
    });
  }

  public getPermissionsForSubject(subject: ISubject<{}>): TPermission[] {
    const roles = this.getRolesForSubject(subject);
    return this.getPermissionsForRoles(roles);
  }

  public createSubject(subject: ISubject<{}>): this {
    this.subjects.set(subject.getPrincipal(), subject);
    return this;
  }

  public deleteSubject(subjectOrPrincipal: TSubjectOrPrincipal): this {
    const principal = toSubjectPrincipal(subjectOrPrincipal);
    this.subjects.delete(principal);
    return this;
  }

  public getPermissionsForRoles(roles: string[]): TPermission[] {
    return roles.reduce((acc, role) => {
      return acc.concat(this.getPermissionsForRole(role));
    }, [] as TPermission[]);
  }

  public getPermissions(): TPermission[] {
    return Array.from(this.permissions.values());
  }

  public getPermissionById(id: TPermissionId): TPermission | undefined {
    return this.permissions.get(id);
  }

  public getSubjects(): ISubject<{}>[] {
    return Array.from(this.subjects.values());
  }

  public getSubjectByPrincipal(subjectPrincipal: TSubjectPrincipal): ISubject<{}> | undefined {
    return this.subjects.get(subjectPrincipal);
  }
}
