import { TPermission } from './permission';
import { TEnvironment } from './environment';
import { TResource } from './resource';
import { TAction } from './action';

export type TAccessConstructorOptions = {
  consideredPermissions: TPermission[];
  environment: TEnvironment | null | undefined;
  resource: TResource;
  action: TAction;
};