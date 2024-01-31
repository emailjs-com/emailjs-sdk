export const validateLimitRateParams = (throttle: unknown, id?: unknown) => {
  if (typeof throttle !== 'number' || throttle < 0) {
    throw 'The LimitRate throttle has to be a positive number';
  }

  if (id && typeof id !== 'string') {
    throw 'The LimitRate ID has to be a string';
  }
};
