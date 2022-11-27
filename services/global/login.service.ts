import { request } from '@/utils/request';

class GlobalService {
  public login = (code: string) => request<string>('login', {
		code
	});
}

export const globalService = new GlobalService();
