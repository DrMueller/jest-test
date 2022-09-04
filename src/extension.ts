// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createContainer } from './infrastructure/dependency-injection/container-factory.service';
import { JestTestFactory } from './use-case';

export function activate(context: vscode.ExtensionContext): void {
  console.log('Congratulations, your extension "jest-test" is now active!');

  const disposable = vscode.commands.registerCommand('extension.createJestTests', async (contextData: any) => {
    try {
      if (contextData?.fsPath === undefined) {
        await vscode.window.showErrorMessage('No file selected.');
        return;
      }

      const container = createContainer();
      const testFactory = container.get<JestTestFactory>(JestTestFactory);
      const selectedPath = contextData.fsPath;
      await testFactory.createJestTest(selectedPath);
    } catch (err: any) {
      await vscode.window.showErrorMessage(err.message);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate(): void {}
