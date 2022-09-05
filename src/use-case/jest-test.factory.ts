import * as vscode from 'vscode';
import { injectable } from 'inversify';
import { SpecFileWritingService } from './spec-file/services';
import { SpecNodeFactory } from './spec-nodes-creation/services';
import { SutAnalysisService } from './sut-analysis/services/sut-analysis.service';

@injectable()
export class JestTestFactory {
  constructor(
    private readonly specFileWriter: SpecFileWritingService,
    private readonly sutClassAnalyzer: SutAnalysisService,
    private readonly specNodeFactory: SpecNodeFactory
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
    const sutClass = await this.sutClassAnalyzer.analyze(sutFilePath);
    progress.report({ increment: 33 });
    const specNodes = this.specNodeFactory.createSpecNodes(sutClass);
    progress.report({ increment: 66 });
    await this.specFileWriter.writeSpecFile(sutFilePath, specNodes);
    progress.report({ increment: 100 });
  }
}
