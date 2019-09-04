// import parse from 'mini-html-parser2';
// var wxParse = require('../../../utils/wxParse/wxParse.js');

import Request from "./li-ajax";
export const log = console.log;

/**
 * @function 获取 sid
 */
export const event_getSid = () => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: '_sid', // 缓存数据的key
      success: async (res) => {
        resolve(res.data)
      },
      fail: err => {
        reject('')
      }
    });
  })
};

/**
 * @function 获取富文本数组
 * @param {string} html字符串
 */
// export const parseData = async (html) => {
//   return new Promise(resolve => {
//     parse(html, (err, nodes) => {
//       if (!err) {
//         resolve(nodes)
//       }
//     })
//   })
// }

/**
 * @function 获取地址列表
 */
export const getRegion = async () => {
  return new Promise((resolve, reject) => {
    wx.request({
      dataType: 'text',
      url: 'https://imgcdnjwd.juewei.com/prod/vipstatic/region_min.js',
      success: (res) => {
        resolve(JSON.parse(res.data.split('=')[1].slice(0, -1)))
      },
      fail: res => {
        wx.alert({
          title: res
        });
      }
    });
  })
};

/**
 * @function 剪切板
 */
export const handleCopy = e => {
  const {
    text
  } = e.currentTarget.dataset;
  log(text);
  wx.setClipboard({
    text,
    success() {
      wx.showToast({
        type: 'success',
        content: '操作成功'
      });
    }
  });
};

/**
 * @function 百度jdk
 * @param _lat 经纬度中超过能100的那个 => 经度
 * @param _lng 经纬度中 没有 超过 100的那个 => 纬度
 */

export const getDistance = async (_lng, _lat) => {
  let lat = wx.getStorageSync({
    key: 'lat'
  }).data;
  let lng = wx.getStorageSync({
    key: 'lng'
  }).data;
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://api.map.baidu.com/directionlite/v1/driving?origin=${ lng },${ lat }&destination=${ _lng },${ _lat }&ak=${ ak }`,
      success: (res) => {
        resolve(res)
      },
    });
  })
};

/**
 * @function 导航
 */

export const guide = e => {
  const {
    shop_longitude,
    shop_latitude,
    shop_name,
    address
  } = e.currentTarget.dataset;
  wx.openLocation({
    longitude: shop_longitude,
    latitude: shop_latitude,
    name: shop_name,
    address,
  });
};

/**
 * @function 联系客服
 */

export const contact = () => {
  wx.makePhoneCall({
    number: '4009995917'
  });
};

/**
 * @function 获取导航高度
 */

export const event_getNavHeight = () => {
  let {
    titleBarHeight,
    statusBarHeight,
    model
  } = wx.getSystemInfoSync();

  return {
    titleBarHeight: titleBarHeight || 40,
    statusBarHeight
  }
};

/**
 * @function 跳转登录页面
 */
export const isloginFn = () => {
  wx.navigateTo({
    url: '/pages/login/auth/auth'
  });
};

/**
 * @function 跳转
 */

export const liTo = e => {
  const {
    url
  } = e.currentTarget.dataset;
  wx.navigateTo({
    url
  })
};

/**
 * @function 获取用户积分
 */
export const event_getUserPoint = async () => {
  let res = await Request.reqUserPoint();
  if (res.CODE === 'A100') {
    this.setData({
      userPoint: res.DATA
    })
  }
};

