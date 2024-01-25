import type { Options } from '../../types/Options';

export const buildOptions = (options?: Options | string): Options => {
  if (!options) return {};

  // support compatibility with SDK v3
  if (typeof options === 'string') {
    return {
      publicKey: options,
    };
  }

  if (options.toString() === '[object Object]') {
    return options;
  }

  return {};
};
