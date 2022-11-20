import { IUseInfo } from '@/types/user';
import { request } from '@/utils/request';

class UserService {
  public getUserInfo = (id: string) => {
    return request<IUseInfo>('userinfo', { action: 'get', data: { user_id: id } });
  };

  public getUserDay = (id: string) => request<number>('userinfo', { action: 'day', data: { user_id: id } });
}

export const userService = new UserService();
