import type { BlockList } from './BlockList';
import type { LimitRate } from './LimitRate';
import type { StorageProvider } from './StorageProvider';

export interface Options {
  origin?: string;
  publicKey?: string;
  blockHeadless?: boolean;
  blockList?: BlockList;
  limitRate?: LimitRate;
  storageProvider?: StorageProvider;
}
