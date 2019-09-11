import { ajax } from './ajax';
const loginPage = {
  loginByAuth: '/juewei-api/wxmini/LoginByAuth',  //用户自动登录
  loginByPhone: '/juewei-api/wxmini/Login', // 手机号登录
  decryptPhone: '/juewei-api/wxmini/decryptPhone', // 解密手机



  loginByAliUid: '/juewei-api/alimini/loginByAliUid',  //用户自动登录
  getuserInfo: '/juewei-api/alimini/getUserInfo',   //获取用户信息
  sendCode: '/juewei-api/alimini/sendCode', // 获取短信验证码
  captcha: '/juewei-api/user/captcha', // 获取图片验证码
  LoginOut: '/juewei-api/alimini/LoginOut', // 退出登录
};
export const loginByAuth = code => ajax(loginPage.loginByAuth, {code});

export const loginByPhone = data => ajax(loginPage.loginByPhone, data);



// old
export const getuserInfo = (_sid) => ajax(loginPage.getuserInfo, { _sid });

export const loginByAliUid = (auth_code, nick_name, head_img, _sid) => ajax(loginPage.loginByAliUid, { auth_code, nick_name, head_img, _sid });

export const sendCode = (data) => ajax(loginPage.sendCode, data);


export const LoginOut = (_sid) => ajax(loginPage.LoginOut, { _sid });

export const decryptPhone = (data) => ajax(loginPage.decryptPhone, data);