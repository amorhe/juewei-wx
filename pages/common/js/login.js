import { ajax } from './ajax';
import { wxGet, wxSet } from "./baseUrl";

const loginPage = {
  loginByAuth: '/juewei-api/wxmini/LoginByAuth',  //用户自动登录
  quickLogin: '/juewei-api/wxmini/QuickLogin', // 微信小程序用户手机号登录
  loginByPhone: '/juewei-api/wxmini/Login', // 手机号登录
  decryptPhone: '/juewei-api/wxmini/decryptPhone', // 解密手机
  sendCode: '/juewei-api/wxmini/sendCode', // 获取短信验证码
  LoginOut: '/juewei-api/wxmini/LoginOut', // 退出登录
  getuserInfo: '/juewei-api/wxmini/getUserInfo',   //获取用户信息


  loginByAliUid: '/juewei-api/alimini/loginByAliUid',  //用户自动登录
  captcha: '/juewei-api/user/captcha', // 获取图片验证码
};
export const loginByAuth = data => ajax(loginPage.loginByAuth, data);
export const loginByQuick = data => ajax(loginPage.quickLogin, data);
export const loginByPhone = data => ajax(loginPage.loginByPhone, data);


export const login = rest => wx.login({
  success: async res => {
    if (!rest) { rest = { userInfo:{} } }
    let { userInfo, ...rests} = rest;
    const userInfos = JSON.stringify(userInfo);
    const { code } = res;
    console.log('发送 res.code 到后台换取 openId, sessionKey, unionId');
    let r = await loginByAuth({ code, userInfo:userInfos, ...rests});
    if (r.code === 0) {
      wxSet('_sid', r.data._sid);
      try {
        // 清除userinfo
        wx.removeStorageSync('user_id')
        wx.removeStorageSync('userInfo')
      } catch (e) {}
      if (r.data && r.data.user_id && r.data.user_id!='') {//登录成功
        wxSet('userInfo', { ...rest, ...r.data });
        wxSet('user_id', r.data.user_id);
      }else{//登录失败
       //登录失败的用户是没有userInfo和_sid
       //删除到userInfo 没有userid
        console.log('LoginByAuth自动登录失败，没有用户详细信息');
      }
    }
  }
});
/**
 * @function 微信登录
 * @constructor
 */
export const WX_LOGIN = rest => {
  wx.checkSession({
    success() {
      console.log('//session_key 未过期，并且在本生命周期一直有效,但是本地没有用户数据');
      //每次进小程序都要调用登录接口
      login(rest)
      //从以前存储拿的user_id，和_sid
      // const { user_id, _sid } = wxGet('userInfo') || { user_id: '' };
      // wxSet('_sid',_sid);
      // if (!user_id) {
      //   login(rest)
      // }
    },
    fail() {
      console.log('session_key 已经失效，需要重新执行登录流程');
      // 登录
      login(rest)
    }
  })
};


// old
export const getuserInfo = (_sid) => ajax(loginPage.getuserInfo, { _sid });

export const loginByAliUid = (auth_code, nick_name, head_img, _sid) => ajax(loginPage.loginByAliUid, {
  auth_code,
  nick_name,
  head_img,
  _sid
});

export const sendCode = (data) => ajax(loginPage.sendCode, data);


export const LoginOut = (_sid) => ajax(loginPage.LoginOut, { _sid });

export const decryptPhone = (data) => ajax(loginPage.decryptPhone, data);
