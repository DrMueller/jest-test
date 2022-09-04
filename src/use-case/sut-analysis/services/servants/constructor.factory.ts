import { injectable } from 'inversify';
import { Node, SyntaxKind } from 'typescript';
import { Constructor, Parameter } from '../../models';

@injectable()
export class ConsructorFactory {
  public tryCreatingConstructor(bodyChildren: Node[]): Constructor | undefined {
    const constructorNode = bodyChildren.find(f => f.kind === SyntaxKind.Constructor);

    if (constructorNode == null) {
      return undefined;
    }

    const ctorParams = constructorNode
      .getChildren()
      .find(f => f.kind === SyntaxKind.SyntaxList && f.getChildren().filter(f => f.kind === SyntaxKind.Parameter).length > 0);

    if (ctorParams == null) {
      return new Constructor([]);
    }

    const paramTypes = ctorParams
      .getChildren()
      .filter(f => f.kind === SyntaxKind.Parameter)
      .map(ct => {
        const paramChildren = ct.getChildren();

        const paramType = paramChildren.find(f => f.kind === SyntaxKind.TypeReference)!.getText();
        const paraName = paramChildren.find(f => f.kind === SyntaxKind.Identifier)!.getText();

        return new Parameter(paraName, paramType);
      });

    const ctor = new Constructor(paramTypes);
    return ctor;
  }
}
