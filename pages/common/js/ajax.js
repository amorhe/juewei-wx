import {
  baseUrl,
  wxGet,
  baseUrl1
} from './baseUrl';
export const ajax = (url, data = {}, method = "POST", others) => {
  let header;
  if (method == "POST") {
    header = {
      'content-type': 'application/x-www-form-urlencoded'
    };
  } else {
    header = {
      'content-type': 'application/json'
    };
  }
  // data._sid = wxGet('_sid');
  let promise = new Promise(function(resolve, reject) {
    wx.request({
      url: others ? baseUrl1 + url : baseUrl + url,
      header,
      data,
      method,
      success: (res) => {
        wx.hideLoading();
        let rest = {
          code: (res.code || res.CODE || ""),
          data: (res.data || res.DATA),
          msg: (res.msg || res.MESSAGE)
        }
        if (rest.code == 0 || rest.code == "A100" || rest.code == 100) {
          resolve(rest.data);
        } else if (rest.code == 30106 || rest.code == "A103" || rest.code == 101) {
          //nologin
          //删除以前的id
          wx.removeStorageSync('_sid'); //可以
          wx.removeStorageSync('user_id');
          wx.navigateTo({
            url: '/pages/login/auth/auth' //这里初始化会获取一个_sid
          });
        } else {
          //提示接口的信息，并且跳错误页
          reject(wx.showToast({
            icon: "none",
            title: rest.msg,
            success() {
              wx.redirectTo({
                url: '/pages/noNet/noNet', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
              });
            }
          }))
        }
      },
      fail: (err) => {
        wx.hideLoading();
        reject(wx.showToast({
          title: '网络请求错误',
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
  return promise;
}