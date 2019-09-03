import {
  baseUrl,
  ak,
  wxSet,
  wxGet
} from './baseUrl'

import VIP from './vip.js'

const my = wx;

// import parse from 'mini-html-parser2';
// var wxParse = require('../../../wxParse/wxParse.js')

export const log = console.log;

/**
 * @function 获取 sid
 */
export const event_getSid = () => {
  return new Promise((resolve, reject) => {
    my.getStorage({
      key: '_sid', // 缓存数据的key
      success: async(res) => {
        resolve(res.data)
      },
      fail: err => {
        reject('')
      }
    });
  })
};

/**
 * @function ajax 请求
 * @param url 地址 string
 * @param data 数据
 * @param method 请求方式
 * @param loading
 * @return Promise<any>
 */
export const ajax = async({
  url,
  data = {},
  method = 'POST',
  loading = true
}) => {
  if (loading) {

    wx.showLoading({
      title: '加载中...',
    });
  }

  let _sid = await event_getSid();
  data._sid = _sid;
  return new Promise((resolve, reject) => {
    let task = wx.request({
      url: baseUrl + url,
      data,
      method,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        // log(res.data)
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
          // reject({ errormsg: rest.msg, code: -1 });
        }

      },
      fail: (err) => {
        wx.hideLoading();
        reject(wx.showToast({
          title: '服务器错误'
        }))
      }
    });
  })
};

const RequestConfig = {
  ...VIP
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
})

export default Request;

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
 * @function 重定向
 */

export const redirect = (url) => {
  my.redirectTo({
    url,
  });
}


/**
 * @function 获取地址列表
 */
export const getRegion = async() => {
  return new Promise((resolve, reject) => {
    my.request({
      dataType: 'text',
      url: 'https://imgcdnjwd.juewei.com/prod/vipstatic/region_min.js',
      success: (res) => {
        resolve(JSON.parse(res.data.split('=')[1].slice(0, -1)))
      },
      fail: res => {
        my.alert({
          title: res
        });
      }
    });
  })
}

/**
 * @function 剪切板
 */
export const handleCopy = (e) => {
  const {
    text
  } = e.currentTarget.dataset
  log(text)
  my.setClipboard({
    text,
    success() {
      my.showToast({
        type: 'success',
        content: '操作成功'
      });
    }
  });
}

/**
 * @function 百度jdk
 * @param _lat 经纬度中超过能100的那个 => 经度
 * @param _lng 经纬度中 没有 超过 100的那个 => 纬度
 */

export const getDistance = async(_lng, _lat) => {
  let lat = my.getStorageSync({
    key: 'lat'
  }).data;
  let lng = my.getStorageSync({
    key: 'lng'
  }).data;
  return new Promise((resolve, reject) => {
    my.request({
      url: `https://api.map.baidu.com/directionlite/v1/driving?origin=${lng},${lat}&destination=${_lng},${_lat}&ak=${ak}`,
      success: (res) => {
        resolve(res)
      },
    });
  })
}

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
  my.openLocation({
    longitude: shop_longitude,
    latitude: shop_latitude,
    name: shop_name,
    address,
  });
}

/**
 * @function 联系客服
 */

export const contact = () => {
  my.makePhoneCall({
    number: '4009995917'
  });
}

/**
 * @function 获取导航高度
 */

export const event_getNavHeight = () => {
  let {
    titleBarHeight,
    statusBarHeight,
    model
  } = my.getSystemInfoSync();

  return {
    titleBarHeight: titleBarHeight || 44,
    statusBarHeight
  }
};

/**
 * 获取 地址ID
 */

export const getAddressId = () => {
  return new Promise((resolve, reject) => {
    my.getLocation({
      type: 2,
      success(res) {
        console.log('address', res)
        const {
          cityAdcode,
          districtAdcode,
          longitude,
          latitude
        } = res
        resolve({
          city_id: cityAdcode,
          district_id: districtAdcode,
          longitude,
          latitude
        })
      },
      fail() {
        my.hideLoading();
        reject(my.alert({
          title: '定位失败'
        }))
      },
    })
  })
}

/**
 * @function 跳转登录页面
 */
export const isloginFn = () => {
  my.navigateTo({
    url: '/pages/login/auth/auth'
  });

}

/**
 * @function 跳转
 */

export const liTo = e => {
  const {
    url
  } = e.currentTarget.dataset;
  my.navigateTo({
    url
  })
}

/**
 * @function 获取用户积分
 */
export const event_getUserPoint = async() => {
  let res = await Request.reqUserPoint()
  if (res.CODE === 'A100') {
    this.setData({
      userPoint: res.DATA
    })
  }
}