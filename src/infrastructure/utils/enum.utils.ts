export class EnumUtils {
  public static parseEnumEntry(enumType: any, str: string): any {
    const enumKeyValues = this.getEnumKeyValues(enumType);
    const enumEntry = enumKeyValues.find(f => f.value.toLowerCase() === str.toLowerCase())!;
    return enumEntry.key;
  }

  private static getEnumKeyValues(enumType: any): {key: number, value: string}[] {
    const parsedEnumKeys = Object.keys(enumType).map(f => {
      return parseInt(f);
    });

    const numericEnumKeys = parsedEnumKeys.filter(f => {
      return f.toString() !== 'NaN';
    });

    const result = numericEnumKeys.map(f => {
      const enumValue = enumType[f];
      return {key: f, value: enumValue};
    });

    return result;
  }
}
