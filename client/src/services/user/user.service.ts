import { IUseInfo } from '@/types/user';
import { hasServer } from '@/utils/common';
import { request } from '@/utils/request';
import { userStorage } from './user.storage';

class UserService {
  public getUserInfo = (id: string) => {
    if (hasServer()) {
      return request<IUseInfo>('userinfo', { action: 'get', data: { user_id: id } });
    } else {
      return userStorage.getUserInfo();
    }
  };

  public getUserDay = (id: string) => {
    if (hasServer()) {
      return request<number>('userinfo', { action: 'day', data: { user_id: id } });
    } else {
      return userStorage.getUserDay();
    }
  };
}

export const userService = new UserService();
