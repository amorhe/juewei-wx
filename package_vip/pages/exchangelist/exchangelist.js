// package_vip/pages/exchangelist/exchangelist.js
import { imageUrl, imageUrl2 } from '../../../pages/common/js/baseUrl'
import { log } from "../../../pages/common/js/utils";
import Request from "../../../pages/common/js/li-ajax";
import {navigateTo} from "../../../pages/common/js/router";

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    imageUrl2,

    finish: false,

    orderList: [],

    page_num: 1,
    page_size: 10,
    lastLage: 10,

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getOrderList(1)
    this.eventReduceTime()

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
    this.onPullDownRefresh()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.refresh = true
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
    this.reset()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    wx.showLoading({ content: '加载中...' });
    this.setData({}, async () => {
      setTimeout(async () => {
        let { page_num } = this.data;
        ++page_num;
        await this.getOrderList(page_num);
        this.setData({
          page_num
        })
      }, 300)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  reset() {
    this.setData({
      finish: false,

      orderList: [],

      page_num: 1,
      page_size: 10,
      lastLage: 10,

    }, async () => {
      await this.getOrderList(1);
      wx.stopPullDownRefresh()
    })


  },
  /**
   * @function 获取更多订单信息
   */



  /**
   * @function 获取订单列表
   */
  async getOrderList(page_num) {
    let { page_size, orderList, lastLage } = this.data;
    if (lastLage < page_num) {
      return wx.hideLoading()
    }
    let res = await Request.reqOrderList({ page_num, page_size });
    if (res.code === 100) {
      lastLage = res.data.pagination.lastLage;
      if (lastLage < page_num) {
        this.setData({
          orderList,
          finish: true
        });
        return
      }
      orderList = [...orderList, ...res.data.data];
      this.setData({
        orderList,
        finish: true,
        lastLage
      }, () => wx.hideLoading())
    }
  },

  /**
   * @function 递归时间
   */

  eventReduceTime() {
    let { orderList } = this.data;
    orderList = orderList.map(({ remaining_pay_minute = -1, remaining_pay_second = -1, ...item }) => {
      remaining_pay_second--;
      if (remaining_pay_second === 0 && remaining_pay_minute === -1) {
      }
      if (remaining_pay_second <= 0) {
        --remaining_pay_minute;
        remaining_pay_second = 59
      }
      return {
        remaining_pay_minute,
        remaining_pay_second,
        ...item,
      }
    });
    this.setData({
      orderList,
    })

    setTimeout(() => {
      this.eventReduceTime();
    }, 1000)
  },

  /**
   * @function 跳转到会员首页
   */

  switchTo() {
    wx.switchTab({
      url: '/pages/vip/index/index', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
    });
  },

  /**
   * @function 支付订单
   */
  async pay(order_sn) {
    log(order_sn);
    let { code, data } = await reqPay(order_sn);
    return { code, data }
  },


  /**
   * @function 立即支付
   */

  async payNow(e) {
    let { order_sn, id, order_amount } = e.currentTarget.dataset;
    let res = await Request.reqOrderDetail({id});
    if (res.code === 100) {
      let { id, order_amount, receive_type, user_address_phone, user_address_name, province, city, district, user_address_id, user_address_detail_address } = res.data;

      // 校验订单 地址信息
      if (receive_type == 2 || receive_type == 1) {
        if (!user_address_phone) {

          return wx.navigateTo({
            url: '/package_vip/pages/waitpay/waitpay?'
              + 'order_sn=' + order_sn
              + '&user_address_name=' + user_address_name
              + '&user_address_phone=' + user_address_phone
              + '&province=' + province
              + '&city=' + city
              + '&district=' + district
              + '&user_address_id=' + user_address_id
              + '&user_address_detail_address=' + user_address_detail_address
          });
        }
      }

      if (receive_type == 0) {
        // let { order_id = '', order_sn } = await this.createOrder()
        // if (!order_id) { return }
        // let res = await this.confirmOrder(order_sn)
        if (order_amount != 0) {
          let res = await this.pay(order_sn);
          if (res.code == 0) {
            wx.tradePay({
              tradeNO: res.data.tradeNo, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
              success: res => {
                log('s', res);
                // 用户支付成功
                if (res.resultCode == 9000) {
                  return wx.redirectTo({
                    url: '../finish/finish?id=' + order_id + '&fail=' + false
                  });
                }
                // 用户取消支付
                if (res.resultCode == 6001) {

                  // return wx.redirectTo({
                  //   url: '../exchangelist/exchangedetail/exchangedetail?id=' + order_id
                  // });
                }
              },
              fail: res => {
                log('fail');
                return wx.redirectTo({
                  url: '../finish/finish?id=' + order_id + '&fail=' + true
                });
              }
            });
          } else {
            return wx.showToast({ content: res.msg });
          }
          return
        }

        if (!res) {
          fail = true
        }
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
    }

  },
  navigateTo
});