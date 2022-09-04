import { injectable } from 'inversify';
import * as fs from 'fs';
import { basename, join } from 'path';
import * as ts from 'typescript';
import { NewLineFactory } from '../../spec-creation/services/servants';

@injectable()
export class SpecFileFactory {
  public async writeSpecFile(sutFilePath: string, nodes: ts.Node[]): Promise<void> {
    const sutFileName = basename(sutFilePath);
    const sutPath = sutFilePath.substring(0, sutFilePath.length - sutFileName.length);

    const specFilePath = join(sutPath, `${sutFileName}.spec.ts`);
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
