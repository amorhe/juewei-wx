// package_vip/pages/exchangelist/exchangedetail/exchangedetail.js

import { baseUrl, imageUrl, imageUrl2 } from '../../../../pages/common/js/baseUrl'
import { log, handleCopy, guide, contact, event_getNavHeight } from '../../../../pages/common/js/utils'

Page({

  /**
   * 页面的初始数据
   */
   data: {
    imageUrl,
    imageUrl2,
    fail: false,
    open1: false,
    open2: false,
    cancleShow: false,


    time: '',

    cancelReasonList: [
      { reason: '下错单/临时不想要了', value: true },
      { reason: '信息填写错误，重新下单', value: false },
      { reason: '其他', value: false },
    ],
    _exchange_intro: [],
    _intro: [],

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