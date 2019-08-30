import {ajax} from './ajax'

const myObject = {
  membercard: '/juewei-api/alimini/getQRcode',    // 二维码
  UpdateAliUserInfo:'/juewei-api/alimini/UpdateAliUserInfo',// 同步阿里信息
  UpdateUserInfo:'/juewei-api/alimini/UpdateUserInfo', // 更新用户信息
  checkPhoneCode:'/juewei-api/user/checkPhoneCode', // 绑定新手机验证短信验证码
  resetPhone:'/juewei-api/user/resetPhone', // 更换手机号
  addressList:'/juewei-api/useraddress/list', // 地址列表
}

export const membercard = (_sid) => ajax(myObject.membercard,{_sid},"GET");

export const UpdateAliUserInfo = (data) => ajax(myObject.UpdateAliUserInfo,data);

export const UpdateUserInfo = (data) => ajax(myObject.UpdateUserInfo,data);

export const checkPhoneCode = (_sid,phone,code) => ajax(myObject.checkPhoneCode,{_sid,phone,code});

export const resetPhone = (_sid,new_phone,new_code) => ajax(myObject.resetPhone ,{_sid,new_phone,new_code});

export const addressList = (data) => ajax(myObject.addressList ,data);
