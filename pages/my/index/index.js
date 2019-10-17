import {
  imageUrl,
  wxGet,
  wxSet
} from '../../common/js/baseUrl'
import {
  upformId
} from '../../common/js/time'
import {
  navigateTo
} from '../../common/js/router.js'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    avatarImg: '',
    _sid: '',
    userInfo: {},
    isLogin: false,
    showno: 1, //显示次数
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
    const {
      user_id,
      nick_name,
      head_img
    } = wxGet('userInfo');
    this.setData({
      user_id,
      nick_name,
      head_img
    })
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

  // 判断是否去登录
  isloginFn() {
    const userInfo = wxGet('userInfo');
    if (!userInfo.user_id) {
      navigateTo({
        url: '/pages/login/auth/auth'
      });
    }
  },
  // 跳转页面
  toUrl(e) {
    const userInfo = wxGet('userInfo');
    if (userInfo.user_id) {
      var url = e.currentTarget.dataset.url;
      navigateTo({
        url
      });
    } else {
      navigateTo({
        url: '/pages/login/auth/auth',
      });
    }
  },
  bindgetuserinfo(e) {
    const {
      errMsg,
      userInfo,
      ...rest
    } = e.detail;
    if (errMsg === 'getUserInfo:ok') {
      const {
        user_id
      } = wxGet('userInfo') || {
        user_id: ''
      };
      if (!user_id) {
        wxSet('rest', rest);
        wxSet('userInfo', userInfo);
        return
      }
      return navigateTo({
        url: '/package_my/pages/mycenter/mycenter?img=' + userInfo.head_img + '&name=' + userInfo.nick_name
      })
    } 
  },
  // 上传模版消息
  onSubmit(e) {
    upformId(e.detail.formId);
  }
});