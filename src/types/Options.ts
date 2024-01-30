import type { BlockList } from './BlockList';
import type { LimitRate } from './LimitRate';

export interface Options {
  origin?: string;
  publicKey?: string;
  blockHeadless?: boolean;
  blockList?: BlockList;
  limitRate?: LimitRate;
}
