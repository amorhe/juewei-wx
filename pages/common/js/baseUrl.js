// 测试环境
export const baseUrl = 'https://test-wap.juewei.com/api';
export const baseUrl1 = 'https://test-saas.juewei.com';
// 图片测试cdn
export const imageUrl = 'https://test-cdn-wap.juewei.com/m/wx-mini/image/';
export const imageUrl2 = 'https://imgcdnjwd.juewei.com';
export const imageUrl3 = 'https://images.juewei.com';
//jsonUrl
export const jsonUrl='https://imgcdnjwd.juewei.com/static/check';
export const serviceUrl = 'https://test-wap.juewei.com';
//百度测试ak
export const ak = 'pRtqXqnajTytAzWDL3HOnPRK';
export const geotable_id='134917';
export const ak_wx = 'Xp8lScY0eQ50WN9dSyCmC3x058fU98O7';




// //预发布环境
// export const baseUrl = 'https://proving-wap.juewei.com/api';
// export const baseUrl1 = 'https://saas.juewei.com';
// // 图片测试cdn
// export const imageUrl = 'https://cdn-wap.juewei.com/m/wx-mini/image/';
// export const imageUrl2 = 'https://imgcdnjwd.juewei.com';
// export const imageUrl3 = 'https://images.juewei.com';
// //jsonUrl
// export const jsonUrl = 'https://imgcdnjwd.juewei.com/static/product';
// export const serviceUrl = 'https://wap.juewei.com';
// //百度测试ak
// export const ak = 'pRtqXqnajTytAzWDL3HOnPRK';
// export const geotable_id = '134917';
// export const ak_wx = 'Xp8lScY0eQ50WN9dSyCmC3x058fU98O7';



// 生产环境
// export const baseUrl = 'https://wap.juewei.com/api';
// export const baseUrl1 = 'https://saas.juewei.com';
// // 图片测试cdn
// export const imageUrl = 'https://cdn-wap.juewei.com/m/wx-mini/image/';
// export const imageUrl2 = 'https://imgcdnjwd.juewei.com';
// export const imageUrl3 = 'https://images.juewei.com';
// //jsonUrl
// export const jsonUrl='https://imgcdnjwd.juewei.com/static/product';
// export const serviceUrl = 'https://wap.juewei.com';
// // 百度生产ak
// export const ak = 'pRtqXqnajTytAzWDL3HOnPRK';
// export const geotable_id='134917';
// export const ak_wx = 'Xp8lScY0eQ50WN9dSyCmC3x058fU98O7';




// 判断是否测试环境
const isTestUrl = baseUrl.includes('test');
// 套餐图片路径
export const img_url = isTestUrl ? imageUrl2 : imageUrl3;

// 异步获取缓存
export const wxGet = (key) => {
  try {
    var value = wx.getStorageSync(key)
    if (value) {
      // Do something with return value
      return value
    }
  } catch (e) {
    // Do something when catch error
  }
}

// 异步存储数据
export const wxSet = (key, data) => {
  try {
    wx.setStorageSync(key, data)
  } catch (e) { }
}