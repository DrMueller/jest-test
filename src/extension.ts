// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { JestTestFactory } from './areas/create-jest-tests';
import { createContainer } from './infrastructure/dependency-injection/container-factory.service';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "jest-test" is now active!');

  const disposable = vscode.commands.registerCommand('extension.createJestTests', (contextData: any) => {
    try {
      if (!contextData) {
        return;
      }

      const container = createContainer();
      const testFactory = container.get<JestTestFactory>(JestTestFactory);
      const selectedPath = contextData.fsPath;
      testFactory.createJestTest(selectedPath);
    } catch (err: any) {
      debugger;
      vscode.window.showErrorMessage(err.message);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
