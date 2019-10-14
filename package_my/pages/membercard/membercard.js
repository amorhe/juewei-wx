import {
  membercard
} from '../../../pages/common/js/my'
import {
  baseUrl,
  imageUrl,
  wxGet
} from '../../../pages/common/js/baseUrl'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    imageUrl,
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.funGetQRcode();
    const phone = wxGet('userInfo').phone;
    this.setData({
      phone
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
  funGetQRcode() {
    const _sid = wxGet('_sid');
    this.setData({
      imgSrc: baseUrl + '/juewei-api/wxmini/getQRcode?_sid=' + _sid
    })
  },
  eveGoPay() {
    wx.request({
      url: 'https://checkservice.juewei.com/payment/wechatMiniCallPayCode',
      success(res) {
        wx.openOfflinePayView({
          appId: res.data.data.appId,
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
          success: function(confg) {
            console.log(confg)
          },
          fail: function(e) {
            console.log(e,  1)
          },
          complete: function(f) {
            console.log(f,   2)
          }
        })
      }
    })
  }
})