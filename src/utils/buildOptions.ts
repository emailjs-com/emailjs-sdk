import type { Options } from '../types/Options';

export const buildOptions = (options?: Options | string): Options => {
  if (!options) return {};

  // support compatibility with SDK v3
  if (typeof options === 'string') {
    return {
      publicKey: options,
    };
  }

  if (typeof options == 'object') {
    return options;
  }

  return {};
};
