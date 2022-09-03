import { inject, injectable } from "inversify";
import { SpecFileFactory } from "./spec-file/services/spec-file.factory";
import { SutClassFactory } from "./sut-analysis/services/sut-class.factory";
import { SpecBlockFactory } from "./ts-block-creation/services/spec-block.factory";

import * as vscode from 'vscode';

@injectable()
export class JestTestFactory {
  constructor(
    @inject(SpecFileFactory) private specFileFactory: SpecFileFactory,
    @inject(SutClassFactory) private sutClassFactory: SutClassFactory,
    @inject(SpecBlockFactory) private specBlockFactory: SpecBlockFactory,
  ) {
  }

  public async createJestTest(sutFilePath: string): Promise<void> {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      cancellable: false,
      title: 'Creating jest test..'
    }, async (progress) => {
      await this.execute(sutFilePath, progress);
    });
  }

  private async execute(sutFilePath:string, progress:vscode.Progress<{message?:string, increment?:number}>):Promise<void> {
    progress.report({ increment: 0 });
    const sutClass = await this.sutClassFactory.create(sutFilePath);
    progress.report({ increment: 33 });
    const specNode = this.specBlockFactory.create(sutClass);
    progress.report({ increment: 66 });
    await this.specFileFactory.writeSpecFile(sutFilePath, specNode);
    progress.report({ increment: 100 });
  }
}
