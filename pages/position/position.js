import {
  imageUrl,
  ak,
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
var app = getApp();
var bmap = require('../../libs/bmap-wx.js');
var BMap = new bmap.BMapWX({
  ak: ak
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: imageUrl,
    city: '定位中...',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.removeStorageSync('takeout');
    wx.removeStorageSync('self');
    wx.removeStorageSync('opencity');
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success(ott) {
        wx.hideLoading();
        // 腾讯转百度
        // let mapPosition = bd_encrypt(ott.longitude, ott.latitude),
         let res = {};
        console.log(ott)
        // 发起regeocoding检索请求 
        BMap.regeocoding({
          success(data) {
            console.log(data)
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
            wxSet('lat', res.location.lat);
            wxSet('lng', res.location.lng);
          }
        });
        

        // that.getLbsShop();
        // that.getNearbyShop();

      },
      fail() {
        // 定位失败
        wx.hideLoading();
        wx.reLaunch({
          url: '/pages/noposition/noposition'
        })
      },
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

  }
})