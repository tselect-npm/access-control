import { ConditionOperator } from '../../constants/condition-operator';
import { ConditionModifier } from '../../constants/condition-modifier';
import { TPermissionId } from '../../types/permission-id';

export class InvalidEnvironmentValueError extends Error {
  private value: any;
  private operator: ConditionOperator | null;
  private modifier: ConditionModifier | null;
  private permissionId: TPermissionId | null;

  public constructor(value: any, modifier?: ConditionModifier, operator?: ConditionOperator, permissionId?: TPermissionId) {
    super();
    this.value = value;
    this.modifier = modifier || null;
    this.operator = operator || null;
    this.permissionId = permissionId || null;
    this.computeMessage();
  }

  public setOperator(operator: ConditionOperator): this {
    this.operator = operator;
    this.computeMessage();
    return this;
  }

  public setModifier(modifier: ConditionModifier): this {
    this.modifier = modifier;
    this.computeMessage();
    return this;
  }

  public setPermissionId(permissionId: TPermissionId): this {
    this.permissionId = permissionId;
    this.computeMessage();
    return this;
  }

  private computeMessage() {
    this.message = `Invalid environment value: "${this.value}" (modifier=${this.modifier}, operator=${this.operator}, permissionId=${this.permissionId}).`;
  }

  public static hasInstance(err: any): err is InvalidEnvironmentValueError {
    return err instanceof InvalidEnvironmentValueError;
  }
}