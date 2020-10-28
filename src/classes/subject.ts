import { ISubject } from '../interfaces/subject';
import { TSubjectPrincipal } from '../types/subject-principal';

export abstract class Subject<T extends object> implements ISubject<T> {
  private data: T;

  public constructor(data: T) {
    this.data = data;
  }

  public abstract getPrincipal(): TSubjectPrincipal;

  public get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }

  public set<K extends keyof T>(key: K, value: T[K]): this {
    this.data[key] = value;
    return this;
  }
}
