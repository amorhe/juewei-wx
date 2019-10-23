import {
  exchangeCoupon
} from '../../../../pages/common/js/home';
import {
  imageUrl,
  wxGet
} from '../../../../pages/common/js/baseUrl'
const { $Toast } = require('../../../../iview-weapp/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    imageUrl
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

  },
  writeCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  eveexchangeBtn() {
    const _sid = wxGet('_sid');
    const {
      code
    } = this.data
    if (!code) {
      return $Toast({
        content:'请输入兑换码'
      })
    }
    exchangeCoupon(_sid, code).then((res) => {
      if (res.CODE == 'A100') {
        $Toast({
          content: '兑换成功',
          type:'success'
        })
      } else {
        $Toast({
          content: res.MESSAGE
        })
      }
    })
  }
})