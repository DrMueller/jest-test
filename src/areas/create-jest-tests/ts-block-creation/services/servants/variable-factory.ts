import { factory } from 'typescript';
import * as ts from 'typescript';
import { injectable } from 'inversify';

@injectable()
export class VariableFactory {
  public create(variableName: string, typeName: string): ts.VariableStatement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(variableName),
            undefined,
            factory.createTypeReferenceNode(factory.createIdentifier(typeName), undefined),
            undefined
          )
        ],
        ts.NodeFlags.Let
      )
    );
  }
}
