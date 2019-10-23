import { baseUrl, imageUrl, wxGet, wxSet } from '../../common/js/baseUrl'
import { loginByPhone, sendCode } from '../../common/js/login'
import { navigateTo } from '../../common/js/router.js'

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
    cursor: 0,
    timestamp: 0, //当前时间戳
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    const _sid = wxGet('_sid');
    this.setData({
      phone: e.phone,
      _sid
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
    if (this.data.timestamp !== 0) {
      let timestampNew = new Date().getTime();
      let counts = parseInt((timestampNew - this.data.timestamp) / 1000);
      console.log(counts);
      if (counts > 0) {
        this.setData({
          countTime: this.data.countTime - counts
        })
      } else {
        this.setData({
          isnew: true,
          countTime: 60,
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let timestamp = new Date().getTime();
    this.setData({
      timestamp,
      countTime: this.data.countTime
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 页面被关闭
    this.setData({
      isnew: false,
      countTime: 60,
    });
    clearInterval(timeCount)
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
      wxSet('userInfo',res.data);
      wxSet('user_id', res.data.user_id);
      wx.navigateBack({
        delta: 2
      })
    } else {
      // 其他
      wx.showToast({
        icon: 'none',
        title: res.msg
      });
    }

  },
  // 倒计时60
  timeDate(e) {
    this.setData({
      isnew: true,
    });
    if (e && e.currentTarget.dataset.is == 1) {
      this.getcodeFn()
    }
    var time = this.data.countTime;
    timeCount = setInterval(() => {
      time--;
      this.setData({
        countTime: time
      });
      if (time == 0) {
        this.setData({
          isnew: false,
          countTime: 60
        });
        clearInterval(timeCount)
      }
    }, 1000)
  },
  inputValue(e) {
    var value = e.detail.value;
    var cursor = value.length + 1;
    this.setData({
      value: value,
      cursor: cursor
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
        wx.showToast({
          icon: 'none',
          duration: 2000,
          title: code.msg
        });
      }
    }
  },
});