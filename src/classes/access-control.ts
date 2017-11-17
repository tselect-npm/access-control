import { TAccessControlManagerConstructorOptions } from '../types/access-control-manager-constructor-options';
import { AccessAuthorizer } from './access-authorizer';
import { IAccessControl } from '../interfaces/access-control';
import { IAccess } from '../interfaces/access';
import { ISubject } from '../interfaces/subject';
import { TResource } from '../types/resource';
import { TAction } from '../types/action';
import { IAccessAuthorizer } from '../interfaces/access-authorizer';
import { TEnvironment } from '../types/environment';
import { IStore } from '../interfaces/store';
import { Keys } from '../utils/keys';

export class AccessControl implements IAccessControl {
  private store: IStore;
  private authorizer: IAccessAuthorizer;

  public constructor(options: TAccessControlManagerConstructorOptions) {
    this.store = options.store;
    this.authorizer = options.authorizer || new AccessAuthorizer(options.authorizerOptions);
  }

  public async authorize(subject: ISubject<{}>, resource: TResource, action: TAction, environment?: TEnvironment): Promise<IAccess> {
    const permissions = await this.store.getPermissionsForSubject(subject);
    return await this.authorizer.authorize(resource, action, permissions, environment);
  }

  public async can(subject: ISubject<{}>, resource: TResource, action: TAction, environment?: TEnvironment): Promise<boolean> {
    const access = await this.authorize(subject, resource, action, environment);
    return access.isAllowed();
  }
}