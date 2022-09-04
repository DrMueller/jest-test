import { injectable } from 'inversify';
import { Node, SourceFile, SyntaxKind } from 'typescript';

@injectable()
export class ClassAnalysisService {
  public analyzeClass(sourceFile: SourceFile): { className: string; bodyNodes: Node[] } {
    const classNode = this.findClassNode(sourceFile);

    const classIdentifier = classNode.getChildren().find(f => f.kind === SyntaxKind.Identifier)!;
    const classChildren = classNode.getChildren();
    const syntaxElements = classChildren.filter(f => f.kind === SyntaxKind.SyntaxList);
    const bodyNode = syntaxElements[syntaxElements.length - 1];
    const bodyChildren = bodyNode.getChildren();

    return { className: classIdentifier.getText(), bodyNodes: bodyChildren };
  }

  private findClassNode(sourceFile: SourceFile): Node {
    // We expect always 2 nodes here: One SyntaxList and one EndOfFile
    const syntaxListNode = sourceFile.getChildren().find(f => f.kind === SyntaxKind.SyntaxList);
    if (syntaxListNode == null) {
      throw new Error('Could not find Syntax List Node');
    }

    // Well, we expect a ClassDeclaration node
    const classNode = syntaxListNode.getChildren().find(f => f.kind === SyntaxKind.ClassDeclaration);
    if (classNode == null) {
      throw new Error('Could not find Class keyword.');
    }

    return classNode;
  }
}
