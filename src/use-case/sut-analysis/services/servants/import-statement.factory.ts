import * as ts from 'typescript';
import { injectable } from 'inversify';
import { SourceFile, SyntaxKind } from 'typescript';
import { ImportStatement } from '../../models/import-statement';

@injectable()
export class ImportStatementFactory {
  public create(sourceFile: SourceFile): ImportStatement[] {
    const imports: ts.ImportDeclaration[] = [];

    sourceFile.forEachChild(f => {
      if (f.kind === SyntaxKind.ImportDeclaration) {
        imports.push(f as ts.ImportDeclaration);
      }
    });

    const importStatements: ImportStatement[] = [];
    imports.forEach(i => {
      const importedTypeNames: string[] = [];

      i.importClause?.forEachChild(c => {
        c.forEachChild(cc => {
          if (cc.kind === SyntaxKind.ImportSpecifier) {
            const specifier = cc as ts.ImportSpecifier;
            importedTypeNames.push(specifier.name.text);
          }
        });
      });

      const importedModule = i.moduleSpecifier.getText().split("'").join('').split('"').join('');

      importStatements.push(new ImportStatement(importedModule, importedTypeNames));
    });

    return importStatements;
  }
}
