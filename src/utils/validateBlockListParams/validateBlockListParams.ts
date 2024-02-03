export const validateBlockListParams = (list: unknown, watchVariable: unknown) => {
  if (!Array.isArray(list)) {
    throw 'The BlockList list has to be an array';
  }

  if (typeof watchVariable !== 'string') {
    throw 'The BlockList watchVariable has to be a string';
  }
};
