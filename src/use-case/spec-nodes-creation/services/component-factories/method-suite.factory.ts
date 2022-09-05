import { injectable } from 'inversify';
import { factory } from 'typescript';
import ts = require('typescript');
import { ElementVisibilityType, SutClass } from '../../../sut-analysis/models';
import { NewLineFactory } from '../element-factories/new-line.factory';

@injectable()
export class MethodSuiteFactory {
  constructor(private readonly newLineFactory: NewLineFactory) {}

  public createSuitesForMethods(sutClass: SutClass): ts.Statement[] {
    const publicMethods = sutClass.methods.filter(f => f.visibility.type !== ElementVisibilityType.private);

    const describeStatements = publicMethods.map(method =>
      factory.createExpressionStatement(
        factory.createCallExpression(factory.createIdentifier('describe'), undefined, [
          factory.createStringLiteral(`${method.name} should`),
          factory.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            this.createPreviewSpecBlock()
          )
        ])
      )
    );

    describeStatements.forEach(ds => this.newLineFactory.prependNewLine(ds));

    return describeStatements;
  }

  private createPreviewSpecBlock(): ts.Block {
    return factory.createBlock(
      [
        factory.createExpressionStatement(
          factory.createCallExpression(factory.createIdentifier('it'), undefined, [
            factory.createStringLiteral('here could be your test'),
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
    );
  }
}
