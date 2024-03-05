import type { LimitRate } from '../../types/LimitRate';
import type { StorageProvider } from '../../types/StorageProvider';
import { validateLimitRateParams } from '../validateLimitRateParams/validateLimitRateParams';

const getLeftTime = async (
  id: string,
  throttle: number,
  storage: StorageProvider,
): Promise<number> => {
  const lastTime = Number((await storage.get(id)) || 0);
  return throttle - Date.now() + lastTime;
};

export const isLimitRateHit = async (
  defaultID: string,
  options: LimitRate,
  storage?: StorageProvider,
): Promise<boolean> => {
  if (!options.throttle || !storage) {
    return false;
  }

  validateLimitRateParams(options.throttle, options.id);

  const id = options.id || defaultID;
  const leftTime = await getLeftTime(id, options.throttle, storage);

  if (leftTime > 0) {
    return true;
  }

  await storage.set(id, Date.now().toString());
  return false;
};
