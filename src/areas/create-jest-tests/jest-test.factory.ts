import { inject, injectable } from 'inversify';
import { SpecFileFactory } from './spec-file/services/spec-file.factory';
import { SutClassFactory } from './sut-analysis/services/sut-class.factory';

import * as vscode from 'vscode';
import { SpecFactory } from './spec-creation/services';

@injectable()
export class JestTestFactory {
  constructor(
    @inject(SpecFileFactory) private readonly specFileFactory: SpecFileFactory,
    @inject(SutClassFactory) private readonly sutClassFactory: SutClassFactory,
    @inject(SpecFactory) private readonly specFactory: SpecFactory
  ) {}

  public async createJestTest(sutFilePath: string): Promise<void> {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        cancellable: false,
        title: 'Creating jest test..'
      },
      async progress => {
        await this.execute(sutFilePath, progress);
      }
    );
  }

  private async execute(sutFilePath: string, progress: vscode.Progress<{ message?: string; increment?: number }>): Promise<void> {
    progress.report({ increment: 0 });
    const sutClass = await this.sutClassFactory.create(sutFilePath);
    progress.report({ increment: 33 });
    const specNode = this.specFactory.create(sutClass);
    progress.report({ increment: 66 });
    await this.specFileFactory.writeSpecFile(sutFilePath, specNode);
    progress.report({ increment: 100 });
  }
}
