import type { Options } from '../../types/Options';

export const buildOptions = (options?: Options | string): Options => {
  if (!options) return {};

  // support compatibility with SDK v3
  if (typeof options === 'string') {
    return {
      publicKey: options,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  if (options.toString() === '[object Object]') {
    return options;
  }

  return {};
};
