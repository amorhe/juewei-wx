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
const { $Toast } = require('../../../iview-weapp/base/index');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    avatarImg: '',
    _sid: wxGet('_sid') || '',
    userInfo: {},
    isLogin: false,
    showNo: false, //显示次数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let userInfo = wxGet('userInfo');
    if (userInfo && userInfo.user_id){//有用户信息
       this.setData({
         user_id: userInfo.user_id,
         nick_name: userInfo.nick_name,
         head_img: userInfo.head_img,
         showNo: true
       })
    }else{//没有用户信息
      this.setData({
        showNo: false //这里写死
      })
    }
    console.log(this.data.showNo);
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

  // 判断是否去登录
  isloginFn() {
    const userInfo = wxGet('userInfo');
    if (userInfo && userInfo.user_id){ //有用户信息，进入到个人中心修改个人信息
      // wxSet('showNo', true);
      navigateTo({
        url: '/package_my/pages/mycenter/mycenter'
      })
    }else{//没有用户信息，自动登录已经成功了，但是没有userid需要后端登录一次才可以
      // wxSet('showNo', false);
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
    let that=this;
    if (errMsg === 'getUserInfo:ok') {
      const { user_id } = wxGet('userInfo') || { user_id: '' };
      if (!user_id) {
        wxSet('rest', rest);
        wxSet('userInfo', userInfo);
        return
      }else{
        return navigateTo({
          url: '/package_my/pages/mycenter/mycenter?img=' + (userInfo.avatarUrl || userInfo.head_img) + '&name=' + (userInfo.nickName || userInfo.nick_name)
        })
      }
    }else{
      return navigateTo({
        url: '/package_my/pages/mycenter/mycenter?img=&name='
      })
    }
  },
  // 上传模版消息
  onSubmit(e) {
    upformId(e.detail.formId);
  }
});
