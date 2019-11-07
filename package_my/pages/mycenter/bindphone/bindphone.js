import {
  sendCode
} from '../../../../pages/common/js/login'
import {
  checkPhoneCode,
  resetPhone
} from '../../../../pages/common/js/my'
import {
  wxGet
} from '../../../../pages/common/js/baseUrl.js'
import {
  navigateTo
} from '../../../../pages/common/js/router.js'
let timeCount;
const {
  $Toast
} = require('../../../../iview-weapp/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    value: '',
    type: '1',
    phone: '',
    countTime: 60,
    isnew: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var _sid = wxGet('_sid');
    this.setData({
      phone: e.phone,
      type: e.type,
      _sid: _sid
    })
    this.eveTimeDate()
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      focus:false
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
  // 倒计时60
  eveTimeDate(e) {
    var that = this
    clearInterval(timeCount)
    that.setData({
      isnew: true,
      countTime: 60,
    })
    this.sendCodeFN()
    var time = 60
    timeCount = setInterval(function () {
      time--
      that.setData({
        countTime: time
      })
      if (time == 0) {
        that.setData({
          isnew: false
        })
        clearInterval(timeCount)
      }
    }, 1000)
  },
  sendCodeFN() {
    var data = {
      _sid: this.data._sid,
      phone: this.data.phone
    }
    sendCode(data).then(res => {

    })
  },
  eveBindFocus() {
    // blur 事件和这个冲突
    console.log(this.data.focus)
    setTimeout(() => {
      this.onFocus();
    }, 100);
  },
  inputValue(e) {
    var value = e.detail.value
    this.setData({
      value: value
    })
  },
  //页面跳转
  eveBindphone(e) {
    var that = this
    if (that.data.type == 1) {
      checkPhoneCode(this.data._sid, this.data.phone, this.data.value).then(res => {
        if (res.code == 0) {
          navigateTo({
            url: "/package_my/pages/mycenter/newphone/newphone?sid=" + that.data._sid
          });
        } else {
          $Toast({
            content: res.msg
          });
        }
      })
    } else {
      resetPhone(this.data._sid, this.data.phone, this.data.value).then(res => {
        if (res.code == 0) {
          wx.navigateBack({
            delta: 4
          })
        } else {
          $Toast({
            content: res.msg
          });
        }
      })
    }
  },
})