import {ajax} from './ajax';

var addressUrl={
  addressCreate:'/juewei-api/useraddress/create', // 创建地址
  addressinfo:'/juewei-api/useraddress/info', // 地址详情
  updateaddress:'/juewei-api/useraddress/update', // 地址修改
  delete:'/juewei-api/useraddress/delete', // 删除地址
}

export const addressCreate = (data) => ajax(addressUrl.addressCreate,data);

export const addressinfo = (data) => ajax(addressUrl.addressinfo,data);

export const updateaddress = (data) => ajax(addressUrl.updateaddress,data);

export const deleteaddress = (data) => ajax(addressUrl.delete,data);