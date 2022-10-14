import { request } from '@/utils/request';

class GlobalService {
  public login = () => request<string>('login');
}

export const globalService = new GlobalService();
