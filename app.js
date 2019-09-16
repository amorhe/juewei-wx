//app.js
import { WX_LOGIN } from "./pages/common/js/login";
import { wxGet, wxSet } from "./pages/common/js/baseUrl";

App({
  onLaunch: function () {
    // 获取用户信息
    wx.getSetting({
      success: ott => {
        if (ott.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              const { userInfo, ...rest } = res;
              console.log(res);
              const { user_id } = wxGet('userInfo') || { user_id: '' };
              if (!user_id) {
                wxSet('rest', rest);
                wxSet('userInfo', userInfo);
                return console.log('user_id不存在，此时不需要授权', '获取到用户信息')
              }
              WX_LOGIN({ ...rest });
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              // if (this.userInfoReadyCallback) {
              //   this.userInfoReadyCallback(res)
              // }
            }
          })
        } else {
          console.log('未获取到用户信息');
          WX_LOGIN()
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
    position: {
      longitude: null,
      latitude: null
    },
    address: null,
    _sid: null,
    userInfo: null, //拉去支付宝用户信息
    authCode: null, //静默授权
    phone: null, //获取手机号权限
    addressInfo: null, //切换定位地址
    gifts: null, //加购商品
    type: 1, // 默认外卖
    coupon_code: null, //优惠券
    scrollTop: null,
    province: null,
    city: null,
    chooseBool: false,
    isSelf: false,
    refresh: false, // 当前页面是否需要刷新
  }
});