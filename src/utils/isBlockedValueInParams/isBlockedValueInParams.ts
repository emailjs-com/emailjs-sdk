import type { BlockList } from '../../types/BlockList';
import { validateBlockListParams } from '../validateBlockListParams/validateBlockListParams';

const isBlockListDisabled = (options: BlockList): boolean => {
  return !options.list?.length || !options.watchVariable;
};

const getValue = (data: Record<string, unknown> | FormData, name: string): unknown => {
  return data instanceof FormData ? data.get(name) : data[name];
};

export const isBlockedValueInParams = (
  options: BlockList,
  params: Record<string, unknown> | FormData,
): boolean => {
  if (isBlockListDisabled(options)) return false;

  validateBlockListParams(options.list, options.watchVariable);

  const value = getValue(params, options.watchVariable!);

  if (typeof value !== 'string') return false;

  return options.list!.includes(value);
};
