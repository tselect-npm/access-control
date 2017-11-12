import { IStore } from '../interfaces/store';
import { ISubject } from '../interfaces/subject';
import { TRole } from '../types/role';
import { TPermission } from '../types/permission';

export abstract class Store implements IStore {
  public async abstract createPermission(permission: TPermission): Promise<TPermission>;
  public async abstract deletePermission(permission: TPermission): Promise<void>;
  public async abstract upsertPermission(permission: TPermission): Promise<void>;
  public async abstract addPermissionToRole(role: string, permission: TPermission): Promise<void>;
  public async abstract removePermissionFromRole(role: string, permission: TPermission): Promise<void>;
  public async abstract registerSubject(subject: ISubject<any>): Promise<void>;
  public async abstract deleteSubject(subjectOrPrincipal: string | number | ISubject<any>): Promise<void>;
  public async abstract addRoleToSubject(subjectOrPrincipal: string | number | ISubject<any>, role: string): Promise<void>;
  public async abstract removeRoleFromSubject(subjectOrPrincipal: string | number | ISubject<any>, role: string): Promise<void>;
  public async abstract isRegisteredSubject(subjectOrPrincipal: string | number | ISubject<any>): Promise<boolean>;
  public async abstract assertIsRegisteredSubject(subjectOrPrincipal: string | number | ISubject<any>): Promise<void>;
  public async abstract isRegisteredPermission(permissionOrId: string | number | TPermission): Promise<boolean>;
  public async abstract assertIsRegisteredPermission(permissionOrId: string | number | TPermission): Promise<void>;
  public async abstract findRolesForSubject(subject: ISubject<{}>): Promise<TRole[]>;
  public async abstract findPermissionsForRole(role: TRole): Promise<TPermission[]>;

  public async findPermissionsForRoles(roles: TRole[]): Promise<TPermission[]> {
    const permissions: TPermission[] = [];

    await Promise.all(roles.map(async role => {
      const rolePermissions = await this.findPermissionsForRole(role);
      permissions.push(...rolePermissions);
    }));

    return permissions;
  }
}