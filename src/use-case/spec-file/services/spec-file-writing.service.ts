import * as fs from 'fs';
import * as ts from 'typescript';
import { basename, join } from 'path';
import { injectable } from 'inversify';
import { NewLineFactory } from '../../spec-nodes-creation/services/element-factories';

@injectable()
export class SpecFileWritingService {
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
