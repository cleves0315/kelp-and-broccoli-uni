import { IUseInfo } from '@/types/user';

class UserStorage {
  public user: IUseInfo = null;

  public getUserInfo = async () => {
    this.user = uni.getStorageSync('userinfo');

    if (this.user) {
      await this.updateTime();
      return Promise.resolve(this.user as IUseInfo);
    } else {
      const defaultData: IUseInfo = {
        _id: 'kelp_and_broccoli',
        day: 1,
        open_id: 'open_id',
        create_time: Date.now(),
        update_time: Date.now(),
      };
      uni.setStorageSync('userinfo', defaultData);
      return Promise.resolve(defaultData);
    }
  };

  private updateTime = async () => {
    if (!this.user) return;
    const today = new Date();
    const updateTime = new Date(this.user.update_time);


    // 如果在新的一天登录，天数加1
    if (
      today.getDate() !== updateTime.getDate() ||
      today.getMonth() !== updateTime.getMonth() ||
      today.getFullYear() !== updateTime.getFullYear()
    ) {
      this.user.day += 1;
      this.user.update_time = Date.now();
      uni.setStorageSync('userinfo', this.user);
    }
  };

  public getUserDay = async () => {
    const user = await this.getUserInfo();

    console.log('user： ', user);

    if (user) {
      return Promise.resolve(user.day);
    }
    return Promise.resolve(1);
  };
}

export const userStorage = new UserStorage();
