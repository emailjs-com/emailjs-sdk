import type { BlockList } from './BlockList';

export interface Options {
  origin?: string;
  publicKey?: string;
  blockHeadless?: boolean;
  blockList?: BlockList;
  limitRate?: number;
}
