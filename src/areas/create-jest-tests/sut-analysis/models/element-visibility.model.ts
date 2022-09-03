import { ElementVisibilityType } from '.';
import { EnumUtils } from '../../../../infrastructure/utils';

export class ElementVisibility {
  public constructor(public type: ElementVisibilityType) {
  }

  public static createUnknowm(): ElementVisibility{
    return new ElementVisibility(ElementVisibilityType.unknown);
  }

  public get configKey(): string {
    return ElementVisibilityType[this.type].toLowerCase();
  }

  public static parse(str: string): ElementVisibility {
    const type = <ElementVisibilityType>EnumUtils.parseEnumEntry(ElementVisibilityType, str);
    const result = new ElementVisibility(type);

    return result;
  }
}
