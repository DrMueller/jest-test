import * as ts from 'typescript';
import * as vscode from 'vscode';
import { SutClass } from '../models';
import { injectable } from 'inversify';
import path = require('path');
import { ImportStatementFactory } from './servants/import-statement.factory';
import { ConsructorFactory } from './servants';
import { MethodFactory } from './servants/method.factory';
import { ClassAnalysisService } from './servants/class-analysis.service';

@injectable()
export class SutAnalysisService {
  constructor(
    private readonly classAnalyzer: ClassAnalysisService,
    private readonly importStatementFactory: ImportStatementFactory,
    private readonly constructorFactory: ConsructorFactory,
    private readonly methodFactory: MethodFactory
  ) {}

  public async analyze(sutFilePath: string): Promise<SutClass> {
    const sutDoc = await vscode.workspace.openTextDocument(sutFilePath);
    const sutSourceFile = ts.createSourceFile(sutDoc.fileName, sutDoc.getText(), ts.ScriptTarget.Latest, true);
    const analyzedClass = this.classAnalyzer.analyzeClass(sutSourceFile);
    const methods = this.methodFactory.createMethods(analyzedClass.bodyNodes);
    const ctor = this.constructorFactory.tryCreatingConstructor(analyzedClass.bodyNodes);
    const importStatements = this.importStatementFactory.create(sutSourceFile);
    const sutFileName = path.parse(sutDoc.fileName).name;
    const result = new SutClass(sutFileName, ctor, methods, analyzedClass.className, importStatements);

    return result;
  }
}
