import { ajax } from './ajax';
import { wxGet, wxSet } from "./baseUrl";

const loginPage = {
  loginByAuth: '/juewei-api/wxmini/LoginByAuth',  //用户自动登录
  loginByPhone: '/juewei-api/wxmini/Login', // 手机号登录
  decryptPhone: '/juewei-api/wxmini/decryptPhone', // 解密手机
  sendCode: '/juewei-api/wxmini/sendCode', // 获取短信验证码


  loginByAliUid: '/juewei-api/alimini/loginByAliUid',  //用户自动登录
  getuserInfo: '/juewei-api/alimini/getUserInfo',   //获取用户信息
  captcha: '/juewei-api/user/captcha', // 获取图片验证码
  LoginOut: '/juewei-api/alimini/LoginOut', // 退出登录
};
export const loginByAuth = data => ajax(loginPage.loginByAuth, data );

export const loginByPhone = data => ajax(loginPage.loginByPhone, data);


export const login = rest => wx.login({
  success: async res => {
    const userInfo = JSON.stringify(wxGet('userInfo'));
    console.log(userInfo);
    const { code } = res;
    console.log('发送 res.code 到后台换取 openId, sessionKey, unionId');
    let r = await loginByAuth({ code, userInfo, ...rest });
    if (r.code === 0) {
      console.log('将_sid存到内存中',r.data._sid);
      wxSet('_sid', r.data._sid)
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
      console.log('//session_key 未过期，并且在本生命周期一直有效');
      const _sid = wxGet('_sid');
      if (!_sid) {
        console.log('//session_key 未过期，并且在本生命周期一直有效,但是_sid没了');
        login(rest)
      }
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
