// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  timeout: 10000,
});

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();

  switch (event.action) {
    case "get":
      return getUserInfo(event, db);
    case "day": // 获取天数
      return getUserDays(event, db);

    default:
      break;
  }
};

const queryUserInfo = (db, user_id) => {
  return db
    .collection("user_info")
    .where({
      _id: user_id || "",
    })
    .get();
};

const getUserInfo = async (event, db) => {
  const { user_id } = event.data;
  const { data } = await queryUserInfo(db, user_id);

  if (data.length > 0) {
    return {
      code: 1,
      data: data[0],
      message: "获取成功",
    };
  }

  return {
    code: 0,
    data: null,
    message: "获取用户信息失败",
  };
};

const getUserDays = async (event, db) => {
  const { user_id } = event.data;
  const { data } = await queryUserInfo(db, user_id);

  if (data.length > 0) {
    try {
      await updateNewOneDay(db, data[0]);
      const { data: users } = await queryUserInfo(db, user_id);

      return {
        code: 1,
        data: users[0].day,
        message: "获取天数成功",
      };
    } catch (error) {
      return {
        code: 0,
        data: null,
        message: "获取天数失败",
      };
    }
  }

  return {
    code: 0,
    data: null,
    message: "获取天数失败",
  };
};

/**
 * 对比时间，更新天数
 */
const updateNewOneDay = (db, user) => {
  const _ = db.command;
  const today = new Date();
  const updateTime = new Date(user.update_time);

  // 如果在新的一天登录，天数加1
  if (
    today.getDate() !== updateTime.getDate() ||
    today.getMonth() !== updateTime.getMonth() ||
    today.getFullYear() !== updateTime.getFullYear()
  ) {
    return db
      .collection("user_info")
      .where({
        _id: user._id || "",
      })
      .update({
        data: {
          day: _.inc(1),
          update_time: today.getTime(),
        },
      });
  } else {
    return Promise.resolve();
  }
};
