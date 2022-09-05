import { injectable } from 'inversify';
import ts = require('typescript');
import { SutClass } from '../../../sut-analysis/models';
import { VariableFactory } from '../element-factories';

@injectable()
export class VariableDeclarationFactory {
  public constructor(private readonly variableFactory: VariableFactory) {}

  public createVariableDeclarations(sutClass: SutClass): ts.VariableStatement[] {
    const testeeDecl = this.variableFactory.create('testee', sutClass.typeName);

    const mockClassDecl = sutClass.constuctor?.parameters.map(p =>
      this.variableFactory.create(p.mockVariableName, `Partial<${p.typeName}>`)
    );

    return [testeeDecl, ...(mockClassDecl ?? [])];
  }
}
