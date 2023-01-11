import { IUseInfo } from '@/types/user';

class UserStorage {
  public getUserInfo = () => {
    const user = uni.getStorageSync('userinfo');
    const defaultData: IUseInfo = {
      _id: 'kelp_and_broccoli',
      day: 1,
      open_id: 'open_id',
      create_time: Date.now(),
      update_time: Date.now(),
    };

    if (user) {
      return Promise.resolve(user as IUseInfo);
    } else {
      uni.setStorageSync('userinfo', defaultData);
      return Promise.resolve(defaultData);
    }
  };

  public getUserDay = async () => {
    const user = await this.getUserInfo();
    const today = new Date();
    const updateTime = new Date(user.update_time);

    if (user) {
      // 如果在新的一天登录，天数加1
      if (
        today.getDate() !== updateTime.getDate() ||
        today.getMonth() !== updateTime.getMonth() ||
        today.getFullYear() !== updateTime.getFullYear()
      ) {
        user.day += 1;
      }

      return Promise.resolve(user.day);
    }
    return Promise.resolve(1);
  };
}

export const userStorage = new UserStorage();
