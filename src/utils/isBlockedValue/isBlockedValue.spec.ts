import { it, describe, expect } from '@jest/globals';
import { isBlockedValueInParams } from './isBlockedValue';
import type { BlockList } from '../../types/BlockList';

describe('should be disabled', () => {
  it('empty block list options', () => {
    const blockList: BlockList = {};

    expect(isBlockedValueInParams(blockList, {})).toBeFalsy();
  });

  it('without list', () => {
    const blockList: BlockList = {
      watchVariable: 'email',
    };

    expect(isBlockedValueInParams(blockList, {})).toBeFalsy();
  });

  it('without watchVariable', () => {
    const blockList: BlockList = {
      list: ['test@emailjs.com'],
    };

    expect(isBlockedValueInParams(blockList, {})).toBeFalsy();
  });

  it('without data', () => {
    const blockList: BlockList = {
      watchVariable: 'email',
      list: ['test@emailjs.com'],
    };

    expect(isBlockedValueInParams(blockList, {})).toBeFalsy();
  });

  it('wrong type', () => {
    const blockList: BlockList = {
      watchVariable: 'email',
      list: ['test@emailjs.com'],
    };

    expect(
      isBlockedValueInParams(blockList, {
        email: ['item', 'item'],
      }),
    ).toBeFalsy();
  });

  it('not found in the list', () => {
    const blockList: BlockList = {
      watchVariable: 'email',
      list: ['test@emailjs.com', 'bar@emailjs.com'],
    };

    expect(
      isBlockedValueInParams(blockList, {
        email: 'foo@emailjs.com',
      }),
    ).toBeFalsy();
  });
});

describe('should be enabled', () => {
  it('template params', () => {
    const blockList: BlockList = {
      watchVariable: 'email',
      list: ['test@emailjs.com', 'foo@emailjs.com', 'bar@emailjs.com'],
    };

    expect(
      isBlockedValueInParams(blockList, {
        email: 'test@emailjs.com',
        other: 'other data',
      }),
    ).toBeTruthy();
  });

  it('form data', () => {
    const blockList: BlockList = {
      watchVariable: 'email',
      list: ['test@emailjs.com', 'foo@emailjs.com', 'bar@emailjs.com'],
    };

    const formData = new FormData();
    formData.append('email', 'test@emailjs.com');
    formData.append('other', 'other data');

    expect(isBlockedValueInParams(blockList, formData)).toBeTruthy();
  });
});
