import {
  imageUrl,
  ak,
  ak_wx,
  geotable_id,
  wxGet,
  wxSet
} from '../common/js/baseUrl'
import {
  bd_encrypt
} from '../common/js/map'
import {
  GetLbsShop,
  NearbyShop
} from '../common/js/home'
import {
  cur_dateTime,
  compare,
  sortNum
} from '../common/js/time'
import {
  reLaunch,
  redirectTo
} from '../common/js/router.js'
import {
  WX_LOGIN
} from '../common/js/login.js'
var app = getApp();
// 引入百度地图微信小程序
var bmap = require('../../utils/libs/bmap-wx.js');
var BMap = new bmap.BMapWX({
  ak: ak_wx
});
const { $Toast } = require('../../iview-weapp/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: imageUrl,
    city: '定位中...',
    content: '',
    confirmButtonText: '',
    cancelButtonText: '',
    modalShow: false,
    mask: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('position_onload', options);
    if (options && options.go != '') {
      app.globalData.gopages = options.go;
    } else {
      app.globalData.gopages = '';
    }
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that.funGetposition()
            },
            fail() {
              // 定位失败
              wx.hideLoading();
              reLaunch({
                url: '/pages/noposition/noposition'
              })
            }
          })
        } else {
          that.funGetposition()
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  funGetposition() {
    wx.removeStorageSync('takeout');
    wx.removeStorageSync('self');
    wx.removeStorageSync('opencity');
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success(ott) {
        wx.hideLoading();
        let res = {};
        // 发起regeocoding检索请求
        BMap.regeocoding({
          success(data) {
            res = data.originalData.result;
            that.setData({
              city: res.addressComponent.city
            })
            app.globalData.province = res.addressComponent.province;
            app.globalData.city = res.addressComponent.city;
            app.globalData.address = res.pois[0].name;
            app.globalData.position = res;
            app.globalData.position.longitude = res.location.lng;
            app.globalData.position.latitude = res.location.lat;
            wxSet('lat', res.location.lat); // 纬度
            wxSet('lng', res.location.lng); // 经度
            wxSet('nearPois', res.pois); // 附近地址
            that.funGetLbsShop(res.location.lng, res.location.lat);
            that.funGetNearbyShop(res.location.lng, res.location.lat);
          }
        });
      },
      fail() {
        // 定位失败
        wx.hideLoading();
        reLaunch({
          url: '/pages/noposition/noposition'
        })
      },
    })
  },
  // 外卖附近门店
  funGetLbsShop(lng, lat) {
    const location = `${lng},${lat}`
    const shopArr1 = [];
    const shopArr2 = [];
    GetLbsShop(lng, lat).then((res) => {
      if (res.code == 100 && res.data.shop_list.length > 0) {
        for (let i = 0; i < res.data.shop_list.length; i++) {
          const status = cur_dateTime(res.data.shop_list[i].start_time, res.data.shop_list[i].end_time);
          // 判断是否营业
          if (status == 1 || status == 3) {
            shopArr1.push(res.data.shop_list[i]);
          } else {
            shopArr2.push(res.data.shop_list[i]);
          }
        }
        // 按照goods_num做降序排列
        let shopArray = shopArr1.concat(shopArr2);
        // shopArray.sort((a, b) => {
        //   var value1 = a.goods_num,
        //     value2 = b.goods_num;
        //   if (value1 <= value2) {
        //     return a.distance - b.distance;
        //   }
        //   return value2 - value1;
        // });
        shopArray[0]['jingxuan'] = true; // 默认设置第一个为精选门店
        wxSet('takeout', shopArray); // 保存外卖门店到本地
        //存储app.golbalData
        wxSet('appglobalData', app.globalData);
        reLaunch({
          url: '/pages/home/goodslist/goodslist'
        });
      } else if (res.data.shop_list.length == 0) {
        this.setData({
          content: '您的定位地址无可配送门店',
          confirmButtonText: '去自提',
          cancelButtonText: '修改地址',
          modalShow: true,
          mask: true
        })
      }

    })
  },
  // 自提附近门店
  funGetNearbyShop(lng, lat) {;
    const location = `${lng},${lat}`
    const str = new Date().getTime();
    wx.request({
      url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=${geotable_id}&location=${lng}%2C${lat}&ak=${ak}&radius=3000&sortby=distance%3A1&page_index=0&page_size=50&_=${str}`,
      success: (res) => {
        // 3公里有门店
        if (res.data.contents && res.data.contents.length > 0) {
          this.funGetSelf(res.data.contents)
        } else {
          // 没有扩大搜索范围到1000000公里
          wx.request({
            url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=${geotable_id}&location=${lng}%2C${lat}&ak=${ak}&radius=1000000000&sortby=distance%3A1&page_index=0&page_size=50&_=${str}`,
            success: (conf) => {
              if (conf.data.contents.length > 0) {
                this.funGetSelf(conf.data.contents)
              } else {
                // 提示切换地址
                $Toast({
                  content: "当前定位地址无可浏览的门店，请切换地址！",
                  success: (res) => {
                    redirectTo({
                      url: '/pages/home/selecttarget/selecttarget?type=true'
                    });
                  },
                });
              }
            }
          });
        }
      },
    });
  },
  // 自提
  funGetSelf(obj) {
    let shopArr1 = [];
    let shopArr2 = [];
    NearbyShop(JSON.stringify(obj)).then((res) => {
      for (let i = 0; i < res.length; i++) {
        let status = cur_dateTime(res[i].start_time, res[i].end_time);
        // 判断是否营业
        if (status == 1 || status == 3) {
          shopArr1.push(res[i]);
        } else {
          shopArr2.push(res[i]);
        }
      }
      // 根据距离最近排序
      // shopArr1.sort(sortNum('distance'));
      // shopArr2.sort(sortNum('distance'));
      const shopArray = shopArr1.concat(shopArr2);
      shopArray[0]['jingxuan'] = true; // 默认设置第一个为精选门店
      wxSet('self', shopArray); // 保存自提门店到本地
    })
  },
  bindCounterPlusOne(e) {
    // 点击左边去自提
    if (e.detail.type == 1 && e.detail.isType == "noShop") {
      this.setData({
        modalShow: e.detail.modalShow,
        mask: e.detail.mask,
        type: 2
      })
      app.globalData.type = 2;
      //存储app.golbalData
      wxSet('appglobalData', app.globalData)
      reLaunch({
        url: '/pages/home/goodslist/goodslist'
      })
    } else if (e.detail.type == 0 && e.detail.isType == "noShop") {
      redirectTo({
        url: '/pages/home/selecttarget/selecttarget?type=true'
      });
    }
  },
})