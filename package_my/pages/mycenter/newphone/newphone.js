import {
  sendCode
} from '../../../../pages/common/js/login'
import {
  navigateTo
} from '../../../../pages/common/js/router.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    _sid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    this.setData({
      _sid: e.sid
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
  inputValue(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  eveGetCode() {
    var data = {
      _sid: this.data._sid,
      phone: this.data.phone
    }
    sendCode(data).then(res => {
      if (res.code == 0) {
        navigateTo({
          url: '/package_my/pages/mycenter/bindphone/bindphone?phone=' + this.data.phone + '&type=2'
        });
      } else {
        wx.showToast({
          icon: 'none',
          content: res.msg,
          duration: 2000
        });
      }
    })
  },
})