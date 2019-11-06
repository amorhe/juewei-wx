/**
 * @Description: 导出ajax接口
 * @author bev
 * @date 2019/9/4
 * @time 16:45
 */

import { baseUrl, wxGet, wxSet, } from './baseUrl'
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
  for (let i in data) {
    if (!data[i] && data[i] !== 0) {
      console.log(data[i]);
      delete data[i]
    }
  }
  if (loading) {
    wx.showLoading({
      title: '加载中...',
    });
  }
  data._sid = wxGet('_sid');
  return new Promise((resolve, reject) => {
    let task = wx.request({
      url: baseUrl + url,
      data,
      method,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log(res.data);
        wx.hideLoading();
        const code = res.data.CODE || res.data.code;
        if ([100, 'A100', 0, 3212, 3218].includes(code)) {
          resolve(res.data)
        } else if ([30106, 'A103', 101].includes(code)) {
          console.log('用户未登录');
          wxSet('userInfo', {});
          resolve({
            code: -1,
            data: ''
          })
        } else {
          resolve(res.data)
        }
      },
      fail: (err) => {
        wx.hideLoading();
        reject(wx.showToast({
          title: '网络请求错误！',
          icon: "none",
          success() {
            wx.redirectTo({
              url: '/pages/noNet/noNet', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
            });
          }
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
  method,
  loading
}]) => {
  Request[name] = params => ajax({
    url,
    method,
    loading,
    data: {
      ...defaultData,
      ...params
    },
  })
});

export default Request;