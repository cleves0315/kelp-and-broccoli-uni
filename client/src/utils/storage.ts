import { StorageKey } from '@/types/storage';

export const setStorageSync = (key: StorageKey, value: any) => {
  uni.setStorageSync(key, value);
};

export const getStorageSync = (key: StorageKey) => {
  return uni.getStorageSync(key);
};
