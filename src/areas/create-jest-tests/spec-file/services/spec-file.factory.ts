import { injectable } from 'inversify';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import * as vscode from 'vscode';
import { NewLineFactory } from '../../ts-block-creation/services/servants/new-line.factory';

@injectable()
export class SpecFileFactory {
  public async writeSpecFile(sutFilePath: string, nodes: ts.Node[]): Promise<void> {
    const sutFileName = path.basename(sutFilePath);
    const sutPath = sutFilePath.substring(0, sutFilePath.length - sutFileName.length);

    const specFilePath = path.join(sutPath, `${sutFileName}.spec.ts`);
    if (fs.existsSync(specFilePath)) {
      fs.rmSync(specFilePath);
    }

    const nodeArray = ts.factory.createNodeArray(nodes);
    let str = ts.createPrinter().printList(ts.ListFormat.MultiLine, nodeArray, ts.createSourceFile('', '', ts.ScriptTarget.Latest, true));

    // Replace the temp comment to just keep the new lines
    str = str.split(`/*${NewLineFactory.newLineComment}*/`).join('');

    fs.writeFileSync(specFilePath, str);
  }
}
