import {
  imageUrl,
  wxGet,
  wxSet
} from '../../../../pages/common/js/baseUrl'
import {
  couponsList
} from '../../../../pages/common/js/home'
import {
  formatTime
} from '../../../../pages/common/js/time'
import {
  getSid,
  log,
  ajax
} from '../../../../pages/common/js/li-ajax'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    couponList: [],
    open2: false,
    codeImg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _sid = wxGet('_sid');
    this.funGetCouponsList(_sid);
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
  funGetCouponsList(_sid) {
    couponsList(_sid, 'history').then((res) => {
      if (res.CODE == "A100"){
          res.DATA.used.forEach(item => {
            item.start_time = formatTime(item.start_time, 'Y-M-D');
            item.end_time = formatTime(item.end_time, 'Y-M-D');
          })
          this.setData({
            couponList: res.DATA.used,
            tabs: this.data.tabs
          })
      }else{
          //用户未登录状态
      }
    })
  },
  /**
   * @function 展示规则
   */

  toggleRule(e) {
    const { index } = e.currentTarget.dataset;
    let { couponList } = this.data
    if (couponList[index].toggleRule) {
      couponList[index].toggleRule = false
    } else {
      couponList.forEach(item => {
        item.toggleRule = false;
      })
      couponList[index].toggleRule = true
    }
    this.setData({ couponList })
  }
})