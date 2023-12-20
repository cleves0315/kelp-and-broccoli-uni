import { GetUserDayRes, GetUserInfoRes, IUseInfo } from '@/types/user';
import { getStorageSync, setStorageSync } from '@/utils/storage';

class UserStorage {
  public user: IUseInfo = null;

  public getUserInfo = async (): Promise<GetUserInfoRes> => {
    this.user = getStorageSync('userinfo');

    if (this.user) {
      await this.updateTime();
      return Promise.resolve({ user: this.user });
    } else {
      const defaultData: IUseInfo = {
        _id: 'kelp_and_broccoli',
        day: 1,
        open_id: 'open_id',
        create_time: Date.now(),
        update_time: Date.now(),
        update_time_day: Date.now(),
      };
      setStorageSync('userinfo', defaultData);
      return Promise.resolve({ user: defaultData });
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
      this.user.update_time_day = Date.now();
      setStorageSync('userinfo', this.user);
    } else if (typeof this.user.update_time_day === 'undefined') {
      this.user.update_time = Date.now();
      this.user.update_time_day = Date.now();
    }
  };

  public getUserDay = async (): Promise<GetUserDayRes> => {
    const { user } = await this.getUserInfo();

    if (user) {
      return Promise.resolve({ day: user.day, update_time_day: user.update_time_day });
    }
    return Promise.resolve({ day: 1, update_time_day: Date.now() });
  };
}

export const userStorage = new UserStorage();
