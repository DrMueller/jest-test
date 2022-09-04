export class ImportStatement {
  constructor(public readonly importedModule: string, public readonly importedObectNames: string[]) {}
}
