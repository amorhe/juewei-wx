import {
  imageUrl,
  baseUrl,
  wxGet,
  wxSet
} from '../../common/js/baseUrl'
import {
  sendCode,
  captcha,
  loginByAliUid,
  loginByAuth,
  getuserInfo,
  decryptPhone
} from '../../common/js/login'
import {
  upformId
} from '../../common/js/time'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    baseUrl,
    modalOpened: false,
    getCode: false,
    phone: '',
    img_code: '',
    imgUrl: ''
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
    this.getAliId()
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
  openModal() {
    this.setData({
      modalOpened: true,
    });
  },
  onModalClick() {
    this.setData({
      modalOpened: false,
    });
  },
  onModalClose() {
    this.setData({
      modalOpened: false,
    });
  },
  inputValue(e) {
    var phone = e.detail.value
    if (phone.length == 11) {
      this.setData({
        phone: phone,
        getCode: true
      })
    } else {
      this.setData({
        phone: phone,
        getCode: false
      })
    }
  },
  getcodeImg(e) {
    var img_code = e.detail.value
    this.setData({
      img_code: img_code
    })
  },
  getImgcodeFn() {
    if (this.data.img_code === '') {
      wx.showToast({
        icon: 'none',
        title: '图片验证码不可为空'
      });
      return
    }
    this.getcodeFn()
  },
  // 获取短信验证码
  getcodeFn() {
    var that = this
    if (/^1\d{10}$/.test(this.data.phone)) {} else {
      wx.showToast({
        icon: 'none',
        title: '请输入有效手机号',
      });
      return
    }
    wx.showLoading({
      title: '发送中...',
    });
    if (this.data.getCode) {
      var time = wxGet('time');
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

      var count = wxGet('count') || 0;
      if (count == 0) {
        wxSet('time', new Date().toLocaleDateString())
      }
      if (count >= 5 && !this.data.modalOpened) {
        wx.hideLoading();
        this.setData({
          modalOpened: true,
          imgUrl: this.data.baseUrl + '/juewei-api/user/captcha?_sid=' + this.data._sid + '&s=' + (new Date()).getTime()
        })
        return
      }
      var data = {
        _sid: this.data._sid,
        phone: this.data.phone,
        img_code: this.data.img_code
      }
      let code = sendCode(data)
      if (code.code == 0 && code.msg == 'OK') {
        wxSet('count', new Date().count - '' + 1)
        this.setData({
          modalOpened: false,
          img_code: ''
        })
        wx.hideLoading();
        wx.showToast({
          title: '短信发送成功'
        })
        wx.navigateTo({
          url: '/pages/login/verifycode/verifycode?phone=' + data.phone
        });
      } else {
        that.setData({
          imgUrl: this.data.baseUrl + '/juewei-api/user/captcha?_sid=' + this.data._sid + '&s=' + (new Date()).getTime()
        })
        wx.hideLoading();
        wx.showToast({
          title: code.msg,
          icon: 'none'
        })
      }
    }
  },
  newImg() {
    this.setData({
      modalOpened: true,
      imgUrl: this.data.baseUrl + '/juewei-api/user/captcha?_sid=' + this.data._sid + '&s=' + (new Date()).getTime()
    })
  },
  getAliId() {
    var that = this
    let ali_uid = wxGet('ali_uid');
    let _sid = wxGet('_sid');
    if (ali_uid && _sid) {
      this.setData({
        ali_uid: ali_uid,
        _sid: _sid
      })
    } else {
      wx.authorize({
        scope: 'scope.userInfo',
        success: (res) => {
          console.log(res)
          // my.setStorageSync({
          //   key: 'authCode', // 缓存数据的key
          //   data: res.authCode, // 要缓存的数据
          // });
          // wxSet('authCode', res.authCode);
          loginByAliUid(res.authCode).then((data) => {
            if (data.code == 0 && data.data.user_id) {
              wxSet('ali_uid', data.data.ali_uid);
              wxSet('_sid', data.data._sid);
              that.setData({
                ali_uid: data.data.ali_uid,
                _sid: data.data._sid
              })
            } else {
              wxSet('ali_uid', data.data.ali_uid);
              wxSet('_sid', data.data._sid);
              that.setData({
                ali_uid: data.data.ali_uid,
                _sid: data.data._sid
              })
            }
          })
        },
      });
    }
  },
  // 授权获取用户信息
  getPhoneNumber(res) {
    var that = this
    my.getPhoneNumber({
      success: (res) => {
        my.showLoading({
          content: '加载中...',
          delay: 1000,
        });

        let userInfo = JSON.parse(res.response); // 以下方的报文格式解析两层 response
        var data = {
          response: userInfo.response
        }
        decryptPhone(data).then(res => {
          if (res.code == 0) {
            that.loginByAuthFn(that.data.ali_uid, res.data.phone);
          }
        })
      },
      fail() {
        my.alert({
          title: '获取用户信息失败'
        });
      }
    });
  },
  // 授权登录
  loginByAuthFn(ali_uid, phone) {
    console.log('授权函数')
    loginByAuth(ali_uid, phone, '', '').then((res) => {
      if (res.code == 0) {
        my.setStorageSync({
          key: '_sid', // session_id
          data: res.data._sid,
        });
        my.setStorageSync({
          key: 'user_id', // 缓存数据的key
          data: res.data.user_id, // 要缓存的数据
        });
        app.globalData._sid = res.data._sid
        this.getUserInfo(res.data._sid);
      } else {
        my.showToast({
          type: 'none',
          content: res.msg,
          duration: 2000
        });
      }

    })
  },
  // 用户信息
  getUserInfo(_sid) {
    getuserInfo(_sid).then((res) => {
      app.globalData.userInfo = res.data;
      my.hideLoading();
      my.navigateBack({
        delta: 1
      })
    })
  },
  // 页面跳转
  toUrl(e) {
    var url = e.currentTarget.dataset.url
    my.navigateTo({
      url: url
    });
  },
  // 上传模板消息
  onSubmit(e) {
    upformId(e.detail.formId);
  }
})