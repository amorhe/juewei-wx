import {
  baseUrl,
  imageUrl,
  wxGet,
  wxSet
} from '../../common/js/baseUrl'
import {
  decryptPhone,
  loginByQuick,
  sendCode,
  WX_LOGIN
} from '../../common/js/login'
import {
  upformId
} from '../../common/js/time'
import {
  navigateTo
} from '../../common/js/router.js'
import {
  reLaunch,
  redirectTo
} from "../../common/js/router";
const {
  $Toast
} = require('../../../iview-weapp/base/index');
import {
  UpdatewxUserInfo
} from '../../../pages/common/js/my'; //用于登录后拿微信信息同步给后台
const app = getApp();
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
    imgUrl: '',
    next: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      next: options.next
    })
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
    WX_LOGIN();
    if (this.data.phone.length > 0) {
      let obj = {
        detail: {
          value: this.data.phone
        }
      }
      this.inputValue(obj)
    }
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
    let phone = e.detail.value;
    if (phone.length === 11) {
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
    var img_code = e.detail.value;
    this.setData({
      img_code: img_code
    })
  },
  getImgcodeFn() {
    if (this.data.img_code === '') {
      $Toast({
        content: '图片验证码不可为空'
      });
      return
    }
    this.getcodeFn()
  },
  // 获取短信验证码
  async getcodeFn() {
    const {
      getCode,
      phone,
      img_code
    } = this.data;
    if (/^1\d{10}$/.test(this.data.phone)) {} else {
      $Toast({
        content: '请输入有效手机号'
      })
      return
    }
    wx.showLoading({
      title: '发送中...',
    });
    if (getCode) {
      let time = wxGet('time');
      if (time) {
        if (time !== new Date().toLocaleDateString()) {
          wx.removeStorage({
            key: 'time',
          });
          wx.removeStorage({
            key: 'count',
          });
        }
      }

      let count = wxGet('count') || 1;
      if (count === 1) {
        wxSet('time', new Date().toLocaleDateString())
      }
      if (count > 5 && !this.data.modalOpened) {
        wx.hideLoading();
        this.setData({
          modalOpened: true,
          imgUrl: this.data.baseUrl + '/juewei-api/user/captcha?_sid=' + wxGet('_sid') + '&s=' + (new Date()).getTime()
        });
        return
      }
      let data = {
        _sid: wxGet('_sid'),
        phone,
        img_code
      };
      let res = await sendCode(data);
      if (res.code === 0 && res.msg === 'OK') {
        wxSet('count', count + 1);
        this.setData({
          modalOpened: false,
          img_code: ''
        });
        wx.hideLoading();
        $Toast({
          content: '短信发送成功'
        })
        redirectTo({
          url: '/pages/login/verifycode/verifycode?phone=' + data.phone + '&next=' + this.data.next
        });
      } else {
        this.setData({
          imgUrl: this.data.baseUrl + '/juewei-api/user/captcha?_sid=' + wxGet('_sid') + '&s=' + (new Date()).getTime()
        });
        wx.hideLoading();
        $Toast({
          content: res.msg
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
  // 授权获取用户信息
  async getPhoneNumber(e) {
    if (e.detail.errMsg.indexOf('fail') != -1) {
      $Toast({
        content: '您点击了拒绝授权，将无法登录，请允许授权！'
      })
      return
    }
    const {
      encryptedData,
      iv
    } = e.detail;
    const _sid = wxGet('_sid');
    if (!_sid) { //如果sid没有的情况需要重新获取
      WX_LOGIN();
      return;
    }
    const rest = wxGet('rest');
    let {
      code,
      data: {
        phone
      }
    } = await decryptPhone({
      encryptedData,
      iv,
      _sid
    });
    if (code === 0) {
      let res = await loginByQuick({
        _sid,
        ...rest,
        encryptedData,
        iv
      });
      if (res.code === 0) {
        if (app.globalData.avatarUrl && app.globalData.avatarUrl != '') {
          res.data.head_img = app.globalData.avatarUrl;
        }
        if (app.globalData.nickName && app.globalData.nickName != '') {
          res.data.nick_name = app.globalData.nickName;
        }
        wxSet('userInfo', { ...rest,
          ...res.data
        });
        wxSet('user_id', res.data.user_id);

        //如果能获得就传给后台更新
        if (app.globalData.nickName && app.globalData.nickName != '') {
          UpdatewxUserInfo({
            _sid: res.data._sid,
            head_img: app.globalData.avatarUrl,
            nick_name: app.globalData.nickName
          }).then(r => {
            //r不做任何处理
            res.data.head_img = app.globalData.avatarUrl;
            res.data.nick_name = app.globalData.nickName;
            wxSet('userInfo', { ...rest,
              ...res.data
            });
            //快捷登录 后退到前一个页面
            if(this.data.next){
              redirectTo({
                url: '/pages/home/orderform/orderform'
              })
              return
            }
            wx.navigateBack({
              delta: 1
            })
          })
        } else {
          app.globalData.nickName = res.data.nick_name;
          app.globalData.avatarUrl = res.data.head_img;
          if (this.data.next) {
            redirectTo({
              url: '/pages/home/orderform/orderform'
            })
            return
          }
          //快捷登录 后退到前一个页面
          wx.navigateBack({
            delta: 1
          })
        }
      } else {
        $Toast({
          content: res.msg
        })
      }
    } else {
      $Toast({
        content: '微信快捷登录失败'
      })
    }
  },
  // 页面跳转
  toUrl(e) {
    const {
      url
    } = e.currentTarget.dataset;
    navigateTo({
      url: url
    });
  },
  // 上传模板消息
  onSubmit(e) {
    upformId(e.detail.formId);
  }
});