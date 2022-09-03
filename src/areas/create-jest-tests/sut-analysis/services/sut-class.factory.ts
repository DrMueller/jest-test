import { Declaration, getCombinedModifierFlags, ModifierFlags, Node, SourceFile, SyntaxKind, getModifiers, HasModifiers } from "typescript";
import { Constructor, ElementVisibility, ElementVisibilityType, Method, Parameter, SutClass } from "../models";
import * as vscode from 'vscode';
import * as ts from 'typescript';
import { injectable } from "inversify";
import { ImportStatement } from "../models/import-statement";
import path = require("path");

@injectable()
export class SutClassFactory {
  public async create(sutFilePath: string): Promise<SutClass> {
    const sutDoc = await vscode.workspace.openTextDocument(sutFilePath);
    const sutSourceFile = ts.createSourceFile(sutDoc.fileName, sutDoc.getText(), ts.ScriptTarget.Latest, true);

    const imports: ts.ImportDeclaration[] = [];
    sutSourceFile.forEachChild(f => {
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

      const importedModule = i.moduleSpecifier.getText()
      .split('\'').join('')
      .split('\"').join('');

      importStatements.push(new ImportStatement(importedModule, importedTypeNames));
    });

    const classNode = this.findClassNode(sutSourceFile);

    const classIdentifier = classNode.getChildren().find(f => f.kind === SyntaxKind.Identifier)!;
    const classChildren = classNode.getChildren();
    const syntaxElements = classChildren.filter(f => f.kind === SyntaxKind.SyntaxList);
    const bodyNode = syntaxElements[syntaxElements.length - 1];
    const bodyChildren = bodyNode.getChildren();

    const methods = this.createMethods(bodyChildren);
    const ctor = this.createConstructor(bodyChildren);

    const sutFileName = path.parse(sutDoc.fileName).name;
    const result = new SutClass(
      sutFileName,
      ctor,
      methods,
      classIdentifier.getText(),
      importStatements);

    return result;
  }

  private createMethods(bodyChildren: Node[]): Method[] {
    return bodyChildren.filter(f => f.kind === SyntaxKind.MethodDeclaration).map((method) => {
      const methodChildren = method.getChildren();

      // Could also use getCombinedModifierFlags
      const modifiers = getModifiers(method as HasModifiers);
      let visibility: ElementVisibility;
      if (modifiers?.length) {
        const modifier = modifiers[0].getText();
        visibility = ElementVisibility.parse(modifier);
      } else {
        visibility = ElementVisibility.createUnknowm();
      }

      const name = methodChildren.find(f => f.kind === SyntaxKind.Identifier)!.getText();
      const result = new Method(name, visibility);
      return result;
    });
  }

  private createConstructor(bodyChildren: Node[]): Constructor | undefined {
    const constructorNode = bodyChildren.find(f => f.kind === SyntaxKind.Constructor);

    if (!constructorNode) {
      return undefined;
    }

    const ctorParams = constructorNode
      .getChildren()
      .find(f => f.kind === SyntaxKind.SyntaxList && f.getChildren().filter(f => f.kind === SyntaxKind.Parameter).length > 0);

    if (!ctorParams) {
      return new Constructor([]);
    }

    const paramTypes = ctorParams
      .getChildren()
      .filter(f => f.kind === SyntaxKind.Parameter)
      .map(ct => {
        const paramChildren = ct.getChildren();

        const typeRef = paramChildren.find(f => f.kind === SyntaxKind.TypeReference)!;


        const paramType = paramChildren.find(f => f.kind === SyntaxKind.TypeReference)!.getText();
        const paraName = paramChildren.find(f => f.kind === SyntaxKind.Identifier)!.getText();

        return new Parameter(paraName, paramType);
      });

    const ctor = new Constructor(paramTypes);
    return ctor;
  }

  private findClassNode(sourceFile: SourceFile): Node {
    // We expect always 2 nodes here: One SyntaxList and one EndOfFile
    const syntaxListNode = sourceFile.getChildren().find(f => f.kind === SyntaxKind.SyntaxList);
    if (!syntaxListNode) {
      throw new Error('Could not find Syntax List Node');
    }

    // Well, we expect a ClassDeclaration node
    const classNode = syntaxListNode.getChildren().find(f => f.kind === SyntaxKind.ClassDeclaration);
    if (!classNode) {
      throw new Error('Could not find Class keyword.');
    }

    return classNode;
  }
}