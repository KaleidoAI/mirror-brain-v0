/**
 * asyncMap returns the results of applying an async function over an list.
 *
 * @param list - Iterable object of items, e.g. an Array, Set, Object.keys
 * @param asyncTransform
 * @returns
 */
export async function asyncMap<FromType, ToType>(
  list: Iterable<FromType>,
  asyncTransform: (item: FromType) => Promise<ToType>
): Promise<ToType[]> {
  const promises: Promise<ToType>[] = [];
  for (const item of list) {
    promises.push(asyncTransform(item));
  }
  return Promise.all(promises);
}
