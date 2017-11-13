import { IAccess } from '../interfaces/access';
import { TPermission } from '../types/permission';
import { TAccessConstructorOptions } from '../types/access-constructor-options';
import { DecisionCode } from '../constants/decision-code';
import { IConditionEvaluation } from '../interfaces/condition-evaluation';
import { TAccessJSON } from '../types/access-json';

export class Access implements IAccess {
  private allowed: boolean;
  private decisionCode: DecisionCode;
  private decisivePermission: TPermission | null;
  private consideredPermissions: TPermission[];
  private decisiveConditionEvaluation: IConditionEvaluation | null;

  public constructor(options: TAccessConstructorOptions = {}) {
    this.allowed = options.allowed || false;
    this.decisionCode = options.decisionCode || DecisionCode.NOT_EVALUATED;
    this.decisivePermission = options.decisivePermission || null;
    this.decisiveConditionEvaluation = options.decisiveConditionEvaluation || null;
    this.consideredPermissions = options.consideredPermissions || [];
  }

  public setDecisiveConditionEvaluation(conditionEvaluation: IConditionEvaluation): this {
    this.decisiveConditionEvaluation = conditionEvaluation;
    return this;
  }

  public getDecisiveConditionEvaluation(): IConditionEvaluation | null {
    return this.decisiveConditionEvaluation;
  }

  public setDecisivePermission(permission: TPermission): this {
    this.decisivePermission = permission;
    return this;
  }

  public getDecisivePermission(): TPermission | null {
    return this.decisivePermission;
  }

  public setDecisionCode(code: DecisionCode): this {
    this.decisionCode = code;
    return this;
  }

  public getDecisionCode(): DecisionCode {
    return this.decisionCode;
  }

  public setConsideredPermissions(permissions: TPermission[]): this {
    this.consideredPermissions = permissions;
    return this;
  }

  public getConsideredPermissions(): TPermission[] {
    return this.consideredPermissions;
  }

  public deny() {
    this.allowed = false;
    return this;
  }

  public allow() {
    this.allowed = true;
    return this;
  }

  public isDenied() {
    return !this.allowed;
  }

  public isAllowed() {
    return this.allowed;
  }

  public toJSON(): TAccessJSON {
    return <TAccessJSON>{
      allowed: this.allowed,
      decisionCode: this.decisionCode,
      decisivePermission: this.decisivePermission,
      decisiveConditionEvaluation: this.decisiveConditionEvaluation ? this.decisiveConditionEvaluation.toJSON() : null,
      consideredPermissions: this.consideredPermissions
    };
  }
}