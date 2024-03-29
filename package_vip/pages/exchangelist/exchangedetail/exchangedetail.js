// package_vip/pages/exchangelist/exchangedetail/exchangedetail.js

import {
  baseUrl,
  imageUrl,
  imageUrl2,
  wxGet
} from '../../../../pages/common/js/baseUrl'
import {
  event_getNavHeight,
  guide,
  handleCopy,
  log,
  MODAL,
  parseData,
  contact
} from '../../../../pages/common/js/utils'
import Request from "../../../../pages/common/js/li-ajax";
import {
  navigateBack,
  navigateTo,
  reLaunch
} from "../../../../pages/common/js/router";
const {
  $Toast
} = require('../../../../iview-weapp/base/index');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    imageUrl2,
    fail: false,
    open1: false,
    open2: false,
    cancleShow: false,


    time: '',
    overdue:false,

    cancelReasonList: [{
        reason: '下错单/临时不想要了',
        value: true
      },
      {
        reason: '信息填写错误，重新下单',
        value: false
      },
      {
        reason: '其他',
        value: false
      },
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(e) {
    const {
      id
    } = e;
    let navHeight = await event_getNavHeight();
    this.setData({
      navHeight,
      id
    }, async() => {
      await this.getOrderDetail(id);
      this.eventReduceTime()
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
  onShow: async function() {},

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
  /**
   * @function 获取订单详情
   */
  async getOrderDetail(id) {
    let res = await Request.reqOrderDetail({
      id
    });
    parseData({
      bindName: '_exchange_intro',
      html: res.data.exchange_intro,
      target: this
    });
    parseData({
      bindName: '_intro',
      html: res.data.intro,
      target: this
    });

    if (res.code === 100) {
      let {
        start_time = '', end_time = '', get_start_time = '', get_end_time = '', ...rest
      } = res.data;
      this.setData({
        detail: {
          start_time: start_time.split(' ')[0],
          end_time: end_time.split(' ')[0],

          get_start_time: get_start_time.split(' ')[0],
          get_end_time: get_end_time.split(' ')[0],
          ...rest
        },
      });
    }
  },

  /**
   * @function 递归时间
   */

  eventReduceTime() {
    let {
      detail
    } = this.data;
    let {
      remaining_pay_minute,
      remaining_pay_second,
      overdue,
      way,
      ...item
    } = detail || {
      remaining_pay_minute: -1,
      remaining_pay_second: -1
    };
    --remaining_pay_second;
    if (remaining_pay_minute === 0 && remaining_pay_second == -1) {

    }
    if (remaining_pay_second <= 0) {
      --remaining_pay_minute;
      remaining_pay_second = 59
    }
    let bol = false;
    if (overdue == 1 || way == ''){
      bol = true
    }else{
      bol = false
    }
    this.setData({
      detail: { ...item,
        remaining_pay_second,
        remaining_pay_minute,
        way
      },
      overdue: bol
    });
    setTimeout(() => {
      this.eventReduceTime();
    }, 1000)
  },

  /**
   * @function 取消订单
   */

  async doCancelOrder() {
    const {
      order_sn
    } = this.data.detail;
    let res = await Request.reqCancelOrder({
      order_sn
    });
    if (res.code === 100) {
      app.globalData.refresh = true;
      $Toast({
        content: '取消成功',
      });

      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 1000)

    }
  },

  /**
   * @function 创建订单
   */
  async createOrder() {
    let {
      goods_id,
      exchange_type,
      order_point,
      order_amount
    } = this.data.detail;

    let params = {
      'goods[goods_id]': goods_id,
      'goods[exchange_type]': exchange_type,
      'goods[point]': order_point,
      'goods[amount]': order_amount * 100,
      'pay_type': 8
    };
    let {
      code,
      data,
      msg
    } = await Request.reqCreateOrder(params);
    if (code === 100) {
      return data
    }
    if (code !== 100) {
      wx.alert({
        title: msg
      });
      return {}
    }
  },

  /**
   * @function 确认订单
   */

  async confirmOrder(order_sn) {
    let params = {
      order_sn
    };
    let {
      code,
      data
    } = await Request.reqConfirmOrder(params);
    return code === 100
  },

  /**
   * @function 支付订单
   */
  async pay(order_no) {
    log(order_no);
    let {
      code,
      data
    } = await Request.reqPay({
      order_no
    });
    return {
      code,
      data
    }
  },

  /**
   * @function 立即支付
   */

  async payNow() {
    let {
      order_sn,
      id,
      shop_id,
      shop_name,
      order_amount,
      receive_type,
      user_address_phone,
      user_address_name,
      province,
      city,
      district,
      user_address_id,
      user_address_address,
      user_address_detail_address
    } = this.data.detail;
    // 校验订单 地址信息
    // receive_type 发货方式 0 无需发货 1 到店领取 2公司邮寄
    console.log(receive_type, user_address_phone, this.data.detail);
    if (receive_type == 2 || receive_type == 1) {
      return wx.navigateTo({
        url: '/package_vip/pages/waitpay/waitpay?' +
          'order_sn=' + order_sn +
          '&shop_id=' + shop_id +
          '&shop_name=' + shop_name +
          '&user_address_name=' + user_address_name +
          '&user_address_phone=' + user_address_phone +
          '&user_address_address=' + user_address_address +
          '&user_address_id=' + user_address_id +
          '&user_address_detail_address=' + user_address_detail_address +
          '&province=' + (province || '') +
          '&city=' + (city || '') +
          '&district=' + (district || '')
      });
    }
    // 虚拟商品无需发货
    if (receive_type == 0) {
      // let { order_id = '', order_sn } = await this.createOrder()
      // if (!order_id) { return }
      // let res = await this.confirmOrder(order_sn)
      if (order_amount != 0) {
        let res = await this.pay(order_sn);
        if (res.code == 0) {
          wx.requestPayment({
            ...res.data,
            success: res => {
              log('s', res);
              // 用户支付成功
              return wx.redirectTo({
                url: '../../finish/finish?id=' + id + '&fail=' + false
              });
            },
            fail: res => {
              // log('fail');
              // return wx.redirectTo({
              //   url: '../../finish/finish?id=' + id + '&fail=' + true
              // });
            }
          });
        } else {
          return $Toast({
            content: res.msg,
          });
        }
        return
      }

      if (!res) {
        fail = true
      }
      // 虚拟订单 + 兑换码 => 无需发货
      //
      if (goods_detail_type == 2 && receive_type == 0) {
        navigateTo({
          url: '../../finish/finish?id=' + id + '&fail=' + fail
        });
      }

      // 虚拟订单 + 优惠卷 => 无需发货
      // 跑通
      if (goods_detail_type == 1 && receive_type == 0) {
        navigateTo({
          url: '../../finish/finish?id=' + order_id + '&fail=' + fail
        });
      }
    }
  },

  /**
   * @function 使用优惠卷
   */
  async toUse() {
    const {
      way
    } = this.data.detail;
    // way:用途 1:外卖专享 2:门店专享 3:全场通用
    switch (way - 0) {
      case 1:
      case 3:
        MODAL({
          title: '',
          content: '限时优惠，立即使用',
          cancelText: '自提',
          cancel: this.toTakeOut,
          confirmText: '外卖',
          confirm: this.toTakeIn
        });
        break;
      case 2:
        let {
          code
        } = this.data.detail;
        let _sid = wxGet('_sid');
        let codeImg = baseUrl + '/juewei-api/coupon/getQRcode?' + '_sid=' + _sid + '&code=' + code;
        log(codeImg);
        this.setData({
          open2: true,
          codeImg
        });
        break
    }
  },

  /**
   * @function 关闭弹窗
   */

  closeModel() {
    this.setData({
      open1: false,
      open2: false
    })
  },

  /**
   * @function 去自提
   */
  toTakeOut() {
    app.globalData.type = 2;
    log(app.globalData.type);
    reLaunch({
      url: '/pages/home/goodslist/goodslist'
    });
  },

  /**
   * @function 去外卖
   */
  toTakeIn() {
    app.globalData.type = 1;
    log(app.globalData.type);

    reLaunch({
      url: '/pages/home/goodslist/goodslist'
    });
  },

  /**
   * @function 核销
   */

  async wait() {
    let res = await reqWait();
    if (res.code == 0) {
      return this.closeModel()
    }

    return $Toast({
      content: res.msg,
    });
  },


  handleCopy,

  navigateBack,

  guide,

  contact

});