import { TPermission } from './permission';
import { TEnvironment } from './environment';

export type TAccessConstructorOptions = {
  consideredPermissions: TPermission[];
  environment: TEnvironment | null | undefined;
};