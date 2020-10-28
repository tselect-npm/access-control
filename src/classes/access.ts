import { DecisionCode } from '../constants/decision-code';
import { IAccess } from '../interfaces/access';
import { TAccessConstructorOptions } from '../types/access-constructor-options';
import { TAccessJournal, TAccessJournalEntry } from '../types/access-journal';
import { TAccessJSON } from '../types/access-json';
import { TAction } from '../types/action';
import { TAttributeName } from '../types/attribute-name';
import { TEnvironment } from '../types/environment';
import { TPermission } from '../types/permission';
import { TResource } from '../types/resource';
import { TWildCard } from '../types/wild-card';

export class Access implements IAccess {
  private journal: TAccessJournal;
  private decisionCode: DecisionCode;
  private decisivePermission: TPermission | null;
  private consideredPermissions: TPermission[];
  private environment: TEnvironment | null | undefined;
  private action: TAction;
  private resource: TResource;

  public constructor(options: TAccessConstructorOptions) {
    this.environment = options.environment;
    this.consideredPermissions = options.consideredPermissions;
    this.journal = [];
    this.decisionCode = DecisionCode.NOT_EVALUATED;
    this.decisivePermission = null;
    this.resource = options.resource;
    this.action = options.action;
  }

  public getDecisionCode(): DecisionCode {
    return this.decisionCode;
  }

  public isEvaluated(): boolean {
    return this.decisionCode !== DecisionCode.NOT_EVALUATED;
  }

  public getResource(): TResource {
    return this.resource;
  }

  public getAction(): TAction {
    return this.action;
  }

  public getDecisivePermission(): TPermission | null {
    return this.decisivePermission;
  }

  public getReturnedAttributes(): TAttributeName[] | TWildCard | undefined {
    return this.decisivePermission ? this.decisivePermission.returnedAttributes : undefined;
  }

  public getCustomData(): Object | undefined {
    return this.decisivePermission ? this.decisivePermission.customData : undefined;
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
      action: this.getAction(),
      resource: this.getResource(),
      decisionCode: this.getDecisionCode(),
      decisivePermission: this.getDecisivePermission(),
      environment: this.getEnvironment(),
      consideredPermissions: this.getConsideredPermissions(),
      journal: this.getJournal()
    };
  }

  public static fromJSON(accessJSON: TAccessJSON): Access {
    const access = new Access(accessJSON);

    access.journal = accessJSON.journal;
    access.decisionCode = accessJSON.decisionCode;
    access.decisivePermission = accessJSON.decisivePermission;
    access.consideredPermissions = accessJSON.consideredPermissions;
    access.environment = accessJSON.environment;
    access.resource = accessJSON.resource;
    access.action = accessJSON.action;

    return access;
  }
}
