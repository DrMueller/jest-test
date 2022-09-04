import * as ts from 'typescript';
import { SutClass } from '../../sut-analysis/models';
import { Node, factory } from 'typescript';
import { inject, injectable } from 'inversify';
import { ImportFactory } from './element-factories/import.factory';
import { NewLineFactory } from './element-factories/new-line.factory';
import { SutSetupFactory } from './component-factories/sut-setup.factory';
import { VariableFactory } from './element-factories/variable-factory';
import { MethodSuiteFactory, VariableDeclarationFactory } from './component-factories';

@injectable()
export class SpecNodeFactory {
  constructor(
    @inject(VariableFactory) private readonly variableFactory: VariableFactory,
    @inject(SutSetupFactory) private readonly sutSetupFactory: SutSetupFactory,
    @inject(NewLineFactory) private readonly newLineFactory: NewLineFactory,
    @inject(ImportFactory) private readonly importFactory: ImportFactory,
    @inject(MethodSuiteFactory) private readonly methodSuiteFactory: MethodSuiteFactory,
    @inject(VariableDeclarationFactory) private readonly variableDeclarationFactory: VariableDeclarationFactory
  ) {}

  public createSpecNodes(sutClass: SutClass): Node[] {
    const variableDeclarations = this.variableDeclarationFactory.createVariableDeclarations(sutClass);
    const methodSuites = this.methodSuiteFactory.createSuitesForMethods(sutClass);
    const sutSetup = this.sutSetupFactory.create(sutClass);

    const suiteExpr = factory.createExpressionStatement(
      factory.createCallExpression(factory.createIdentifier('describe'), undefined, [
        factory.createStringLiteral(sutClass.typeName),
        factory.createArrowFunction(
          undefined,
          undefined,
          [],
          undefined,
          factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          factory.createBlock([...variableDeclarations, sutSetup, ...methodSuites], true)
        )
      ])
    );

    const importNodes = this.importFactory.createImportsForRequiredClasses(sutClass);
    this.newLineFactory.prependNewLine(suiteExpr);
    return [...importNodes, suiteExpr];
  }
}
