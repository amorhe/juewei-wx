import {
  imageUrl,
  ak,
  geotable_id,
  wxGet,
  wxSet
} from '../../../pages/common/js/baseUrl'
import {
  MyNearbyShop
} from '../../../pages/common/js/home'
import {
  cur_dateTime
} from '../../../pages/common/js/time'
import {
  tx_decrypt
} from '../../../pages/common/js/map'
import {
  navigateTo,
  switchTab,
  reLaunch
} from '../../../pages/common/js/router.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    // 地图中心点
    longitude: '',
    latitude: '',
    markersArray: [],
    shopList: [], // 附近门店列表
    inputAddress: '',
    city: '',
    activeIndex: 0,
    height:448
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.nearShop(wxGet('lng'), wxGet('lat'));
    let ott = tx_decrypt(wxGet('lng'), wxGet('lat'))
    this.setData({
      longitude: ott.lng,
      latitude: ott.lat,
      selfshop: false,
      city: app.globalData.position.city || app.globalData.city
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
    this.setData({
      city: app.globalData.city
    })
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
    app.globalData.shopIng = null;
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
  // 获取附近门店
  nearShop(lng, lat) {
    wx.request({
      url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=${geotable_id}&location=${lng}%2C${lat}&ak=${ak}&radius=3000&sortby=distance%3A1&page_index=0&page_size=50&_=`,
      success: (res) => {
        const obj = res.data.contents;
        MyNearbyShop(JSON.stringify(obj)).then((conf) => {
          conf.forEach(item => {
            if (cur_dateTime(item.start_time, item.end_time) != 2) {
              item['isOpen'] = true
            }
          })
          let arr = conf
            .map(({
              shop_gd_latitude,
              shop_gd_longitude
            }) => ({
              longitude: shop_gd_longitude,
              latitude: shop_gd_latitude
            }))
            .map((item, index) => {
              if (index == 0) {
                return {
                  ...item,
                  iconPath: `${imageUrl}position_map1.png`,
                  width: 32,
                  height: 32
                }
              } else {
                return {
                  ...item,
                  iconPath: `${imageUrl}position_map1.png`,
                  width: 15,
                  height: 15
                }
              }
            })
          this.setData({
            markersArray: arr,
            shopList: conf
          })
        })
      },
    });
  },
  // tt(e){
  //   if(e.target.offsetTop == 0){
  //     this.setData({
  //       height:448
  //     })
  //   }else{
  //     this.setData({
  //       height: 1050
  //     })
  //   }
  // },
  // 切换城市
  eveChoosecityTap() {
    navigateTo({
      url:'../../../pages/city/city'
    })
  },
  // 切换门店
  eveSwitchShop(e) {
    let arr = this.data.markersArray.map((item, index) => {
      if (index == e.currentTarget.dataset.index) {
        return {
          ...item,
          iconPath: `${imageUrl}position_map1.png`,
          width: 32,
          height: 32
        }
      } else {
        return {
          ...item,
          iconPath: `${imageUrl}position_map1.png`,
          width: 15,
          height: 15
        }
      }
    })
    this.setData({
      markersArray: arr,
      activeIndex: e.currentTarget.dataset.index
    })
  },
  // 去自提
  goSelf(e) {
    app.globalData.isSelf = true;
    app.globalData.shopIng = e.currentTarget.dataset.info;
    app.globalData.type = 2;
    wx.navigateBack({
      delta:1
    });
  },
})