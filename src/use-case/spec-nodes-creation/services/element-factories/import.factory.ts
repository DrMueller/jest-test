import { injectable } from 'inversify';
import { Node, factory } from 'typescript';
import { SutClass } from '../../../sut-analysis/models';
import { ImportStatement } from '../../../sut-analysis/models/import-statement';

@injectable()
export class ImportFactory {
  public createImportsForRequiredClasses(sutClass: SutClass): Node[] {
    const sutImport = new ImportStatement(`./${sutClass.fileName}`, [sutClass.typeName]);
    const importsToCreate = [sutImport, ...this.getMockImportStatements(sutClass)];

    return importsToCreate.map(imp => {
      const impSpecifiers = imp.importedObectNames.map(io => factory.createImportSpecifier(false, undefined, factory.createIdentifier(io)));

      return factory.createImportDeclaration(
        undefined,
        factory.createImportClause(false, undefined, factory.createNamedImports(impSpecifiers)),
        factory.createStringLiteral(imp.importedModule, false),
        undefined
      );
    });
  }

  private getMockImportStatements(sutClass: SutClass): ImportStatement[] {
    const mockNames = sutClass.constuctor?.parameters.map(f => f.typeName);

    const mockImports: ImportStatement[] = [];

    for (const mockName of mockNames ?? []) {
      sutClass.imports.forEach(impStatement => {
        if (impStatement.importedObectNames.includes(mockName)) {
          mockImports.push(impStatement);
        }
      });
    }

    return mockImports;
  }
}
