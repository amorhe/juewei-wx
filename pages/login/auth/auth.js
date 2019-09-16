import { baseUrl, imageUrl, wxGet, wxSet } from '../../common/js/baseUrl'
import { decryptPhone, loginByQuick, sendCode, WX_LOGIN } from '../../common/js/login'
import { upformId } from '../../common/js/time'
import { navigateTo } from '../../common/js/router.js'
import { reLaunch } from "../../common/js/router";

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
    imgUrl: ''
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
    WX_LOGIN()
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
    const phone = e.detail.value;
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
      wx.showToast({
        icon: 'none',
        title: '图片验证码不可为空'
      });
      return
    }
    this.getcodeFn()
  },
  // 获取短信验证码
  async getcodeFn() {
    const { getCode, phone, img_code } = this.data;
    if (/^1\d{10}$/.test(this.data.phone)) {
    } else {
      wx.showToast({
        icon: 'none',
        title: '请输入有效手机号',
      });
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

      let count = wxGet('count') || 0;
      if (count === 0) {
        wxSet('time', new Date().toLocaleDateString())
      }
      if (count >= 5 && !this.data.modalOpened) {
        wx.hideLoading();
        this.setData({
          modalOpened: true,
          imgUrl: this.data.baseUrl + '/juewei-api/user/captcha?_sid=' + this.data._sid + '&s=' + (new Date()).getTime()
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
        wxSet('count', new Date().count - '' + 1);
        this.setData({
          modalOpened: false,
          img_code: ''
        });
        wx.hideLoading();
        wx.showToast({
          title: '短信发送成功'
        });
        navigateTo({
          url: '/pages/login/verifycode/verifycode?phone=' + data.phone
        });
      } else {
        this.setData({
          imgUrl: this.data.baseUrl + '/juewei-api/user/captcha?_sid=' + this.data._sid + '&s=' + (new Date()).getTime()
        });
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '短信发送失败',
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
    console.log(e);
    const { encryptedData, iv } = e.detail;
    const _sid = wxGet('_sid');
    const rest = wxGet('rest');
    let { code, data: { phone } } = await decryptPhone({ encryptedData, iv, _sid });
    if (code === 0) {
      let res = await loginByQuick({ _sid, ...rest, encryptedData, iv });
      console.log('微信快捷登录登录成功', res);
      if (res.code === 0) {
        res.data.sex = res.data.sex == 0 ? 1 : 0;
        wxSet('userInfo', { ...rest, ...res.data });
        reLaunch({ url: '/pages/my/index/index' })
      } else {
        wx.showToast({ title: res.msg })
      }
    }
  },
  // 页面跳转
  toUrl(e) {
    const { url } = e.currentTarget.dataset;
    navigateTo({
      url: url
    });
  },
  // 上传模板消息
  onSubmit(e) {
    upformId(e.detail.formId);
  }
});