export type IUseInfo = {
  _id: string;
  day: number;
  open_id: string;
  create_time: number;
  update_time: number;
  update_time_day: number;
};

export interface GetUserInfoRes {
  user: IUseInfo;
}

export interface GetUserDayRes extends Pick<IUseInfo, 'day' | 'update_time_day'> {}
