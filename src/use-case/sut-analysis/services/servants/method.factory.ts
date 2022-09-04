import { injectable } from 'inversify';
import { getCombinedModifierFlags, ModifierFlags, Node, SyntaxKind, MethodDeclaration } from 'typescript';
import { ElementVisibility, ElementVisibilityType, Method } from '../../models';

@injectable()
export class MethodFactory {
  public createMethods(bodyChildren: Node[]): Method[] {
    return bodyChildren
      .filter(f => f.kind === SyntaxKind.MethodDeclaration)
      .map(method => {
        const methodChildren = method.getChildren();
        const visibility = this.readVisibility(method as MethodDeclaration);
        const name = methodChildren.find(f => f.kind === SyntaxKind.Identifier)!.getText();
        const result = new Method(name, visibility);
        return result;
      });
  }

  private readVisibility(method: MethodDeclaration): ElementVisibility {
    const modifierFlags = getCombinedModifierFlags(method);
    let visibilityType: ElementVisibilityType;

    if ((modifierFlags & ModifierFlags.Public) !== 0) {
      visibilityType = ElementVisibilityType.public;
    } else if ((modifierFlags & ModifierFlags.Protected) !== 0) {
      visibilityType = ElementVisibilityType.protected;
    } else if ((modifierFlags & ModifierFlags.Private) !== 0) {
      visibilityType = ElementVisibilityType.private;
    } else {
      visibilityType = ElementVisibilityType.unknown;
    }

    return new ElementVisibility(visibilityType);
  }
}
