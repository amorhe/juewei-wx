//app.js
App({
  onLaunch: function () {
    wx.setStorage({
      key: '_sid',
      data: '756sv2hhbd2nkd4hhdtt3s1sur',
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          wx.authorize({
            scope:'scope.userInfo',
            success() {
              wx.getUserInfo()
            }
          })
        }
      }
    })
  },
  globalData: {
    query: null,
    location: { //获取地区
      longitude: null,
      latitude: null
    },
    address: null,
    _sid: null,
    userInfo: null, //拉去支付宝用户信息
    authCode: null, //静默授权
    phone: null, //获取手机号权限
    addressInfo: null,   //切换定位地址
    gifts: null,    //加购商品
    type: 1,     // 默认外卖
    coupon_code: null,   //优惠券
    scrollTop: null
  }
})