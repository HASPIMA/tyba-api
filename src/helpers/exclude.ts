/**
 * This function excludes properties of a given object
 * in case these are not needed,
 *
 * @param object Object which properties will be deleted from
 * @param keys Properties to exclude from object
 * @returns Object with the properties stripped from
 */
export function exclude<T, K extends keyof T>(
  object: T,
  keys: K[],
): Omit<T, K> {
  for (let key of keys) {
    delete object[key];
  }
  return object;
}
