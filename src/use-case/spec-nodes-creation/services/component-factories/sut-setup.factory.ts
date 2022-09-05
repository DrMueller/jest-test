import { injectable } from 'inversify';
import { factory } from 'typescript';
import ts = require('typescript');
import { Parameter, SutClass } from '../../../sut-analysis/models';
import { NewLineFactory } from '../element-factories/new-line.factory';

@injectable()
export class SutSetupFactory {
  constructor(private readonly newLineFactory: NewLineFactory) {}

  public create(sutClass: SutClass): ts.ExpressionStatement {
    const mockAssignments = sutClass.constuctor?.parameters.map(param => this.createAssignExpression(param)) ?? [];

    const exprs = factory.createExpressionStatement(
      factory.createCallExpression(factory.createIdentifier('beforeEach'), undefined, [
        factory.createArrowFunction(
          undefined,
          undefined,
          [],
          undefined,
          factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          factory.createBlock([...mockAssignments, this.createSutAssignment(sutClass)], true)
        )
      ])
    );

    this.newLineFactory.prependNewLine(exprs);
    return exprs;
  }

  private createAssignExpression(param: Parameter): ts.ExpressionStatement {
    return factory.createExpressionStatement(
      factory.createBinaryExpression(
        factory.createIdentifier(param.mockVariableName),
        factory.createToken(ts.SyntaxKind.EqualsToken),
        factory.createObjectLiteralExpression([], true)
      )
    );
  }

  private createSutAssignment(sutClass: SutClass): ts.ExpressionStatement {
    const mockedParams =
      sutClass.constuctor?.parameters.map(param =>
        factory.createAsExpression(
          factory.createIdentifier(param.mockVariableName),
          factory.createTypeReferenceNode(factory.createIdentifier(param.typeName), undefined)
        )
      ) ?? [];

    return factory.createExpressionStatement(
      factory.createBinaryExpression(
        factory.createIdentifier('testee'),
        factory.createToken(ts.SyntaxKind.EqualsToken),
        factory.createNewExpression(factory.createIdentifier(sutClass.typeName), undefined, mockedParams)
      )
    );
  }
}
