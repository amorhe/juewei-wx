import {
  imageUrl,
  imageUrl2,
  baseUrl,
  wxGet,
  wxSet
} from '../../../pages/common/js/baseUrl'
import {
  couponsList,
  exchangeCode
} from '../../../pages/common/js/home'
import {
  formatTime
} from '../../../pages/common/js/time'
import {
  log,
  ajax
} from '../../../pages/common/js/li-ajax'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open2: false,
    open1: false,
    codeImg: '',
    tabs: [{
        title: '优惠券0张'
      },
      {
        title: '兑换码0个'
      },
    ],
    activeTab: 0, // 初始选中
    imageUrl,
    imageUrl2,
    couponList: [], // 优惠券列表
    exchangeList: [], // 兑换列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _sid = wxGet('_sid');
    this.funGetCouponsList(_sid);
    this.funGetExchangeCode(_sid);
    let phone = wxGet('phone');
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
    this.closeModel()
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
  funGetCouponsList(_sid) {
    couponsList(_sid, 'use').then((res) => {
      if (res.CODE == "A100"){
        const { tabs } = this.data
        tabs[0].title = `优惠券${res.DATA.use.length}张`;
        res.DATA.use.forEach(item => {
          item.start_time = formatTime(item.start_time, 'Y-M-D');
          item.end_time = formatTime(item.end_time, 'Y-M-D');
          item.toggleRule = false
        })
        this.setData({
          couponList: res.DATA.use,
          tabs
        })
      }
    })
  },
  // 兑换码
  funGetExchangeCode(_sid) {
    exchangeCode(_sid, 'use').then((res) => {
      if(res.CODE == "A100"){
        console.log('exchangeCode');
        const {
          tabs
        } = this.data;
        tabs[1].title = `兑换码${res.DATA.length}个`;
        this.setData({
          exchangeList: res.DATA,
          tabs
        })
      }
    })
  },
  handleTabClick({ detail }) {
    this.setData({
      activeTab: detail.key,
    });
  },
  // 兑换详情
  changedetail(e) {
    const {
      gift_code_id,
      gift_id,
      order_id,
      source
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/package_my/pages/coupon/changedetails/changedetails?gift_code_id=' + gift_code_id + '&gift_id=' + gift_id + '&order_id=' + order_id + '&source=' + source
    })
  },

  /**
   * @function 展示CODE
   */

  showCode(e) {
    let { code } = e.currentTarget.dataset
    let _sid = getSid();
    let codeImg = baseUrl + '/juewei-api/coupon/getQRcode?' + '_sid=' + _sid + '&code=' + code
    this.setData({
      open2: true,
      codeImg
    })
  },
  /**
   * @function 关闭弹窗
   */
  closeModel() {
    this.setData({
      open2: false,
      open1: false
    })
  },

  /**
   * @function 使用优惠卷
   */
  toUse(e) {
    const {
      way
    } = e.currentTarget.dataset
    // way:用途 1:外卖专享 2:门店专享 3:全场通用
    switch (way - 0) {
      case 1:
      case 3:
        this.setData({
          open1: true
        })
        break;
      case 2:
        this.showCode(e)
        // let { code } = this.data.d
        // let _sid = await getSid()
        // let codeImg = baseUrl + '/juewei-api/coupon/getQRcode?' + '_sid=' + _sid + '&code=' + code
        // log(codeImg)
        // this.setData({
        //   open2: true,
        //   codeImg
        // })
        break
    }
  },



  /**
   * @function 去自提
   */
  toTakeOut() {
    app.globalData.type = 2
    log(app.globalData.type)
    wx.switchTab({
      url: '/pages/home/goodslist/goodslist'
    });
  },

  /**
   * @function 去外卖
   */
  toTakeIn() {
    app.globalData.type = 1
    log(app.globalData.type)

    wx.switchTab({
      url: '/pages/home/goodslist/goodslist'
    });
  },

  /**
   * @function 核销
   */

  wait() {
    let res = ajax('/juewei-api/order/waiting', {}, 'GET')
    if (res.code == 0) {
      return this.closeModel()
    }

    return wx.showToast({
      title: res.msg,
    });
  },

  /**
   * @function 展示规则
   */

  evetoggleRule(e) {
    const {
      index
    } = e.currentTarget.dataset;
    let {
      couponList
    } = this.data
    if (couponList[index].toggleRule) {
      couponList[index].toggleRule = false
    } else {
      couponList.forEach(item => {
        item.toggleRule = false;
      })
      couponList[index].toggleRule = true
    }

    this.setData({
      couponList
    })
  }
})