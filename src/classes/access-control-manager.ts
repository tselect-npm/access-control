import { TAccessControlManagerConstructorOptions } from '../types/access-control-manager-constructor-options';
import { AccessAuthorizer } from './access-authorizer';
import { IAccessControlManager } from '../interfaces/access-control-manager';
import { IAccess } from '../interfaces/access';
import { ISubject } from '../interfaces/subject';
import { TResource } from '../types/resource';
import { TAction } from '../types/action';
import { IAccessAuthorizer } from '../interfaces/access-authorizer';
import { TEnvironment } from '../types/environment';
import { IStore } from '../interfaces/store';
import { IAttributesUtil } from '../interfaces/attributes-util';
import { AttributesUtil } from './attributes-util';

export class AccessControlManager implements IAccessControlManager {
  private store: IStore;
  private authorizer: IAccessAuthorizer;
  private attributesUtil: IAttributesUtil;

  public constructor(options: TAccessControlManagerConstructorOptions) {
    this.store = options.store;
    this.authorizer = options.authorizer || new AccessAuthorizer(options.authorizerOptions);
    this.attributesUtil = options.attributesUtil || new AttributesUtil();
  }

  public async authorize(subject: ISubject<{}>, resource: TResource, action: TAction, environment?: TEnvironment): Promise<IAccess> {
    const permissions = await this.store.getPermissionsForSubject(subject);
    return await this.authorizer.authorize(resource, action, permissions, environment);
  }

  public async can(subject: ISubject<{}>, resource: TResource, action: TAction, environment?: TEnvironment): Promise<boolean> {
    const access = await this.authorize(subject, resource, action, environment);
    return access.isAllowed();
  }

  public filterAttributes<T extends ({} | {}[])>(payload: T, patterns: string | string[]): Partial<T> {
    return this.attributesUtil.filter(payload, patterns);
  }
}