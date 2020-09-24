import { TAction } from './action';
import { TEnvironment } from './environment';
import { TPermission } from './permission';
import { TResource } from './resource';

export type TAccessConstructorOptions = {
  consideredPermissions: TPermission[];
  environment: TEnvironment | null | undefined;
  resource: TResource;
  action: TAction;
};
