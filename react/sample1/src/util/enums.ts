import { enumNameToLabel, LetterCasingMode } from './strings';

export interface EnumType {
  [key: string]: string | number;
}

export enum EnumMappingType {
  'Channel Catalog' = 1,
  'Channel Inventory',
  'Retail Catalog',
  'Retail Inventory',
  'Channel File Catalog',
}

export interface EnumToObjectsAttributes {
  choices: EnumType;
  label?: 'name' | 'value';
  value?: 'value' | 'name';
  mode?: LetterCasingMode;
}

interface EnumObject {
  id: string;
  key: string;
  label: string;
  value: string | number;
}

/**
 * Converts an enum to an array of objects that can be used for Select/Dropdowns.
 *
 * The object has the following attributes:
 * - id: ID of the enum, defaults to the enum value
 * - key: To use with rendering methods, defaults to the enum value
 * - label: To use as a user-friendly text, defaults to the name of the enum
 * - value: Value of the enum
 *
 * @param choices
 * @param label
 * @param value
 * @param mode
 */
export function enumToObjects(
  {
    choices,
    label = 'name',
    value = 'value',
    mode = LetterCasingMode.CAPITALIZE_WORDS,
  }: EnumToObjectsAttributes,
): Array<EnumObject> {
  return Object.keys(choices).filter(k => !Number.isNaN(Number(k))).map(enumValue => {
    const enumName = enumNameToLabel(String(choices[enumValue]), { mode });

    const labelToRender: string = label === 'name' ? enumName : enumValue;
    let valueToRender: string | number = value === 'value' ? enumValue : enumName;

    // Regular enums are numbers
    if (!Number.isNaN(Number(valueToRender))) {
      valueToRender = Number(valueToRender);
    }

    return { label: labelToRender, value: valueToRender, key: enumValue, id: enumValue };
  });
}
