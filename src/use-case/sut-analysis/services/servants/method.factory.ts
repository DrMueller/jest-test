import { injectable } from 'inversify';
import { getModifiers, HasModifiers, Node, SyntaxKind } from 'typescript';
import { ElementVisibility, Method } from '../../models';

@injectable()
export class MethodFactory {
  public createMethods(bodyChildren: Node[]): Method[] {
    return bodyChildren
      .filter(f => f.kind === SyntaxKind.MethodDeclaration)
      .map(method => {
        const methodChildren = method.getChildren();

        // Could also use getCombinedModifierFlags
        const modifiers = getModifiers(method as HasModifiers);
        let visibility: ElementVisibility;
        if (modifiers != null && modifiers.length > 0) {
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
}
