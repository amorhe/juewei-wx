import { imageUrl, ak, geotable_id } from '../common/js/baseUrl'
import { bd_encrypt } from '../common/js/map'
import { GetLbsShop, NearbyShop } from '../common/js/home'
import { cur_dateTime, compare, sortNum } from '../common/js/time'
var app = getApp();
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
  onLoad: function (options) {
    try {
      wx.removeStorageSync('takeout');
      wx.removeStorageSync('self');
      wx.removeStorageSync('opencity');
    } catch (e) {
      // Do something when catch error
    } 
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        wx.hideLoading();
        console.log(res);
        // 腾讯转百度
        const mapPosition = bd_encrypt(res.longitude, res.latitude);
        try {
          wx.setStorageSync('lat', mapPosition.lat);
          wx.setStorageSync('lng', mapPosition.lng);
          // wx.setStorageSync('nearPois', res.pois);
        } catch (e) {
          // Do something when catch error
        } 
        
        // app.globalData.province = res.province;
        // app.globalData.city = res.city;
        // app.globalData.address = res.pois[0].name;
        // app.globalData.position = res;
        // app.globalData.position.longitude = mapPosition.bd_lng;
        // app.globalData.position.latitude = mapPosition.bd_lat;
        // that.getLbsShop();
        // that.getNearbyShop();
        // that.setData({
        //   city: res.city
        // })
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})