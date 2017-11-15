import { IAccess } from '../interfaces/access';
import { TPermission } from '../types/permission';
import { TAccessConstructorOptions } from '../types/access-constructor-options';
import { DecisionCode } from '../constants/decision-code';
import { TAccessJSON } from '../types/access-json';
import { TEnvironment } from '../types/environment';
import { TAccessJournal, TAccessJournalEntry } from '../types/access-journal';

export class Access implements IAccess {
  private journal: TAccessJournal;
  private decisionCode: DecisionCode;
  private decisivePermission: TPermission | null;
  private consideredPermissions: TPermission[];
  private environment: TEnvironment | null | undefined;

  public constructor(options: TAccessConstructorOptions) {
    this.environment = options.environment;
    this.consideredPermissions = options.consideredPermissions;
    this.journal = [];
    this.decisionCode = DecisionCode.NOT_EVALUATED;
    this.decisivePermission = null;
  }

  public getDecisionCode(): DecisionCode {
    return this.decisionCode;
  }

  public isEvaluated(): boolean {
    return this.decisionCode !== DecisionCode.NOT_EVALUATED;
  }

  public setDecisivePermission(permission: TPermission): this {
    this.decisivePermission = permission;
    return this;
  }

  public getDecisivePermission(): TPermission | null {
    return this.decisivePermission;
  }

  public getConsideredPermissions(): TPermission[] {
    return this.consideredPermissions;
  }

  public getJournal(): TAccessJournal {
    return this.journal;
  }

  public logJournalEntry(entry: TAccessJournalEntry): this {
    this.journal.push(entry);
    return this;
  }

  public getEnvironment(): TEnvironment | null | undefined {
    return this.environment;
  }

  public deny(code: DecisionCode, decisivePermission: TPermission | null = null): this {
    this.decisionCode = code;
    this.decisivePermission = decisivePermission;
    return this;
  }

  public allow(decisivePermission: TPermission) {
    this.decisionCode = DecisionCode.EXPLICITLY_ALLOWED;
    this.decisivePermission = decisivePermission;
    return this;
  }

  public isAllowed() {
    return this.decisionCode === DecisionCode.EXPLICITLY_ALLOWED;
  }

  public isDenied() {
    return !this.isAllowed();
  }

  public toJSON(): TAccessJSON {
    return <TAccessJSON>{
      allowed: this.isAllowed(),
      decisionCode: this.decisionCode,
      decisivePermission: this.decisivePermission,
      environment: this.environment,
      consideredPermissions: this.consideredPermissions,
      journal: this.journal
    };
  }
}