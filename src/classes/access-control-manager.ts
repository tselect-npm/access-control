import { IStore } from '../interfaces/store';
import { TAccessControlManagerConstructorOptions } from '../types/access-control-manager-constructor-options';
import { Authorizer } from './authorizer';
import { IAccessControlManager } from '../interfaces/access-control-manager';
import { IAccess } from '../interfaces/access';
import { ISubject } from '../interfaces/subject';
import { TResource } from '../types/resource';
import { TAction } from '../types/action';
import { IAuthorizer } from '../interfaces/authorizer';
import { MemoryStore } from './memory-store';
import { TEnvironment } from '../types/environment';

export class AccessControlManager implements IAccessControlManager {
  private store: IStore;
  private authorizer: IAuthorizer;

  public constructor(options: TAccessControlManagerConstructorOptions = {}) {
    this.store = options.store || new MemoryStore();
    this.authorizer = options.accessBuilder || new Authorizer(options.accessFactory);
  }

  public async authorize(subject: ISubject<{}>, resource: TResource, action: TAction, environment?: TEnvironment): Promise<IAccess> {
    const roles = await this.store.findRolesForSubject(subject);
    const permissions = await this.store.findPermissionsForRoles(roles);
    return await this.authorizer.authorize(resource, action, permissions, environment);
  }

  public async can(subject: ISubject<{}>, resource: TResource, action: TAction, environment?: TEnvironment): Promise<boolean> {
    const access = await this.authorize(subject, resource, action, environment);
    return access.isAllowed();
  }
}