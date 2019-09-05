import { imageUrl, ak, geotable_id } from '../../common/js/baseUrl'
import { addressList, GetLbsShop, NearbyShop } from '../../common/js/home'
import { bd_encrypt } from '../../common/js/map'
import { cur_dateTime, compare, sortNum } from '../../common/js/time'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    city: '',      //城市
    addressIng: '',    // 定位地址
    canUseAddress: [],   // 我的地址
    nearAddress: [],   // 附近地址
    isSuccess: false,
    info: '',   // 一条地址信息
    inputAddress: '',  //手动输入的地址
    loginOpened: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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