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
    case "finish_plan_list":
      return await finish_plan_list(event, db);
    case "today_back":
      return await today_back(event, db);
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
 * 数据结构更新
 */
const resetPlan = async (db) => {
  const { data } = await db.collection("plan_list").where({}).get();
  const { data: userList } = await db.collection("user_info").where({}).get();
  const userIdMap = {}; // open_id 映射 _id

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

    if (!plan.plan_no || !plan.user_id) {
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
    const { data } = await db
      .collection("plan_list")
      .where({
        user_id: user_id || "",
      })
      .get();

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
 * 完成计划
 * @return updated_list: 更新成功的数据
 * @return create_list: 更新成功后重复新生成的数据
 */
async function finish_plan_list(event, db) {
  const planList = event.plan_list;

  if (!planList) {
    return {
      code: 0,
      data: null,
      message: "更新失败",
    };
  }

  try {
    const updatedList = []; // 更新成功的数据
    const createList = []; // 完成计划后，新生成的数据

    return new Promise((resolve) => {
      planList.forEach((item, index) => {
        item["update_time"] = new Date().getTime();

        db.collection("plan_list")
          .doc(item["_id"])
          .get()
          .then((res) => {
            const plan = res.data;

            if (
              item.is_finish &&
              plan.repeat &&
              plan.repeat["finished"] === 0
            ) {
              const newPlan = JSON.parse(JSON.stringify(item));

              const obj = {
                day: (options) => {
                  const base = options.repeat.base;
                  const closingDate = options.closing_date;

                  newPlan.closing_date = closingDate + 86400000 * base;
                  newPlan.repeat.week_value[0] = new Date(
                    newPlan.closing_date
                  ).getDay();
                  newPlan.repeat.finished = 0;
                },
                week: (options) => {
                  const base = options.repeat.base;
                  const closingDate = options.closing_date;
                  const weekValue = options.repeat.week_value;

                  let closing = 0;
                  let week = new Date(closingDate).getDay();
                  let clsYear = new Date(closingDate).getFullYear();
                  let clsMonth = new Date(closingDate).getMonth() + 1;
                  let clsDay = new Date(closingDate).getDate();

                  if (weekValue.length > 1) {
                    let diffDay = 0;
                    if (week !== 0) {
                      weekValue.some((d, i, arr) => {
                        if (week === d) {
                          if (i !== arr.length - 1) {
                            diffDay = arr[i + 1] - d;
                          } else {
                            diffDay = 7 - d + (arr[0] - 0);
                          }
                          return true;
                        }
                      });
                    } else {
                      diffDay = 7 - weekValue[1];
                    }

                    clsDay += diffDay;
                  } else {
                    clsDay += base * 7;
                  }

                  closing = new Date(
                    `${clsYear}-${clsMonth}-${clsDay}`
                  ).getTime();

                  newPlan.closing_date = closing;
                  newPlan.repeat.finished = 0;
                },
                month: (options) => {
                  let closing = 0;

                  const base = options.repeat.base;
                  const closingDate = options.closing_date;

                  let clsYear = new Date(closingDate).getFullYear();
                  let clsMonth = new Date(closingDate).getMonth() + 1 + base;
                  let clsDay = new Date(closingDate).getDate();
                  let clsWeek = 0;

                  if (clsMonth > 12) {
                    clsYear += parseInt(clsMonth / 12);
                    clsMonth = clsMonth % 12;
                  }

                  closing = new Date(
                    `${clsYear}-${clsMonth}-${clsDay}`
                  ).getTime();

                  while (new Date(closing).getMonth() + 1 !== clsMonth) {
                    closing = new Date(closing - 86400000).getTime();
                  }

                  clsWeek = new Date(closing).getDay();

                  newPlan.closing_date = closing;
                  newPlan.repeat.week_value[0] = clsWeek;
                  newPlan.repeat.finished = 0;
                },
                year: (options) => {
                  let closing = 0;

                  const base = options.repeat.base;
                  const closingDate = options.closing_date;

                  const clsYear = new Date(closingDate).getFullYear() + base;
                  const clsMonth = new Date(closingDate).getMonth() + 1;
                  const clsDay = new Date(closingDate).getDate();
                  let clsWeek = 0;

                  closing = new Date(
                    `${clsYear}-${clsMonth}-${clsDay}`
                  ).getTime();

                  while (new Date(closing).getMonth() + 1 !== clsMonth) {
                    closing = new Date(closing - 86400000).getTime();
                  }

                  clsWeek = new Date(closing).getDay();

                  newPlan.closing_date = closing;
                  newPlan.repeat.week_value[0] = clsWeek;
                  newPlan.repeat.finished = 0;
                },
              };

              obj[item.repeat.type](item);
              delete newPlan["tobeFinish"];
              delete newPlan["notUpdated"];
              createList.push(init_plan_list(newPlan));

              item.repeat["finished"] = 1;
            }

            delete item["tobeFinish"];
            delete item["notUpdated"];
            const data = JSON.parse(JSON.stringify(item));
            delete data["_id"];

            db.collection("plan_list")
              .doc(item["_id"])
              .update({ data })
              .then((res) => {
                if (res.stats.updated === 1) {
                  updatedList.push(item);
                }
                if (index === planList.length - 1) resolve();
              });
          })
          .catch((err) => {
            if (index === planList.length - 1) resolve();
          });
      });
    }).then(() => {
      if (createList.length > 0) {
        return db
          .collection("plan_list")
          .add({ data: createList })
          .then((res) => {
            res._ids.forEach((item, index) => {
              createList[index]["_id"] = item;
            });

            return {
              code: 1,
              message: "更新成功",
              data: {
                updated_list: updatedList,
                create_list: createList,
              },
            };
          });
      } else {
        return {
          code: 1,
          message: "更新成功",
          data: {
            updated_list: updatedList,
            create_list: [],
          },
        };
      }
    });
  } catch (err) {
    return {
      code: 0,
      data: null,
      message: "操作失败",
    };
  }
}

/**
 * 获取"我的一天"计划列表背景图
 */
const today_back = async (event, db) => {
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
