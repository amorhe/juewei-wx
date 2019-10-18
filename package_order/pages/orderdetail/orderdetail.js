// package_order/pages/orderdetail/orderdetail.js
import {
  imageUrl,
  imageUrl2,
  imageUrl3,
  img_url
} from '../../../pages/common/js/baseUrl'
import {
  contact,
  guide,
  handleCopy,
  log
} from "../../../pages/common/js/utils";
import Request from "../../../pages/common/js/li-ajax";
import {
  reLaunch
} from "../../../pages/common/js/router";
import {
  payment
} from "../../../pages/common/js/home.js"
import {
  add_lng_lat
} from "../../../pages/common/js/home";

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    imageUrl2,
    imageUrl3,
    img_url,
    showTop: false,
    cancleShow: false,
    orderState: [],

    takeOutState: [
      '等待支付',
      '订单已提交',
      '商家已接单',
      '骑手已取餐',
      '订单已完成',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '骑手已接单',
    ],

    pickUpState: [
      '等待支付',
      '等待接单',
      '商家已接单',
      '等待取餐',
      '订单已完成',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消'
    ],

    cancelReasonList: [{
      reason: '下错单/临时不想要了',
      value: true,
      cancel_code: 9
    },
      {
        reason: '订单长时间未分配骑手',
        value: false,
        cancel_code: 1
      },
      {
        reason: '门店商品缺货/无法出货/已售完',
        value: false,
        cancel_code: 4
      },
      {
        reason: '联系不上门店/门店关门了',
        value: false,
        cancel_code: 5
      },
      {
        reason: '其他',
        value: false,
        cancel_code: 0
      },
    ],

    curOrderState: [],

    payTypes: {
      1: '微信公众号',
      2: '支付页面',
      3: '银联',
      4: '微信扫码',
      5: '支付宝扫码',
      6: '现金',
      7: '支付宝付款码',
      8: '微信小程序支付',
      9: '微信付款码',
      10: '统一下单方式',
      11: '支付宝小程序'
    },

    postWay: {
      FNPS: '蜂鸟配送',
      MTPS: '美团配送',
      ZPS: '自配送'
    },

    timeArr: [],

    payStatusList: [],
    d: {},
    dis_type: -1,
    order_channel: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let {
      order_no
    } = e;
    this.setData({
      order_no
    });
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
  onShow: async function () {
    await this.getOrderDetail()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.time);
    this.setData({
      time: -1
    });
    this.closeModel()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.time);
    this.setData({
      time: -1
    });
    this.setData = () => {
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    await this.getOrderDetail()
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

  contact,
  handleCopy,
  guide,

  closeModel() {
    this.setData({
      showTop: false,
      cancleShow: false
    })

  },

  /**
   * @function 获取订单详情
   */
  async getOrderDetail() {
    let {
      curOrderState,
      order_no
    } = this.data;
    let res = await Request.orderDetail({
      order_no
    });

    let timeArr;
    let {
      order_ctime,
      pay_time,
      get_time,
      dis_get_time,
      dis_take_time,
      push_time,
      dis_finish_time,
      cancel_time,
      dis_type,
      dis_tag,
      order_status_info
    } = res.data;
    if (res.code === 0) {
      // 订单类型  1"官方外卖", 2"门店自取" // 配送方式 1配送  2 自提
      if (dis_type == 1) {
        // //显示状态和时间的语句
        // 1） 待支付，时间：data.order_ctime      //创建时间
        // 2） 待取餐，时间：data.pay_time         //支付时间
        // 3） 门店已接单，时间：data.push_time         //门店接单时间
        // 4） 配送已接单，时间：data.dis_get_time     //物流接单时间
        // 5） 骑手配送中，时间：data.dis_take_time    //配送员取货时间
        // 6） 订单已完成，时间：data.dis_finish_time  //送达时间
        // 7） 订单已取消，时间：data.cancel_time      //取消时间
        timeArr = [{
          state: '等待支付',
          time: order_ctime
        },
          {
            state: '订单已提交',
            time: pay_time
          },
          {
            state: '商家已接单',
            time: push_time
          },
          {
            state: '骑手已接单',
            time: dis_get_time
          },
          {
            state: '骑手已取餐',
            time: dis_take_time
          },
          {
            state: '订单已完成',
            time: dis_finish_time
          },
          {
            state: '订单已取消',
            time: cancel_time
          },
        ];

        timeArr = timeArr.map(({
                                 state,
                                 time
                               }) => ({
          state,
          time: time.split(' ')[1]
        }));
        // log(timeArr)
        // data.order_status_info.order_status
        // 外卖显示数组
        // 0，等待支付   1
        // 1，支付成功   1,2
        // 2，商家接单/商家已确认 1,2,3
        // 3，正在配送/配送中    1,2,3,4,(判断5的时间是否存在，如果有显示5)
        // 4，确认收货/已送到/完成 1,2,3,4,5,6
        // 5，用户取消   1,7
        // 6，自动取消   1,7
        // 7，后台客服退单 1,2,7
        // 8，后台审核退单成功 1,7
        // 9，达达主动发起取消订单，1,2,3,7
        // 10：店pos取消 1,2,7

        let orderStatus = [{
          state: '等待支付',
          timeArr: [1]
        },
          {
            state: '支付成功',
            timeArr: [1, 2]
          },
          {
            state: '商家接单/商家已确认',
            timeArr: [1, 2, 3]
          },
          {
            state: '正在配送/配送中',
            timeArr: [1, 2, 3, 4]
          },
          {
            state: '确认收货/已送到/完成',
            timeArr: [1, 2, 3, 4, 5, 6]
          },
          {
            state: '用户取消',
            timeArr: [1, 7]
          },
          {
            state: '自动取消',
            timeArr: [1, 7]
          },
          {
            state: '后台客服退单',
            timeArr: [1, 2, 7]
          },
          {
            state: '后台审核退单成功',
            timeArr: [1, 7]
          },
          {
            state: '达达主动发起取消订单',
            timeArr: [1, 2, 3, 7]
          },
          {
            state: '店pos取消',
            timeArr: [1, 2, 7]
          },
        ];


        let curState = res.data.order_status_info.order_status;
        let curTimeArr = orderStatus[curState].timeArr;
        // 自配送 没有骑手已接单
        if (curState < 5 && curState > 2) {
          dis_tag != 'ZPS' ? curTimeArr : (curTimeArr.splice(curTimeArr.findIndex(item => item == 4), 1));

        }

        (curState == 2 && order_status_info.dis_status == 2 && dis_tag != 'ZPS' && dis_get_time) ? curTimeArr.push(4) : curTimeArr;
        curState === 3 && dis_take_time != '0000-00-00 00:00:00' ? curTimeArr.push(5) : curTimeArr;
        curOrderState = curTimeArr.map(item => timeArr[item - 1])

      }

      if (dis_type == 2) {
        // //显示状态和时间的语句
        // 1） 待支付，时间：data.order_ctime      //创建时间
        // 2） 待取餐，时间：data.pay_time         //支付时间
        // 6） 订单已完成，时间：data.dis_finish_time  //送达时间
        // 7） 订单已取消，时间：data.cancel_time      //取消时间
        timeArr = [{
          state: '等待支付',
          time: order_ctime
        },
          {
            state: '待取餐',
            time: pay_time
          },
          {
            state: '商家已接单',
            time: push_time
          },
          {
            state: '配送已接单',
            time: dis_get_time
          },
          {
            state: '骑手配送中',
            time: dis_take_time
          },
          {
            state: '订单已完成',
            time: dis_finish_time
          },
          {
            state: '订单已取消',
            time: cancel_time
          },
        ];
        timeArr = timeArr.map(({
                                 state,
                                 time
                               }) => ({
          state,
          time: time.split(' ')[1]
        }));
        log(timeArr);
        // 自提显示数组
        // 0，等待支付 1
        // 1，支付成功 1,2
        // 2，商家接单/商家已确认 1,2
        // 3，正在配送/配送中 1,2
        // 4，确认收货/已送到/完成  1,2，6
        // 5，用户取消  1,7
        // 6，自动取消  1,7
        // 7，后台客服退单   1,2，7
        // 8，后台审核退单成功   1,2，7
        // 9，达达主动发起取消订单 1,2，7
        // 10：店pos取消   1,2，7

        let orderStatus = [{
          state: '等待支付',
          timeArr: [1]
        },
          {
            state: '支付成功',
            timeArr: [1, 2]
          },
          {
            state: '商家接单/商家已确认',
            timeArr: [1, 2, 3]
          },
          {
            state: '正在配送/配送中',
            timeArr: [1, 2, 3]
          },
          {
            state: '确认收货/已送到/完成',
            timeArr: [1, 3, 2, 6]
          },
          {
            state: '用户取消',
            timeArr: [1, 7]
          },
          {
            state: '自动取消',
            timeArr: [1, 7]
          },
          {
            state: '后台客服退单',
            timeArr: [1, 2, 7]
          },
          {
            state: '后台审核退单成功',
            timeArr: [1, 2, 7]
          },
          {
            state: '达达主动发起取消订单',
            timeArr: [1, 2, 7]
          },
          {
            state: '店pos取消',
            timeArr: [1, 2, 7]
          },
        ];

        let curState = res.data.order_status_info.order_status;
        let curTimeArr = orderStatus[curState].timeArr;

        curOrderState = curTimeArr.map(item => timeArr[item - 1])

      }

      this.setData({
        d: res.data,
        timeArr,
        curOrderState,
        dis_type,
        order_channel: res.data.channel
      }, () => wx.stopPullDownRefresh())
    }
  },

  /**
   * @function 递归时间
   */

  eventReduceTime() {
    let {
      d
    } = this.data;
    let {
      remaining_pay_minute,
      remaining_pay_second,
      ...item
    } = d;
    --remaining_pay_second;
    if (remaining_pay_minute === 0 && remaining_pay_second == -1) {

    }
    if (remaining_pay_second <= 0) {
      --remaining_pay_minute;
      remaining_pay_second = 59
    }
    this.setData({
      d: {
        ...item,
        remaining_pay_second,
        remaining_pay_minute
      },
    });
    setTimeout(() => {
      this.eventReduceTime();
    }, 1000)
  },

  FUN_SHOW() {
    this.setData({
      showTop: true
    })
  },

  /**
   * @ 显示选择原因
   */

  showCancel() {
    if (this.data.order_channel == 1) {
      wx.showToast({
        icon: "none",
        title: '订单不支持跨平台操作，请去相应平台取消订单！'
      });
      return
    }
    this.setData({
      cancleShow: true
    })
  },

  /**
   * @function 选择原因
   */

  selectReason(e) {
    const {
      cancelReasonList
    } = this.data;
    const {
      index
    } = e.currentTarget.dataset;
    cancelReasonList.forEach(item => item.value = false);
    cancelReasonList[index].value = true;

    this.setData({
      cancelReasonList
    })
  },

  /**
   * @function 取消订单
   */

  async FUN_cancelOrder() {
    const {
      d,
      cancelReasonList
    } = this.data;
    let cancel_code = cancelReasonList.filter(item => item.value)[0].cancel_code;
    let res = await Request.CancelOrder({
      order_no: d.order_no,
      cancel_code,
      cancel_reason: '其他'
    });
    if (res.code == 0) {
      log('取消成功');
      app.globalData.refresh = true;
      app.globalData.refresh_state = d.dis_type - 1;
      reLaunch({
        url: '/pages/order/list/list',
      });
    } else {
      this.closeModel();
      wx.showToast({
        icon: "none",
        title: res.msg,
        duration: 2000,
      });
    }

  },

  /**
   * @function 去评价页面
   */
  FUN_toComment(e) {
    const {
      order_no
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/package_order/pages/comment/comment?order_no=' + order_no
    });
  },

  /**
   * @function 立即支付
   */
  async payNow(e) {
    const {
      channel,
      shop_latitude,
      shop_longitude,
      dis_type
    } = this.data.d;
    if (channel == 1) {
      return
    }
    const {
      order_no
    } = e.currentTarget.dataset;
    let val = await payment(order_no);
    if (val.code === 0) {
      // 微信支付
      wx.requestPayment({
        timeStamp: val.data.timeStamp,
        nonceStr: val.data.nonceStr,
        package: val.data.package,
        signType: val.data.signType,
        paySign: val.data.paySign,
        success(conf) {
          let typeClass = dis_type == 1 ? '2' : '4';
          add_lng_lat(order_no, typeClass, shop_longitude, shop_latitude).then((conf) => {
            if (confs.code == 'A100') {
              redirectTo({
                url: '/pages/home/orderfinish/orderfinish?order_no=' + order_no
              });
            }
          })
        },
        fail(conf) {
          wx.removeStorageSync('goodsList');
          if (conf.errMsg.indexOf('cancel') != -1) {
            // 取消支付
          } else {
            // 支付失败
            redirectTo({
              url: '/pages/home/orderError/orderError'
            })
          }
        }
      })

    } else {
      return wx.redirectTo({
        url: '/pages/home/orderError/orderError?order_no=' + order_no
      });
    }
  },


  /**
   * @function 再来一单
   */

  buyAgain() {
    const {
      dis_type
    } = this.data;
    app.globalData.type = dis_type;
    log(app.globalData.type);

    if (app.globalData.province &&
      app.globalData.city &&
      app.globalData.address &&
      app.globalData.position) {
      reLaunch({
        url: '/pages/home/goodslist/goodslist'
      });
    } else {
      reLaunch({
        url: '/pages/position/position'
      });
    }


  }
});
