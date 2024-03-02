import type { LimitRate } from '../../types/LimitRate';
import type { StorageProvider } from '../../types/StorageProvider';
import { validateLimitRateParams } from '../validateLimitRateParams/validateLimitRateParams';

const getLeftTime = (id: string, throttle: number, storage: StorageProvider): number => {
  const lastTime = Number(storage.get(id) || 0);
  return throttle - Date.now() + lastTime;
};

const removeRecord = (id: string, leftTime: number, storage: StorageProvider): void => {
  setTimeout(() => {
    storage.remove(id);
  }, leftTime);
};

export const isLimitRateHit = (
  defaultID: string,
  options: LimitRate,
  storage?: StorageProvider,
): boolean => {
  if (!options.throttle || !storage) {
    return false;
  }

  validateLimitRateParams(options.throttle, options.id);

  const id = options.id || defaultID;
  const leftTime = getLeftTime(id, options.throttle, storage);

  if (leftTime > 0) {
    removeRecord(id, leftTime, storage);
    return true;
  }

  storage.set(id, Date.now().toString());
  removeRecord(id, options.throttle, storage);
  return false;
};
