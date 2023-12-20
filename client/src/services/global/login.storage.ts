import { userStorage } from '../user/user.storage';

class GlobalStorage {
  public login = async () => {
    const { user } = await userStorage.getUserInfo();
    return Promise.resolve(user._id);
  };
}

export const globalStorage = new GlobalStorage();
