'use strict';

const { log } = require("console");

const userInit = {
  day: 1, // 天数 Number
  open_id: "", // openid String
  create_time: 0, // 生成时间 Number
  update_time: 0, // 更新时间 Number
};

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database();

	try {
		const { data: configRes } = await db.collection("config").where({
			server: 'wx'
		}).get();
		
		const { appid, secret } = configRes[0]  
		const loginUrl = 'https://api.weixin.qq.com/sns/jscode2session'
		
		const res = await uniCloud.httpclient.request(loginUrl, {
		  data: {  
		    appid: appid,
		    secret: secret,
		    js_code: event.code,
		    grant_type: 'authorization_code'
		  },
		  dataType: 'json'
		})
		
		const openid = res.data.openid  //用户openid
		const { data } = await queryUserInfo(db, openid);

		if (data.length > 0) {
			return {
				code: 1,
				message: "ok",
				data: data[0]._id,
			};
		}

		// 数据库不存在该用户
		// 生成用户信息模板
		await addUsers(db, openid);
		const { data: users } = await queryUserInfo(db, openid);
		
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
	
	//返回数据给客户端
	return event
};

const queryUserInfo = (db, openid) => {
  return db.collection("user-info").where({
		open_id: openid,
	}).get();
};

const addUsers = (db, openid) => {
  return db.collection("user-info").add({
    data: {
			...userInit,
			open_id: openid,
			create_time: Date.now(),
			update_time: Date.now(),
		},
  });
};
