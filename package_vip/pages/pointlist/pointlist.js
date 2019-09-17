import { imageUrl } from '../../../pages/common/js/baseUrl'
import { log, isloginFn, event_getNavHeight } from '../../../pages/common/js/utils'
import Request from '../../../pages/common/js/li-ajax'
import { navigateTo } from '../../../pages/common/js/router.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    userPoint: 0,
    list: [],
    toast: false,
    loginOpened: false,
    pagenum: 1,
    pagesize: 10,
    finish: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.funGetDetail(1);
    this.funGetUserPoint()
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
    let navHeight = event_getNavHeight();
    this.setData({
      navHeight
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.onModalClose();
    this.hideToast()
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
    // 页面被拉到底部
    let { pagenum } = this.data;
    ++pagenum;
    this.funGetDetail(pagenum);
    this.setData({
      pagenum
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  isloginFn,
  funGetDetail(pagenum) {
    let { list, pagesize } = this.data;
    let res = Request.reqPointList({ pagenum, pagesize });
    if (res.code === 100) {
      if (res.data.pagination.lastLage < pagenum) {
        return
      }
      if (res.data.data.length == 0) {
        return
      }
      this.setData({
        list: [...list, ...res.data.data],
        finish: true
      })
    }
  },
  toUrl(e) {
    var url = e.currentTarget.dataset.url;
    navigateTo({
      url: url
    });
  },

  funGetUserPoint() {
    let res = Request.reqUserPoint();
    if (res.CODE === 'A100') {
      this.setData({
        userPoint: res.DATA
      })
    } else {
      this.setData({
        loginOpened: true
      })
    }
  },

  /**
   * @function 关闭modal
   */
  onModalClose() {
    this.setData({
      openPoint: false,
      modalOpened: false,
      loginOpened: false
    })
  },

  /**
   * @function 显示冻结积分
   */
  showToast() {
    this.setData({ toast: true })
  },

  /**
   * @function 隐藏冻结积分
   */
  hideToast() {
    this.setData({ toast: false })
  },
});

// <!--未登录提示 -->
// <i-modal visible="{{loginOpened}}" show-ok="{{ false }}" show-cancel="false">
//   <view class="modalInfo">
//   用户未登录
//   </view>
//   <view slot="footer" class="footerButton">
//   <view class="modalButton confirm " onTap="onModalClose">取消</view>
//   <view class="modalButton cancel " onTap="isloginFn">登录</view>
//   </view>
//   </i-modal>