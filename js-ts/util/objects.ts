import { cloneDeep } from 'lodash';

/**
 * Given an object where some attributes are arrays of data, return
 * a copy of the object itself but with the arrays converted into
 * comma-separated strings.
 *
 * Be noted that in case it's an array of objects, no special treatment
 * is provided.
 * @param input
 */
// eslint-disable-next-line import/prefer-default-export
export function objArrayToCommaString(input?: { [key: string]: any }): object {
  if (!input) {
    return {};
  }

  const output = cloneDeep(input);

  Object.keys(input).forEach((k: string) => {
    if (!Array.isArray(output[k])) {
      return;
    }

    output[k] = (output[k] as any[]).join(',');
  });

  return output;
}
