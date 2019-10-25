import { wxParse } from '../../../utils/wxParse/wxParse.js';

import Request from "./li-ajax";
import { wxGet } from "./baseUrl";
import { navigateTo, redirectTo } from "./router";

const {
  $Toast
} = require('../../../iview-weapp/base/index');
export const log = console.log;

/**
 * @function 获取富文本数组
 * @param bindName
 * @param html
 * @param target
 */
export const parseData = async ({ bindName, html, target }) => {
  return new Promise(resolve => {
    wxParse(bindName, 'html', html, target, 5);
  })
};

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
 * @function 判断用户 是否 登录
 * @returns {string}
 * @constructor
 */
export const FUN_IS_LOGIN = () => {
  const { user_id } = wxGet('userInfo') || { user_id: '' };
  return user_id
};


/**
 * @function 剪切板
 */
export const handleCopy = e => {
  const {
    text
  } = e.currentTarget.dataset;
  log(text);
  wx.setClipboardData({
    data: text,
    success() {
      // wx.showToast({
      //   mask: true,
      //   icon: 'success',
      //   title: '操作成功'
      // });
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
    longitude: shop_longitude - 0,
    latitude: shop_latitude - 0,
    name: shop_name,
    address,
  });
};

/**
 * @function 联系客服
 */

export const contact = e => {
  const { phone_number } = e.currentTarget.dataset;
  if (phone_number) {
    console.log(phone_number);
    wx.makePhoneCall({
      phoneNumber: phone_number  || '4009995917'
    });
  } else {
    console.log('没有电话号，去联系客服');
    navigateTo({url:'/package_my/pages/onlineservice/onlineservice'})
  }

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
export const event_getUserPoint = async (e) => {
  let res = await Request.reqUserPoint();
  if (res.CODE === 'A100') {
    e.setData({
      userPoint: res.DATA
    })
  }
};

/**
 * @function 展示 MODAL 弹窗
 * @param {String} title
 * @param {String} content
 * @param {Boolean} showCancel
 * @param {String} cancelText
 * @param {String} cancelColor
 * @param {String} confirmText
 * @param {String} confirmColor
 * @param {Function} confirm
 * @param {Function} cancel
 * @param {Function} fail
 * @param {Function} complete
 */
export const MODAL = ({
                        title,
                        content,
                        showCancel = true,
                        cancelText = '取消',
                        cancelColor = '#999',
                        confirmText = '确定',
                        confirmColor = '#E60012',
                        confirm = () => {
                          console.log('用户点击确定')
                        },
                        cancel = () => {
                          console.log('用户点击取消')
                        },
                        fail = () => {
                        },
                        complete = () => {
                        }
                      }) => wx.showModal({
  title,
  content,
  showCancel,
  cancelText,
  cancelColor,
  confirmText,
  confirmColor,
  success(res) {
    if (res.confirm) {
      confirm()
    } else if (res.cancel) {
      cancel()
    }
  },
  fail,
  complete
});

/**
 * @function 获取当前路由地址
 * @returns   () => void
 */
export const getCurUrl = () => {
  const pages = getCurrentPages(); //获取加载的页面
  const currentPage = pages[pages.length - 1]; //获取当前页面的对象
  return currentPage.route //当前页面url
};
