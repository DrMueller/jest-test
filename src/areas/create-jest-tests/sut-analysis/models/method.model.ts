import { ElementVisibility } from "./element-visibility.model";

export class Method {
  constructor(
    public readonly name: string,
    public readonly visibility: ElementVisibility) {}
}