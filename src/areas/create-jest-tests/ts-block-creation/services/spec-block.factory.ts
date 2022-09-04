import { factory, Node } from 'typescript';
import * as ts from 'typescript';
import { ElementVisibilityType, SutClass } from '../../sut-analysis/models';
import { inject, injectable } from 'inversify';
import { VariableFactory } from './servants/variable-factory';
import { SutSetupFactory } from './servants/sut-setup.factory';
import { NewLineFactory } from './servants/new-line.factory';
import { ImportFactory } from './servants/import.factory';

@injectable()
export class SpecBlockFactory {
  constructor(
    @inject(VariableFactory) private readonly variableFactory: VariableFactory,
    @inject(SutSetupFactory) private readonly sutSetupFactory: SutSetupFactory,
    @inject(NewLineFactory) private readonly newLineFactory: NewLineFactory,
    @inject(ImportFactory) private readonly importFactory: ImportFactory
  ) {}

  public create(sutClass: SutClass): Node[] {
    const suiteExpr = factory.createExpressionStatement(
      factory.createCallExpression(factory.createIdentifier('describe'), undefined, [
        factory.createStringLiteral(sutClass.typeName),
        factory.createArrowFunction(
          undefined,
          undefined,
          [],
          undefined,
          factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          factory.createBlock(
            [
              ...this.createVariableDeclarations(sutClass),
              this.sutSetupFactory.create(sutClass),
              ...this.createShouldDescribeExpressions(sutClass)
            ],
            true
          )
        )
      ])
    );

    this.newLineFactory.prependNewLine(suiteExpr);
    return [...this.importFactory.createImportsForRequiredClasses(sutClass), suiteExpr];
  }

  private createVariableDeclarations(sutClass: SutClass): ts.VariableStatement[] {
    const testeeDecl = this.variableFactory.create('testee', sutClass.typeName);

    const mockClassDecl = sutClass.constuctor?.parameters.map(p =>
      this.variableFactory.create(p.mockVariableName, `Partial<${p.typeName}>`)
    );

    return [testeeDecl, ...(mockClassDecl ?? [])];
  }

  private createShouldDescribeExpressions(sutClass: SutClass): ts.Statement[] {
    const publicMethods = sutClass.methods.filter(f => f.visibility.type !== ElementVisibilityType.private);

    const result: ts.Statement[] = [];

    for (const method of publicMethods) {
      const describe = factory.createExpressionStatement(
        factory.createCallExpression(factory.createIdentifier('describe'), undefined, [
          factory.createStringLiteral(`${method.name} should`),
          factory.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock(
              [
                factory.createExpressionStatement(
                  factory.createCallExpression(factory.createIdentifier('it'), undefined, [
                    factory.createStringLiteral('write test here'),
                    factory.createArrowFunction(
                      undefined,
                      undefined,
                      [],
                      undefined,
                      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                      factory.createBlock([], true)
                    )
                  ])
                )
              ],
              true
            )
          )
        ])
      );

      this.newLineFactory.prependNewLine(describe);
      result.push(describe);
    }

    return result;
  }
}
