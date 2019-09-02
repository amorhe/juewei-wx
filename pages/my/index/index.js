import {
  imageUrl,
  wxGet,
  wxSet
} from '../../common/js/baseUrl'
import {
  getuserInfo
} from '../../common/js/login'
import {
  upformId
} from '../../common/js/time'
let log = console.log
var app = getApp()
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
    this.setData({
      _sid: app.globalData._sid
    })
    this.getUserInfos(); //在显示的时候调起
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      showno: 1
    })
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
  // 获取用户微信资料
  getAuthCode(userInfo) {
    if (this.data.showno !== 1) {
      return;
    }
    wx.authorize({
      scope: "scope.userInfo",
      success: (res) => {
        // console.log('ddddd',res);
        wx.getUserInfo({
          success: (user) => {
            console.log(user)
            // userInfo['head_img'] = user.avatar
            // userInfo['nick_name'] = user.nickName
            // this.setData({
            //   userInfo
            // })
          }
        });
      },
      fail: (e) => {
        this.setData({
          showno: 2,
          userInfo
        })
      }
    });
  },
  // 取本地缓存_sid
  getSid() {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: '_sid', // 缓存数据的key
        success: (res) => {
          resolve(res)
        },
        fail: err => {
          reject(err)
        }
      });
    })
  },
  // 获取用户信息
  async getUserInfos() {
    var that = this
    let _sid = await this.getSid()
    let res = await getuserInfo(_sid.data || '')
    if (res.code == 30106) {
      this.setData({
        loginId: res.code,
        userInfo: {},
      })
    }
    if (res.code == 0) {
      this.getAuthCode(res.data);
    }
  },
  // 判断是否去登录
  isloginFn() {
    if (this.data.userInfo.user_id) {
      if (this.data.userInfo.hasOwnProperty('head_img')) {
        wx.navigateTo({
          url: '/package_my/pages/mycenter/mycenter?img=' + this.data.userInfo.head_img + '&name=' + this.data.userInfo.nick_name
        });
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/auth/auth'
      });
    }
  },
  // 跳转页面
  toUrl(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
    // if (this.data.userInfo.user_id) {
    //   var url = e.currentTarget.dataset.url
    //   wx.navigateTo({
    //     url: url
    //   });
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/login/auth/auth',
    //   });
    // }
  },
  // 打客服电话
  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: '4009995917'
    });
  },
  // 上传模版消息
  onSubmit(e) {
    upformId(e.detail.formId);
  }
})