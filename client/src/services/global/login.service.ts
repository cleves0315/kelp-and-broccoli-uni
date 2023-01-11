import { hasServer } from '@/utils/common';
import { request } from '@/utils/request';
import { globalStorage } from './login.storage';

class GlobalService {
  public login = () => {
    if (hasServer()) {
      return request<string>('login');
    } else {
      return globalStorage.login();
    }
  };
}

export const globalService = new GlobalService();
