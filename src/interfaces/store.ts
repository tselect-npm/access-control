import { ISubject } from './subject';
import { TRole } from '../types/role';
import { TSubjectOrPrincipal } from '../types/subject-or-principal';
import { TPermissionOrId } from '../types/permission-or-id';
import { TPermission } from '../types/permission';

export interface IStore {
  findRolesForSubject(subject: ISubject<any>): Promise<TRole[]>;
  findPermissionsForRole(role: TRole): Promise<TPermission[]>;
  findPermissionsForRoles(roles: TRole[]): Promise<TPermission[]>;

  createPermission(permission: TPermission): Promise<TPermission>;
  deletePermission(permission: TPermission): Promise<void>;
  upsertPermission(permission: TPermission): Promise<void>;

  addPermissionToRole(role: TRole, permission: TPermission): Promise<void>;
  removePermissionFromRole(role: TRole, permission: TPermission): Promise<void>;

  registerSubject(subject: ISubject<any>): Promise<void>;
  deleteSubject(subjectOrPrincipal: TSubjectOrPrincipal): Promise<void>;

  addRoleToSubject(subjectOrPrincipal: TSubjectOrPrincipal, role: TRole): Promise<void>;
  removeRoleFromSubject(subjectOrPrincipal: TSubjectOrPrincipal, role: TRole): Promise<void>;

  isRegisteredSubject(subjectOrPrincipal: TSubjectOrPrincipal): Promise<boolean>;
  assertIsRegisteredSubject(subjectOrPrincipal: TSubjectOrPrincipal): Promise<void>;

  isRegisteredPermission(permissionOrId: TPermissionOrId): Promise<boolean>;
  assertIsRegisteredPermission(permissionOrId: TPermissionOrId): Promise<void>;
}