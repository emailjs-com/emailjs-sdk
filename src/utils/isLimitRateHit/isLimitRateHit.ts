import type { LimitRate } from '../../types/LimitRate';
import { validateLimitRateParams } from '../validateLimitRateParams/validateLimitRateParams';

const getLeftTime = (id: string, throttle: number, localStorage: Storage): number => {
  const lastTime = Number(localStorage.getItem(id) || 0);
  return throttle - Date.now() + lastTime;
};

const removeRecord = (id: string, leftTime: number, localStorage: Storage): void => {
  setTimeout(() => {
    localStorage.removeItem(id);
  }, leftTime);
};

export const isLimitRateHit = (
  localStorage: Storage,
  defaultID: string,
  options: LimitRate,
): boolean => {
  if (!options.throttle) {
    return false;
  }

  validateLimitRateParams(options.throttle, options.id);

  const id = options.id || defaultID;
  const leftTime = getLeftTime(id, options.throttle, localStorage);

  if (leftTime > 0) {
    removeRecord(id, leftTime, localStorage);
    return true;
  }

  localStorage.setItem(id, Date.now().toString());
  removeRecord(id, options.throttle, localStorage);
  return false;
};
