import { IStore } from '../interfaces/store';
import { TAccessControlManagerConstructorOptions } from '../types/access-control-manager-constructor-options';
import { AccessAuthorizer } from './access-authorizer';
import { IAccessControlManager } from '../interfaces/access-control-manager';
import { IAccess } from '../interfaces/access';
import { ISubject } from '../interfaces/subject';
import { TResource } from '../types/resource';
import { TAction } from '../types/action';
import { IAccessAuthorizer } from '../interfaces/access-authorizer';
import { MemoryStore } from './memory-store';
import { TEnvironment } from '../types/environment';
import { TAttributeName } from '../types/attribute-name';

export class AccessControlManager implements IAccessControlManager {
  private store: IStore;
  private authorizer: IAccessAuthorizer;

  public constructor(options: TAccessControlManagerConstructorOptions = {}) {
    this.store = options.store || new MemoryStore();
    this.authorizer = options.authorizer || new AccessAuthorizer(options.authorizerOptions);
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

  public filterAttributes<T extends {}>(payload: T, allowedAttributes: TAttributeName[]): Partial<T> {
    return {};
  }

  public filterListAttributes<T extends {}>(list: T[], allowAttributes: TAttributeName[]): (Partial<T>)[] {
    return list.map(object => this.filterAttributes(object, allowAttributes));
  }
}