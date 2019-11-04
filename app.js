//app.js
import {
  WX_LOGIN
} from "./pages/common/js/login";
import {
  wxGet,
  wxSet,
  imageUrl
} from "./pages/common/js/baseUrl";

App({
  onLaunch: function (options) {
    // 清除所有缓存
    // try {
    //   wx.clearStorageSync()
    // } catch (e) {
    //   // Do something when catch error
    // }
    // options.scene == 1035 &&  这里不判断场景，原因是会有很多场景
    if (options && options.query && options.query.go && options.query.go != '') {
      this.globalData.gopages = options.query.go;
    }else{
    	this.globalData.gopages ='';
    }
    // 获取用户信息
    wx.getSetting({
      success: ott => {
        if (ott.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              const {
                userInfo,
                ...rest
              } = res;
              console.log(res);
              const {
                user_id
              } = wxGet('userInfo') || {
                user_id: ''
              };
              if (!user_id) {
                wxSet('rest', rest);
                wxSet('userInfo', userInfo);
                return console.log('user_id不存在，此时不需要授权', '获取到用户信息')
              }
              WX_LOGIN({ ...rest
              });
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              // if (this.userInfoReadyCallback) {
              //   this.userInfoReadyCallback(res)
              // }
              this.funShare()
            }
          })
        } else {
          console.log('未获取到用户信息');
          WX_LOGIN()
        }
      }
    })
  },
  onShow() {
    let that = this;
    wx.getSystemInfo({
      success: res => {
        // console.log('手机信息res'+res.model)
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          that.globalData.isIphoneX = true
        }
      }
    })
  },
  //重写分享方法
  funShare: function () {
    //监听路由切换
    //间接实现全局设置分享内容
    wx.onAppRoute(function (res) {
      //获取加载的页面
      let pages = getCurrentPages(),
        //获取当前页面的对象
        view = pages[pages.length - 1],
        data;
      if (view) {
        data = view.data;
        if (!data.isOverShare) {
          data.isOverShare = true;
          view.onShareAppMessage = function () {
            //分享配置
            return {
              title: '会员专享服务，便捷 实惠 放心',
              path: '/pages/position/position',
              imageUrl: imageUrl + 'share_default.png'
            };
          }
        }
      }
    })
  },
  globalData: {
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
    gopages: '', //跳转到相应文件
    isIphoneX: false,
  }
});