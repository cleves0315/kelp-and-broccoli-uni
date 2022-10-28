// 云函数入口文件
const cloud = require("wx-server-sdk");
const { v4: uuidv4 } = require("uuid");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  timeout: 10000,
});

/**
 * 初始化plan_list
 * @param {Object} options
 */
function init_plan_list(options) {
  const data = {
    // open_id: options.open_id,
    title: options.title.trim(),
    detail: options.detail || "",
    is_finish: false,
    user_id: options.user_id,
    create_time_applets: options.create_time_applets || 0,
    create_time: new Date().getTime(),
    update_time: new Date().getTime(),
    organize: options.organize || "normal",
    closing_date: options.closing_date || 0,
    step_list: options.step_list || [],
    repeat: options.repeat || {},
    finish_date: 0,
  };

  return data;
}

// 云函数入口函数
exports.main = async (event) => {
  const db = cloud.database();

  switch (event.action) {
    case "resetPlan":
      return resetPlan(db);
    case "get":
      return await getPlanList(event, db);
    case "add":
      return await addPlan(event, db);
    case "update":
      return await updatePlan(event, db);
    case "del":
      return await delPlan(event, db);
    case "today_bg_img":
      return await today_bg_img(event, db);
  }
};

/**
 * 校验数据格式是否包含如下字段
 * ```
 * plan_no
 * user_id
 * title
 * create_time
 * ```
 */
const isValidPlan = (plan) => {
  if (
    !plan ||
    !plan.plan_no ||
    !plan.user_id ||
    !plan.title ||
    !plan.create_time
  ) {
    return false;
  }
  return true;
};

/**
 * 查询结合所有数据
 */
const getAllData = async (db, name, where = {}) => {
  if (!name || typeof name !== 'string') {
    return {
      data: [],
      errMsg: '获取失败',
    }
  }
  
  const MAX_LIMIT = 100
  // 先取出集合记录总数
  const countResult = await db.collection(name).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection(name).where(where).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }

  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}

/**
 * 数据结构更新
 */
const resetPlan = async (db) => {
  const { data } = await getAllData(db, 'plan_list')
  const { data: userList } = await getAllData(db, 'user_info')
  const userIdMap = {}; // open_id 映射 _id

  console.log('查询所有计划：', data)
  console.log('查询所有用户：', userList)

  userList.forEach((user) => {
    userIdMap[user.open_id] = user._id;
  });

  // 给所有计划插入 plan_no、user_id 字段
  data.forEach((plan, index) => {
    const obj = {};

    if (!plan.plan_no) {
      obj.plan_no = uuidv4();
    }

    if (!plan.user_id) {
      obj.user_id = userIdMap[plan.open_id];
    }

    if (!plan.type) {
      obj.type = plan.organize === 'today' ? 'today' : 'all'
    }

    if (!plan.plan_no || !plan.user_id || !plan.type) {
      db.collection("plan_list")
        .doc(plan._id)
        .update({
          data: { ...obj },
        });
    }
  });
};

/**
 * 获取计划数据
 */
const getPlanList = async (event, db) => {
  const { user_id } = event.data;

  if (!user_id) {
    return {
      code: 0,
      message: "用户信息为空",
      data: null,
    };
  }

  try {
    const { data } = await getAllData(db, 'plan_list', {
      user_id
    })

    return {
      code: 1,
      data: data,
      message: "获取计划列表成功",
    };
  } catch (error) {
    return {
      code: 0,
      data: null,
      message: "获取计划列表失败",
    };
  }
};

/**
 * 添加计划
 */
const addPlan = async (event, db) => {
  let { plan } = event.data;

  if (!isValidPlan(plan)) {
    return {
      code: 0,
      data: null,
      message: "计划添加失败，参数格式错误",
    };
  }

  try {
    await db.collection("plan_list").add({
      data: plan,
    });

    return {
      code: 1,
      data: null,
      message: "计划添加成功",
    };
  } catch (error) {
    return {
      code: 0,
      data: null,
      message: "计划添加失败",
    };
  }
};

/**
 * 修改计划
 */
const updatePlan = async (event, db) => {
  const { plan } = event.data;
  const plan_no = plan.plan_no;

  if (!isValidPlan(plan)) {
    return {
      code: 0,
      data: null,
      message: "计划更新失败，参数格式错误",
    };
  }

  delete plan._id;
  delete plan.plan_no;
  delete plan.user_id;
  delete plan.create_time;

  try {
    const { stats } = await db
      .collection("plan_list")
      .where({
        plan_no,
      })
      .update({
        data: plan,
      });

    // if (stats.updated === 0) {
    //   return {
    //     code: 0,
    //     data: null,
    //     message: "计划更新失败0",
    //   };
    // }

    return {
      code: 1,
      data: null,
      message: "计划更新成功",
    };
  } catch (error) {
    return {
      code: 0,
      data: null,
      message: "计划更新失败",
    };
  }
};

/**
 * 删除计划
 */
const delPlan = async (event, db) => {
  const { plan_no } = event.data;

  if (!plan_no) {
    return {
      code: 0,
      data: null,
      message: "删除失败，参数格式错误",
    };
  }

  try {
    await db.collection("plan_list").where({ plan_no }).remove();

    return {
      code: 1,
      data: null,
      message: "删除计划成功",
    };
  } catch (e) {
    return {
      code: 0,
      data: null,
      message: "删除计划失败",
    };
  }
};

/**
 * 获取"我的一天"计划列表背景图
 */
const today_bg_img = async (event, db) => {
  try {
    // { logo, remark, url, describe }
    const { data } = await db
      .collection("resources")
      .where({ remark: "todayBackground" })
      .get();

    return {
      code: 1,
      message: "获取背景成功",
      data: data[0].url,
    };
  } catch (error) {
    return {
      code: 0,
      data: null,
      message: "获取背景失败",
    };
  }
};
