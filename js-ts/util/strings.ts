import { OptionData, OptionGroupData } from 'rc-select/es/interface';
import { FilterFunc } from 'rc-select/es/interface/generator';

export function capitalizeWord(text: string): string {
  if (!text || text === '') return text;

  return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
}

export function capitalizeWords(text: string): string {
  return text.split(' ')
    .map(word => capitalizeWord(word))
    .join(' ');
}

export enum LetterCasingMode {
  LOWERCASE = 'LOWERCASE',
  CAPITALIZE = 'CAPITALIZE',
  CAPITALIZE_WORDS = 'CAPITALIZE_WORDS',
  NONE = 'NONE',
}

/**
 * Given an enum name, transform it to a label with each word capitalized.
 *
 * i.e.:
 * - FIRST_CHOICE = First Choice
 * - SECOND_CHOICE = Second Choice
 * - A_REGULAR_CHOICE = A Regular Choice
 *
 * @param text
 * @param options - Extra options to be used with the function
 */
export function enumNameToLabel(text: string, { mode = LetterCasingMode.CAPITALIZE_WORDS }: { mode?: LetterCasingMode } = {}): string {
  if (!text) {
    return '';
  }

  const label = text.replace(/_/g, ' ').trim();

  switch (mode) {
    case LetterCasingMode.LOWERCASE:
      return label.toLowerCase();
    case LetterCasingMode.CAPITALIZE:
      return capitalizeWord(label);
    case LetterCasingMode.CAPITALIZE_WORDS:
      return capitalizeWords(label);
    case LetterCasingMode.NONE:
    default:
      return label;

  }
}

export const filterOption: FilterFunc<OptionData | OptionGroupData> = (value, option) => {

  if (option?.type?.isSelectOptGroup) {
    return option?.children?.includes((child: any) => child.props.children.toLowerCase().indexOf(value.toLowerCase()) >= 0);
  }
  return option?.children?.toLowerCase().indexOf(value.toLowerCase()) >= 0;
};

export function groupByKey(objectArray: Array<any>, property: string) {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(obj);
    return acc;
  }, {});
}


export function toMoney(value: number | string) {
  return `$${Number(value).toFixed(2)}`;
}

export function sumObjectArrayValues(array: Array<object>, key: string) {
  const total = array.reduce((accumulator: any, current: any) => accumulator + Number(current[key]), 0);
  return Math.round((total + Number.EPSILON) * 100) / 100;
}

export const appendUnits = (value: number, unit: string, pluralSuffix: string = 's'): string => {
  if (value === 1) {
    return `${value} ${unit}`;
  }

  return `${value} ${unit}${pluralSuffix}`;
};

export const lowerCaseKeys = (obj: any): any => {
  if (typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(lowerCaseKeys);
  }
  if (obj === null) {
    return null;
  }
  const entries = Object.entries(obj);
  const mappedEntries = entries.map(
    ([k, v]) => [
      `${k.substr(0, 1).toLowerCase()}${k.substr(1)}`,
      lowerCaseKeys(v)] as const,
  );
  return Object.fromEntries(mappedEntries);
};
