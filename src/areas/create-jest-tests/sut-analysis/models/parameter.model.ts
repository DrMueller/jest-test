export class Parameter {
  constructor(
    public readonly name: string,
    public readonly typeName: string) {}

  public get mockVariableName(): string {
    return `${this.name}Mock`;
  }
}