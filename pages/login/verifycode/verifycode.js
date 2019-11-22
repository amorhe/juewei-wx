import { baseUrl, imageUrl, wxGet, wxSet } from '../../common/js/baseUrl'
import { loginByPhone, sendCode } from '../../common/js/login'
import { navigateTo,redirectTo } from '../../common/js/router.js'
const { $Toast } = require('../../../iview-weapp/base/index');
import { UpdatewxUserInfo } from '../../../pages/common/js/my';//用于登录后拿微信信息同步给后台

let timeCount;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    baseUrl,
    focus: false,
    value: '',
    type: '1',
    phone: '',
    countTime: 60,
    isnew: true,
    img_code: '',
    modalOpened: false,
    getCode: true,
    // cursor: 0,
    timestamp: 0, //当前时间戳
    next:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    const _sid = wxGet('_sid');
    this.setData({
      phone: e.phone,
      _sid,
      isnew: true,
      countTime:60,
      next:e.next
    });
    this.timeDate()
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
    this.timeDate()

    // if (this.data.timestamp !== 0) {
    //   let timestampNew = new Date().getTime();
    //   let counts = parseInt((timestampNew - this.data.timestamp) / 1000);
    //   if (counts > 0) {
    //     this.setData({
    //       isnew: true,
    //       countTime: this.data.countTime - counts
    //     })
    //   } else {
    //     this.setData({
    //       isnew: false,
    //       countTime: 60,
    //     })
    //   }
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // let timestamp = new Date().getTime();
    // this.setData({
    //   countTime: this.data.countTime,
    //   focus: false
    // })
    // clearInterval(timeCount)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timeCount)
    // 页面被关闭
    this.setData({
      isnew: false,
      countTime: 60,
      focus: false
    });
    
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
  bindFocus() {
    setTimeout(() => {
      this.onFocus();
    }, 100);
  },
  onFocus() {
    this.setData({
      focus: true,
    });
  },
  async onBlur() {
    var that = this;
    const { phone, value } = this.data;
    const {  ...rest } = wxGet('rest');
    const _sid = wxGet('_sid');
    this.setData({
      focus: false,
    });
    const data = {
      phone,
      code: value,
      _sid,
      ...rest
    };
    let res = await loginByPhone(data);
    if (res.code === 0) {
      // 成功
      app.globalData._sid = res.data._sid;
      wxSet('_sid', res.data._sid);
      wxSet('user_id', res.data.user_id);

      if (app.globalData.avatarUrl && app.globalData.avatarUrl != '') {
        res.data.head_img = app.globalData.avatarUrl;
      }
      if (app.globalData.nickName && app.globalData.nickName != '') {
        res.data.nick_name = app.globalData.nickName;
      }
      wxSet('userInfo',res.data);
 
      //如果能获得就传给后台更新
      if (app.globalData.nickName && app.globalData.nickName!=''){
        UpdatewxUserInfo({
          _sid: res.data._sid,
          head_img: app.globalData.avatarUrl,
          nick_name: app.globalData.nickName
        }).then(r => {
          //r不做任何处理
          res.data.head_img = app.globalData.avatarUrl;
          res.data.nick_name = app.globalData.nickName;
          wxSet('userInfo', res.data);
          // 11-22  提交商品未登录跳转到登录页，然后登录过后跳转到订单页（何帅）
          if (this.data.next) {
            redirectTo({
              url: '/pages/home/orderform/orderform'
            })
            return
          }
          wx.navigateBack({ delta: 2 })
        })
      }else{
        app.globalData.nickName = res.data.nick_name;
        app.globalData.avatarUrl = res.data.head_img;
        // 11-22  提交商品未登录跳转到登录页，然后登录过后跳转到订单页（何帅）
        if (this.data.next) {
          redirectTo({
            url: '/pages/home/orderform/orderform'
          })
          return
        }
        wx.navigateBack({ delta: 2 })
      }
    } else {
      // 其他
      $Toast({
        content: res.msg
      })
    }

  },
  // 倒计时60
  timeDate(e) {
    clearInterval(timeCount)
    var time = this.data.countTime;
    //重新获取验证码
    if (e && e.currentTarget.dataset.is == 1) {
      clearInterval(timeCount)
      this.getcodeFn()
    }else{//正在倒计时
      timeCount = setInterval(() => {
        time--;
        if (time< 1){
          this.setData({
            isnew: false,
            countTime: 60
          });
          clearInterval(timeCount)
        }else{
          this.setData({
            countTime: time
          });
        }
      }, 1000)
    }
  },
  inputValue(e) {
    var value = e.detail.value;
    // var cursor = value.length + 1;
    this.setData({
      value: value
      // cursor: cursor
    });
    if (value.length == 4) {
      this.onBlur()
    }
  },
  //页面跳转
  toUrl(e) {
    var url = e.currentTarget.dataset.url;
    navigateTo({
      url: url
    });
  },
  getcodeImg(e) {
    var img_code = e.detail.value;
    this.setData({
      img_code: img_code
    })
  },
  // 获取短信验证码
  async getcodeFn() {
    const _sid = wxGet('_sid');
    const { phone, img_code } = this.data;

    var that = this;
    if (this.data.getCode) {
      let time = wxGet('time');
      if (time) {
        if (time != new Date().toLocaleDateString()) {
          wx.removeStorage({
            key: 'time',
          });
          wx.removeStorage({
            key: 'count',
          });
        }
      }

      var count = wxGet('count') || 1;
      if (count == 1) {
        wxSet('time', new Date().toLocaleDateString())
      }
      if (count > 5 && !this.data.modalOpened) {
        wx.hideLoading();
        this.setData({
          modalOpened: true,
          imgUrl: this.data.baseUrl + '/juewei-api/user/captcha?_sid=' + _sid + '&s=' + (new Date()).getTime()
        });
        return
      }
      var data = {
        _sid,
        phone,
        img_code
      };
      let code = await sendCode(data);
      if (code.code == 0 && code.msg == 'OK') {
        wxSet('count', count + 1);
        this.setData({
          modalOpened: false,
          img_code: ''
        })
        // 成功
      } else {
        that.setData({
          imgUrl: this.data.baseUrl + '/juewei-api/user/captcha?_sid=' + _sid + '&s=' + (new Date()).getTime()
        });
        $Toast({
          content: code.msg
        })
      }
    }
  },
});