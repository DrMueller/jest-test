import {addSyntheticLeadingComment } from 'typescript';
import * as ts from 'typescript';
import { injectable } from 'inversify';


@injectable()
export class NewLineFactory {
  public static newLineComment = '__NEW_LINE__';

  // Can't officially add newlines, so we missuse comments
  // See https://stackoverflow.com/questions/55246585/how-to-generate-extra-newlines-between-nodes-with-the-typescript-compiler-api-pr
  public prependNewLine(node: ts.Node): void {
    addSyntheticLeadingComment(node, ts.SyntaxKind.MultiLineCommentTrivia, NewLineFactory.newLineComment, true);
  }
}