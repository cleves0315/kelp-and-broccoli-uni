const cloud = require("wx-server-sdk");

// 初始化 cloud
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  timeout: 10000,
});

const userInit = {
  day: 1, // 天数 Number
  open_id: "", // openid String
  create_time: 0, // 生成时间 Number
  update_time: 0, // 更新时间 Number
};

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();

  try {
    const { data } = await queryUserInfo(db, {
      open_id: wxContext.OPENID,
    });

    if (data.length > 0) {
      return {
        code: 1,
        message: "ok",
        data: data[0]._id,
      };
    }

    // 数据库不存在该用户
    // 生成用户信息模板
    await addUsers(db, {
      ...userInit,
      open_id: wxContext.OPENID,
      create_time: Date.now(),
      update_time: Date.now(),
    });
    const { data: users } = await queryUserInfo(db, {
      open_id: wxContext.OPENID,
    });

    return {
      code: 1,
      message: "登录成功",
      data: users[0]._id,
    };
  } catch (error) {
    return {
      code: 0,
      message: "登陆失败",
      data: null,
    };
  }
};

const queryUserInfo = (db, params) => {
  return db.collection("user_info").where(params).get();
};

const addUsers = (db, users) => {
  return db.collection("user_info").add({
    data: users,
  });
};
