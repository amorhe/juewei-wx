import {
  imageUrl,
  imageUrl2,
  baseUrl,
  wxGet,
  wxSet
} from '../../../common/js/baseUrl'
import {
  couponsList,
  exchangeCode
} from '../../../common/js/home'
import {
  formatTime
} from '../../../common/js/time'
import {
  getSid,
  log,
  ajax
} from '../../../common/js/li-ajax'
const { $Toast } = require('../../../../iview-weapp/base/index');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open2: false,
    codeImg: '',
    active: [],
    activeIndex: '',
    imageUrl,
    imageUrl2,
    couponList: [], // 优惠券列表
    defaultcoupon: '', // 默认选中的优惠券
    couponChoosed: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    const _sid = wxGet('_sid');
    this.funGetCouponsList(_sid, e.money / 100);
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
    this.eveCloseModel();
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
  // 优惠券
  funGetCouponsList(_sid, money) {
    this.data.couponChoosed = {};
    couponsList(_sid, 'use', money, wxGet('shop_id'),wxGet('userInfo').phone).then((res) => {
      res.DATA.use.forEach(item => {
        item.start_time = formatTime(item.start_time, 'Y-M-D');
        item.end_time = formatTime(item.end_time, 'Y-M-D');
        item.toggleRule = false,
          item.isChecked = false
      })
      // 已选中的优惠券
      if (app.globalData.coupon_code && app.globalData.coupon_code!='') {
        if (app.globalData.notUse == 0) {
          this.data.couponChoosed[`e${res.DATA.use.findIndex(item => item.code == app.globalData.coupon_code)}`] = app.globalData.coupon_code;
        }
        this.setData({
          couponList: res.DATA.use,
          couponChoosed: this.data.couponChoosed
        })
      } else {
        // 默认选择的优惠券
        this.data.couponChoosed[`e${res.DATA.use.findIndex(item => item.code == res.DATA.max.code)}`] = res.DATA.max.code;
        this.setData({
          couponList: res.DATA.use,
          couponChoosed: this.data.couponChoosed
        })
      }

    })
  },
  chooseCouponed(e) {
    let couponChoosed = {};
    couponChoosed[`e${e.currentTarget.dataset.index}`] = e.currentTarget.dataset.coupon_code;
    if (this.data.couponChoosed[`e${e.currentTarget.dataset.index}`] == e.currentTarget.dataset.coupon_code) {
      app.globalData.coupon_code = '';
      app.globalData.notUse = 1;
      this.setData({
        couponChoosed: {}
      })
    } else {
      app.globalData.coupon_code = e.currentTarget.dataset.coupon_code;
      app.globalData.notUse = 0;
      this.setData({
        couponChoosed
      })
    }
    wx.navigateBack({
      url: '/pages/home/orderform/orderform'
    });
  },
  /**
   * @function 展示CODE
   */

  async showCode(e) {
    let { code } = e.currentTarget.dataset
    let _sid = await getSid()
    let codeImg = baseUrl + '/juewei-api/coupon/getQRcode?' + '_sid=' + _sid + '&code=' + code
    this.setData({
      open2: true,
      codeImg
    })
  },
  /**
   * @function 关闭弹窗
   */
  eveCloseModel() {
    this.setData({
      open2: false
    })
  },

  /**
  * @function 核销
  */

  async wait() {
    let res = await ajax('/juewei-api/order/waiting', {}, 'GET')
    if (res.code == 0) {
      return this.closeModel()
    }

    return $Toast({
      content: res.msg,
    });
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