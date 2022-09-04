import * as fs from 'fs';
import * as ts from 'typescript';
import { parse, join } from 'path';
import { injectable } from 'inversify';
import { NewLineFactory } from '../../spec-nodes-creation/services/element-factories';

@injectable()
export class SpecFileWritingService {
  public async writeSpecFile(sutFilePath: string, nodes: ts.Node[]): Promise<void> {
    const parssedSutPath = parse(sutFilePath);

    const specFilePath = join(parssedSutPath.dir, `${parssedSutPath.name}.spec.ts`);
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
