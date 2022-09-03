import { Constructor } from "./constructor.model";
import { ImportStatement } from "./import-statement";
import { Method } from "./method.model";

export class SutClass {
  constructor(
    public readonly fileName: string,
    public readonly constuctor: Constructor | undefined,
    public readonly methods: Method[],
    public readonly typeName: string,
    public readonly imports: ImportStatement[]) {}
}
