import {
  imageUrl,
  imageUrl2,
  wxGet,
  wxSet
} from '../../../../pages/common/js/baseUrl'
import {
  exchangeCode
} from '../../../../pages/common/js/home'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    imageUrl2,
    exchageArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _sid = wxGet('_sid');
    this.funGetExchangeCode(_sid);
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
  funGetExchangeCode(_sid) {
    exchangeCode(_sid, 'history').then((res) => {
      this.setData({
        exchageArr: res.DATA
      })
    })
  },
})