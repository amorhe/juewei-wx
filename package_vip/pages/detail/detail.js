// package_vip/pages/detail/detail.js

import { isloginFn, log, MODAL, parseData } from '../../../pages/common/js/utils'
import { imageUrl2, wxGet } from '../../../pages/common/js/baseUrl'
import { upformId } from '../../../pages/common/js/time'
import Request from "../../../pages/common/js/li-ajax";
const {
  $Toast
} = require('../../../iview-weapp/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl2,
    content: '',
    detail: {},
    isClick: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(e) {
    const { id } = e;
    this.setData({ id })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    const { id } = this.data;
    await this.getDetail(id)
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
  /**
   * @function 获取当商品面详情
   */
  async getDetail(id) {
    let { code, data: { goods_name, exchange_intro, intro, start_time, end_time, ...Data } } = await Request.reqDetail({ id });
    if (code === 100) {
      parseData({ bindName: '_exchange_intro', html: exchange_intro, target: this });
      parseData({ bindName: '_intro', html: intro, target: this });
      wx.setNavigationBarTitle({
        title: '商品详情',
      });
      start_time = start_time.split(' ')[0];
      end_time = end_time.split(' ')[0];
      this.setData({
        detail: {
          intro,
          exchange_intro,
          goods_name,
          end_time,
          start_time,
          ...Data
        }
      })
    }
  },

  /**
   * @function 创建订单
   */
  async createOrder() {
    let { id, exchange_type, point, amount } = this.data.detail;

    let params = {
      'goods[goods_id]': id,
      'goods[exchange_type]': exchange_type,
      'goods[point]': point,
      'goods[amount]': amount,
      'pay_type': 8
    };
    let { code, data, msg } = await Request.reqCreateOrder(params);
    if (code === 100) {
      return data
    }
    if (code !== 100) {
      $Toast({ content: msg });
      return {}
    }
  },

  /**
   * @function 确认订单
   */

  async confirmOrder(order_sn) {
    let params = { order_sn };
    let { code, data } = await Request.reqConfirmOrder(params);
    return code === 100
  },

  /**
   * @function 支付订单
   */
  async pay(order_no) {
    let { code, data } = await Request.reqPay({ order_no });
    return { code, data }
  },

  /**
   *@function 确认兑换
   */

  async onModalClick() {
    let that = this;
    // goods_type	是	int	订单类型 1 虚拟订单 2 实物订单
    // receive_type	是	int	发货方式 0 无需发货 1 到店领取 2公司邮寄
    // goods_detail_type	是	int	物品详细类型 1 优惠券 2兑换码 3官方商品 4非官方商品
    const { goods_detail_type, receive_type, goods_type, amount } = this.data.detail;
    let fail = false;
    // 虚拟商品，点击兑换按钮，调用创建订单接口，
    // 有钱的订单或者有运费的订单才调起支付
    // 调用确认订单接口，然后调起支付
    // id = -1 兑换失败
    // 虚拟物品
    if (!this.data.isClick) {
      return
    }
    this.setData({
      isClick: false
    });
    //虚拟商品
    if (goods_type == 1) {
      let { order_id = '', order_sn } = await this.createOrder();
      if (!order_id) {
        this.setData({
          isClick: true
        });
        return
      }
      let res = await this.confirmOrder(order_sn);
      if (amount != 0) {

        let res = await this.pay(order_sn);
        console.log('amount', res);
        if (res.code == 0) {
          wx.requestPayment({
            ...res.data,
            success: res => {
              // 用户支付成功
              return wx.redirectTo({
                url: '../finish/finish?id=' + order_id + '&fail=' + false
              });
            },
            fail: conf => {
              log('fail');
              if (conf.errMsg.indexOf('cancel') != -1) {
                // 取消支付
                return wx.redirectTo({
                  url: '../exchangelist/exchangedetail/exchangedetail?id=' + order_id
                });
              }
              return wx.redirectTo({
                url: '../finish/finish?id=' + order_id + '&fail=' + true
              });

            }
          });
        } else {
          that.setData({
            isClick: true
          });
          return $Toast({ content: res.msg });
        }
        return
      }

      if (!res) {
        fail = true
      }
      this.setData({
        isClick: true
      });
      // 虚拟订单 + 兑换码 => 无需发货
      //
      if (goods_detail_type == 2 && receive_type == 0) {
        wx.navigateTo({
          url: '../finish/finish?id=' + order_id + '&fail=' + fail
        });
      }
      // 虚拟订单 + 优惠卷 => 无需发货
      // 跑通
      if (goods_detail_type == 1 && receive_type == 0) {
        wx.navigateTo({
          url: '../finish/finish?id=' + order_id + '&fail=' + fail
        });
      }
    }

    // 实物商品，
    // 点击兑换按钮，
    // 调用创建订单接口，
    // 填写页面表单信息，
    // 然后点击支付按钮，
    // 调用确认订单接口，
    // 然后调起支付
    if (goods_type == 2) {
      let res = await this.createOrder();
      this.setData({
        isClick: true
      });
      if (!res.order_sn) {
        return
      }
      // 实物订单  公司邮寄

      if (receive_type == 2) {
        wx.navigateTo({
          url: '../waitpay/waitpay?order_sn=' + res.order_sn
        });
      }
      // 实物订单  到店领取
      if (receive_type == 1) {
        wx.navigateTo({
          url: '../waitpay/waitpay?order_sn=' + res.order_sn
        });
      }
    }
  },

  /**
   * @function 显示modal，立即兑换
   */

  async FUN_showConfirm() {
    let { user_id } = wxGet('userInfo');
    if (!user_id) {
      return isloginFn()
    }

    let { goods_name, point } = this.data.detail;

    // 获取 用户 积分
    let points = await this.getUserPoint();

    if (points >= point) {
      MODAL({
        title: '',
        content: `是否兑换“${ goods_name }”将消耗你的${ point }积分`,
        confirmText: '确定',
        confirm: this.onModalClick,
        cancelText: '取消',
      })
    } else {
      MODAL({
        title: '',
        content: `您的当前积分不足`,
        confirmText: '赚积分',
        confirm: this.getMorePoint,
        cancelText: '取消',
      })
    }
  },

  /**
   * @function 赚积分
   */
  async getMorePoint() {
    wx.redirectTo({
      url: '/pages/home/goodslist/goodslist'
    });
  },


  /**
   * @function 获取用户积分
   */
  async getUserPoint() {
    let res = await Request.reqUserPoint();
    if (res.CODE === 'A100') {
      return res.DATA.points
    }
  },
  onSubmit(e) {
    upformId(e.detail.formId);
  },

  isloginFn

});
