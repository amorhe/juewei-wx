/**
 * @Description: 导出ajax接口
 * @author bev
 * @date 2019/9/4
 * @time 16:45
 */

import { baseUrl, wxSet, } from './baseUrl'
import { event_getSid } from "./utils";
import VIP from './vip'
import ORDER from './order'

/**
 * @function ajax 请求
 * @param {String} url 地址
 * @param {Object} data 数据
 * @param {String} method 请求方式
 * @param {Boolean} loading
 * @return Promise<any>
 */
export const ajax = async ({ url, data = {}, method = 'POST', loading = true }) => {
  if (loading) {
    wx.showLoading({
      title: '加载中...',
    });
  }
  data._sid = await event_getSid();
  return new Promise((resolve, reject) => {
    let task = wx.request({
      url: baseUrl + url,
      data,
      method,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log(res.data);
        wx.hideLoading();
        const code = res.data.CODE || res.data.code;
        if ([100, 'A100', 0, 3212, 3218].includes(code)) {
          resolve(res.data)
        } else if ([30106, 'A103', 101].includes(code)) {
          wxSet('_sid', '');
          resolve({
            code: -1,
            data: ''
          })
        } else {
          resolve(res.data)
        }

      },
      fail: (err) => {
        console.log(err);
        wx.hideLoading();
        reject(wx.showToast({
          title: '服务器错误'
        }))
      }
    });
  })
};

const RequestConfig = {
  ...VIP,
  ...ORDER
};


const Request = {};
Object.entries(RequestConfig).forEach(([name, {
  defaultData,
  url,
  methods,
  loading
}]) => {
  Request[name] = params => ajax({
    url,
    methods,
    loading,
    data: {
      ...defaultData,
      ...params
    },
  })
});

export default Request;