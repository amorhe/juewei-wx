import {
  imageUrl,
  wxGet
} from '../../../pages/common/js/baseUrl'
import {
  tx_decrypt
} from '../../../pages/common/js/map'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    longitude: 0, // 地图中心点
    latitude: 0,
    markersArray: [],
    shopList: [], //门店列表
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    app.globalData.switchClick = true;
    //  外卖
    let data;
    if (e.type == 1) {
      data = wxGet('takeout');
    }
    //  自提
    if (e.type == 2) {
      data = wxGet('self');
    }
    let hI = 0;
    if (app.globalData.hI) {
      hI = app.globalData.hI
    }
    let arr = data
      .map(({
        shop_gd_latitude,
        shop_gd_longitude
      }) => ({
        longitude: shop_gd_longitude,
        latitude: shop_gd_latitude
      }))
      .map((item, index) => {
        if (index === hI) {
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
      shopList: data,
      markersArray: arr,
      type: e.type
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
    let ott = tx_decrypt(wxGet('lng'), wxGet('lat'))
    this.setData({
      longitude: ott.lng,
      latitude: ott.lat,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    app.globalData.switchClick = null;
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
  // 选择门店
  eveChooseshop(e) {
    app.globalData.shop_id = e.currentTarget.dataset.id; //商店id
    app.globalData.type = this.data.type; //外卖自提
    app.globalData.hI = e.currentTarget.dataset.index;
    app.globalData.shopIng = e.currentTarget.dataset.shoping;
    app.globalData.position.cityAdcode = e.currentTarget.dataset.shoping.city_id;
    app.globalData.position.districtAdcode = e.currentTarget.dataset.shoping.district_id;
    app.globalData.switchClick = null
    wx.navigateBack({ //由于商城首页选用的是navigate  所以这里需要用返回
      url: '/pages/home/goodslist/goodslist'
    })
  },
})