// package_vip/pages/finish/finish.js
import { imageUrl, imageUrl2, baseUrl } from '../../../pages/common/js/baseUrl'
import { log, handleCopy, guide, contact, liTo, parseData, MODAL } from '../../../pages/common/js/utils'
import Request from "../../../pages/common/js/li-ajax";
import { navigateTo, reLaunch } from "../../../pages/common/js/router";

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    imageUrl2,
    fail: false,
    open2: false,
    codeImg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(query) {
    let { id, fail } = query;
    this.setData({
      fail: fail == 'true'
    });
    wx.setNavigationBarTitle({
      title: fail != 'true' ? '兑换成功' : '兑换失败',
    });
    await this.getOdrderDetail(id)

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
    this.closeModel()

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

  },

  /**
   * 获取商品详情
   */
  async getOdrderDetail(id) {
    let { code, data: { intro, exchange_intro, ...Data } } = await Request.reqOrderDetail({ id });
    if (code === 100) {
      parseData({ bindName: '_intro', html: intro, target: this });
      parseData({ bindName: '_exchange_intro', html: exchange_intro, target: this });
      this.setData({
        d: {
          intro,
          exchange_intro,
          ...Data
        }
      })
    }
  },

  /**
   * @function 关闭弹窗
   */

  closeModel() {
    this.setData({
      open1: false,
      open2: false
    })
  },

  /**
   * @function 使用优惠卷
   */
  async toUse() {
    const { way } = this.data.d;
    // way:用途 1:外卖专享 2:门店专享 3:全场通用
    switch (way - 0) {
      case 1:
      case 3:
        MODAL({
          title:'',
          content:'限时优惠，立即使用',
          cancelText:'自提',
          cancel:this.toTakeOut,
          confirmText:'外卖',
          confirm:this.toTakeIn
        });
        break;
      case 2:
        let { code } = this.data.d;
        let _sid = wxGet('_sid');
        let codeImg = baseUrl + '/juewei-api/coupon/getQRcode?' + '_sid=' + _sid + '&code=' + code;
        log(codeImg);
        this.setData({
          open2: true,
          codeImg
        });
        break
    }
  },


  /**
   * @function 去自提
   */
  toTakeOut() {
    app.globalData.type = 2;
    log(app.globalData.type);
    reLaunch({
      url: '/pages/home/goodslist/goodslist'
    });
  },

  /**
   * @function 去外卖
   */
  toTakeIn() {
    app.globalData.type = 1;
    log(app.globalData.type);

    reLaunch({
      url: '/pages/home/goodslist/goodslist'
    });
  },

  /**
   * @function 核销
   */

  async wait() {
    let res = await reqWait();
    if (res.code == 0) {
      return this.closeModel()
    }

    return wx.showToast({
      content: res.msg,
    });
  },

  handleCopy,

  guide,

  contact,

  navigateTo,

  liTo,

});