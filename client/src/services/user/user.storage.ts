import { LATEST_VERSION } from '@/constants';
import { PlanNoEnum } from '@/constants/enum';
import { GetUserDayRes, GetUserInfoRes, IUseInfo } from '@/types/user';
import { getStorageSync, setStorageSync } from '@/utils/storage';
import { planStorage } from '../plan/plan.storage';

class UserStorage {
  public user: IUseInfo = null;

  /**
   * 用户最后登录版本是否最新版
   * @returns '0' 未知 | '1' 是 ｜ '2' 不是
   */
  private checkLatestVersion = (): '0' | '1' | '2' => {
    if (this.user) {
      return this.user.last_version === LATEST_VERSION ? '1' : '2';
    }
    return '0';
  };

  public getUserInfo = async (): Promise<GetUserInfoRes> => {
    this.user = getStorageSync('userinfo');

    if (this.user) {
      await this.updateTime();

      if (this.checkLatestVersion() !== '1') {
        // TODO: 列表中不存在 wiki 才加入通知。（del）
        const list = await planStorage.getPlanList();
        const wikiPlan = list.find((item) => item.plan_no === PlanNoEnum.wiki);
        if (!wikiPlan) {
          await planStorage.addNoticePlan();
        }

        this.update('last_version', LATEST_VERSION);
      }

      return Promise.resolve({ user: this.user });
    } else {
      const defaultData: IUseInfo = {
        _id: 'kelp_and_broccoli',
        day: 1,
        open_id: 'open_id',
        create_time: Date.now(),
        update_time: Date.now(),
        update_time_day: Date.now(),
        last_version: LATEST_VERSION,
      };

      planStorage.initialPlan();
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

  public update = (key: string, value: any) => {
    if (this.user) {
      this.user[key] = value;
      setStorageSync('userinfo', this.user);
    }
  };
}

export const userStorage = new UserStorage();
