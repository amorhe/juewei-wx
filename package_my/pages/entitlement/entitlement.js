import {
  imageUrl
} from '../../../pages/common/js/baseUrl'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    list: [{
        icon: `${imageUrl}exchange.png`,
        title: '迎新礼包',
        info: '会员迎新礼包，价值100元优惠券',
      },
      {
        icon: `${imageUrl}my_quity_02.png`,
        title: '积分礼',
        info: '积分可在会员专享兑换专属礼品',
      },
      {
        icon: `${imageUrl}my_quity_04.png`,
        title: '会员特惠日',
        info: '会员特惠日，双倍积分、积分兑券、摇奖、商品特价等丰富的会 员活动',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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