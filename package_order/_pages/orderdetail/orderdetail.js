import { imageUrl, imageUrl2, imageUrl3, img_url } from '../../../pages/common/js/baseUrl'
import { log, ajax, contact, handleCopy, guide } from '../../../pages/common/js/li-ajax'

const app = getApp()
Page({
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
      '骑手正在送货',
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

    cancelReasonList: [
      { reason: '下错单/临时不想要了', value: true, cancel_code: 9 },
      { reason: '订单长时间未分配骑手', value: false, cancel_code: 1 },
      { reason: '门店商品缺货/无法出货/已售完', value: false, cancel_code: 4 },
      { reason: '联系不上门店/门店关门了', value: false, cancel_code: 5 },
      { reason: '其他', value: false, cancel_code: 0 },
    ],

    curOrderState: [],

    payTypes: {
      1: '微信', 2: '支付宝', 3: '银联', 4: '微信扫码', 5: '支付宝扫码', 6: '现金',7:'支付宝付款码',8:'微信小程序',9:'微信付款码',10:'统一下单',11:'支付宝小程序'
    },

    postWay: {
      FNPS: '蜂鸟配送', MTPS: '美团配送', ZPS: '自配送'
    },

    timeArr: [],

    payStatusList: [],
    d: {},
    dis_type: -1,
    order_channel: 1
  },
  async onLoad(e) {
    let { order_no } = e
    this.setData({
      order_no
    })
  },

  async onShow() {
    await this.getOrderDetail()
  },
  onUnload() {
    clearInterval(this.data.time)
    this.setData({ time: -1 })
    this.setData = () => { }
  },
  onHide() {
    clearInterval(this.data.time)
    this.setData({ time: -1 })
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
    let { curOrderState, order_no, time } = this.data
    clearInterval(time)
    let res = await ajax('/juewei-api/order/detail', { order_no })

    let timeArr
    let { order_ctime, pay_time, get_time, dis_get_time, dis_take_time, push_time, dis_finish_time, cancel_time, dis_type, dis_tag, order_status_info } = res.data
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
        timeArr = [
          { state: '等待支付', time: order_ctime },
          { state: '订单已提交', time: pay_time },
          { state: '商家已接单', time: push_time },
          { state: '骑手已接单', time: dis_get_time },
          { state: '骑手正在送货', time: dis_take_time },
          { state: '订单已完成', time: dis_finish_time },
          { state: '订单已取消', time: cancel_time },
        ]
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

        let orderStatus = [
          { state: '等待支付', timeArr: [1] },
          { state: '支付成功', timeArr: [1, 2] },
          { state: '商家接单/商家已确认', timeArr: [1, 2, 3] },
          { state: '正在配送/配送中', timeArr: [1, 2, 3, 4] },
          { state: '确认收货/已送到/完成', timeArr: [1, 2, 3, 4, 5, 6] },
          { state: '用户取消', timeArr: [1, 7] },
          { state: '自动取消', timeArr: [1, 7] },
          { state: '后台客服退单', timeArr: [1, 2, 7] },
          { state: '后台审核退单成功', timeArr: [1, 7] },
          { state: '达达主动发起取消订单', timeArr: [1, 2, 3, 7] },
          { state: '店pos取消', timeArr: [1, 2, 7] },
        ]



        let curState = res.data.order_status_info.order_status
        let curTimeArr = orderStatus[curState].timeArr;
        // 自配送 没有骑手已接单
        if (curState < 5 && curState > 2) {
          dis_tag != 'ZPS' ? curTimeArr : (curTimeArr.splice(curTimeArr.findIndex(item => item == 4), 1));

        }

        ; (curState == 2 && order_status_info.dis_status == 2 && dis_tag != 'ZPS' && dis_get_time) ? curTimeArr.push(4) : curTimeArr
        curState === 3 && dis_take_time != '0000-00-00 00:00:00' ? curTimeArr.push(5) : curTimeArr
        curOrderState = curTimeArr.map(item => timeArr[item - 1])

      }

      if (dis_type == 2) {
        // //显示状态和时间的语句
        // 1） 待支付，时间：data.order_ctime      //创建时间
        // 2） 待取餐，时间：data.pay_time         //支付时间
        // 6） 订单已完成，时间：data.dis_finish_time  //送达时间
        // 7） 订单已取消，时间：data.cancel_time      //取消时间
        timeArr = [
          { state: '等待支付', time: order_ctime },
          { state: '等待取餐', time: pay_time },
          { state: '商家已接单', time: push_time },
          { state: '配送已接单', time: dis_get_time },
          { state: '骑手配送中', time: dis_take_time },
          { state: '订单已完成', time: dis_finish_time },
          { state: '订单已取消', time: cancel_time },
        ]
        log(timeArr)
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

        let orderStatus = [
          { state: '等待支付', timeArr: [1] },
          { state: '支付成功', timeArr: [1, 2] },
          { state: '商家接单/商家已确认', timeArr: [1, 2, 3] },
          { state: '正在配送/配送中', timeArr: [1, 2, 3] },
          { state: '确认收货/已送到/完成', timeArr: [1, 3, 2, 6] },
          { state: '用户取消', timeArr: [1, 7] },
          { state: '自动取消', timeArr: [1, 7] },
          { state: '后台客服退单', timeArr: [1, 2, 7] },
          { state: '后台审核退单成功', timeArr: [1, 2, 7] },
          { state: '达达主动发起取消订单', timeArr: [1, 2, 7] },
          { state: '店pos取消', timeArr: [1, 2, 7] },
        ]

        let curState = res.data.order_status_info.order_status
        let curTimeArr = orderStatus[curState].timeArr

        curOrderState = curTimeArr.map(item => timeArr[item - 1])

        // log(curOrderState)
      }

      let { remaining_pay_minute, remaining_pay_second, ...item } = res.data
      let { time } = this.data
      time = setInterval(() => {
        --remaining_pay_second
        if (remaining_pay_minute === 0 && remaining_pay_second == -1) {
          clearInterval(time)
          // return this.getOrderDetail(order_no)
        }
        if (remaining_pay_second <= 0) {
          --remaining_pay_minute
          remaining_pay_second = 59
        }
        this.setData({
          d: { ...item, remaining_pay_second, remaining_pay_minute },
          time,
          timeArr,
          curOrderState,
          dis_type,
          order_channel: res.data.channel
        })
      }, 1000)


    }
  },

  /**
   * @function 打电话
   */
  makePhoneCall(e) {
    const { number } = e.currentTarget.dataset
    my.makePhoneCall({ number });
  },

  show() {
    this.setData({
      showTop: true
    })
  },

  onHide() {
    this.closeModel()
  },

  /**
   * @ 显示选择原因
   */

  showCancel() {
    if (this.data.order_channel != 1) {
      my.showToast({
        content: '订单不支持跨平台操作，请去相应平台取消订单！'
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
    const { cancelReasonList } = this.data;
    const { index } = e.currentTarget.dataset;
    cancelReasonList.forEach(item => item.value = false)
    cancelReasonList[index].value = true

    this.setData({
      cancelReasonList
    })
  },

  /**
   * @function 取消订单
   */

  async cancelOrder() {
    const { d, cancelReasonList } = this.data
    let cancel_code = cancelReasonList.filter(item => item.value)[0].cancel_code
    let res = await ajax('/juewei-api/order/cancel', { order_no: d.order_no, cancel_code, cancel_reason: '其他' })
    if (res.code == 0) {
      log('取消成功')
      app.globalData.refresh = true
      app.globalData.refresh_state = d.dis_type - 1
      my.switchTab({
        url: '/pages/order/list/list',
      });
    } else {
      this.closeModel()
      my.showToast({
        content: res.msg,
        duration: 2000,
      });
    }

  },

  /**
   * @function 去评价页面
   */
  toComment(e) {
    const { order_no } = e.currentTarget.dataset;
    my.navigateTo({
      url: '/package_order/pages/comment/comment?order_no=' + order_no
    });
  },

  /**
   * @function 立即支付
   */
  async payNow(e) {
    const { channel } = this.data.d
    if (channel != 1) { return }
    const { order_no } = e.currentTarget.dataset;
    let r = await ajax('/juewei-service/payment/AliMiniPay', { order_no }, "POST")
    if (r.code === 0) {
      let { tradeNo } = r.data
      if (!tradeNo) {
        return my.showToast({
          content: r.data.erroMSg
        })
      }
      my.tradePay({
        tradeNO: tradeNo, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
        success: res => {
          log('支付成功'.res)
          if (res.resultCode == 9000) {
            return my.redirectTo({
              url: '/pages/home/orderfinish/orderfinish?order_no=' + order_no
            });
          }
          // return my.redirectTo({
          //   url: '/pages/home/orderError/orderError?order_no=' + order_no
          // });
        },
        fail: res => {
          return my.redirectTo({
            url: '/pages/home/orderError/orderError?order_no=' + order_no
          });
        }
      });

    } else {
      return my.redirectTo({
        url: '/pages/home/orderError/orderError?order_no=' + order_no
      });
    }
  },


  /**
   * @function 再来一单
   */

  buyAgain() {
    const { dis_type } = this.data
    app.globalData.type = dis_type;
    log(app.globalData.type)

    if (app.globalData.province &&
      app.globalData.city &&
      app.globalData.address &&
      app.globalData.position) {
      my.switchTab({
        url: '/pages/home/goodslist/goodslist'
      });
    } else {
      my.navigateTo({
        url: '/pages/position/position'
      });
    }


  },
});

let data = {
  "order_id": 26362488, // 订单编号
  "user_id": 295095, // 用户编号
  "shop_id": 145, // 门店id
  "user_name": "v", // 收货人姓名
  "user_phone": "13001979905", // 收货人电话
  "user_sex": 0, // 收货人性别
  "map_addr": "紫檀大厦", // 地图定位地址
  "user_address": "6层", // 用户地址
  "sum_goods": 0, // 商品数量
  "sum_price": 3600, // 订单价格
  "real_price": 3600, // 实际支付（优惠后，真实付的钱）
  "message": "", // 备注信息
  "source": "服务号", // 下单来源 1，服务号  2，android 3，ios
  "pay_type": 1, // 支付平台 1，微信 2，支付宝  3， 银联  4，微信扫码 5，支付宝扫码 6，现金
  "order_ctime": "2019-07-02 10:06:24",
  "order_utime": "2019-07-02 10:22:01",
  "get_point": 0, // 获取积分
  "use_point": 0, // 使用积分
  "reduce_money": 0, // 订单优惠总金额
  "coupon_money": 0, // 限量优惠券 // 使用优惠券的优惠金额
  "minus_money": 0, // 立减券金额 // 立减券金额
  "user_new_money": 0, // 首单立减 // 新用户优惠金额
  "activity_code": "4", // 活动code
  "coupons": [], // 满减券code
  "dis_original_price": 500, // 配送费原价
  "dis_price": 500, // 配送费 // 原有配送费,精确到分
  "latitude": "39.918633",
  "longitude": "116.548277",
  "province": "北京",
  "province_id": 110000,
  "city": "北京市",
  "city_id": 110100,
  "district": "朝阳区",
  "district_id": 110105,
  "openid": "ommkBxCy4xYp_WqgBo5s-SZIUJ-g", // 微信openid
  "company_sale_id": 25, // 门店关联的销售型公司
  "status": 2, // 订单状态 0|创建订单 1|已完成 2|已取消
  "push_shop_id": "145", // 可推送的门店
  "cancel_shop_id": "0", // 取消的门店
  "order_cancel_reason": "", // 订单取消原因
  "reduce_detail": null, // 优惠详情
  "goods_gifts_money": 0, // 商品规则优惠券总金额
  "goods_reduce_money": 0, // 商品折扣优惠总金额
  "activity_money": 0,  // 活动满减// 活动金额
  "order_index": 1, // 门店第几单
  "is_comment": 0, // 是否评论
  "pay_no": "", // 第三方支付订单号
  "pay_price": 0, // 实际支付金额
  "pay_reduce_price": 0, // 支付优惠金额
  "dis_tel": "", // 配送员电话
  "dis_name": "", // 配送员名
  "dis_tag": "", // 物流标签 // FNPS:蜂鸟配送 MTPS:美团配送 ZPS:自配送
  "is_dis": 0, // 是否配送标记（商家）
  "dis_type": 1, // 订单类型  1"官方外卖", 2"门店自取" // 配送方式 1配送  2 自提
  "dis_no": "", // 第三方配送的单号
  "refund_no": "", // 退款编码
  "refund_price": 0, // 退款金额
  "refund_is_full": 0, // 是否全额退款
  "refund_reason": "", // 退款原因
  "push_time": "0000-00-00 00:00:00", // 推送时间
  "get_time": "0000-00-00 00:00:00", // 门店接单时间
  "pay_time": "0000-00-00 00:00:00", // 支付时间
  "cancel_time": "2019-07-02 10:22:01", // 取消时间
  "refund_time": "0000-00-00 00:00:00", // 支付时间
  "dis_get_time": "0000-00-00 00:00:00", // 物流接单时间
  "dis_take_time": "0000-00-00 00:00:00", // 物流取货时间
  "dis_finish_time": "0000-00-00 00:00:00", // 物流完成配送时间
  "dis_id": 0, // 配送公司id
  "template_id": "", // 优惠券模板编号
  "distance": 844, // 配送距离
  "is_remark": 0, // 是否标记备注
  "new_user": 0, // 新用户首单标识
  "free_shipping_id": 0, // 包邮活动ID
  "ali_uid": "", // 阿里支付宝小程序user_id
  "goods_list": [{
    "order_goods_web_id": 2219263, // 订单详情编号
    "order_id": 26362488, // 订单id
    "tenant_id": 1,
    "goods_quantity": 1, // 数量 // 商品数量
    "goods_name": "招牌鸭脖", // 商品名称
    "goods_price": 3100, // 单价 // 商品单价,精确到分
    "goods_original_price": 3100, // 原价 // 商品原价,精确到分
    "order_goods_web_ctime": "2019-07-02 10:06:24",
    "goods_code": "A1QLT3", // 商品编号
    "is_gifts": 0, // 是否是赠品
    "remark": "超辣", // 口味 // 商品备注信息
    "goods_format": "大份", // 商品规格属性
    "gift_id": 0, // 赠品id
    "gift_type": 0, // 赠品类型（1-优惠券;2-兑换码;3-官方商品;4-非官方商品）
    "goods_img": "http:\/\/imgcdnjwd.juewei.com\/static\/product\/image\/goods_point\/file\/2017-12-22\/src\/ee54bcc477f93fd0a1.jpg" // 商品图片
  }],
  "order_status_info": {
    "order_status_web_id": 939887,
    "order_id": 26362488,
    "tenant_id": 1,
    "order_status": 6, // 订单状态 0未支付状态/用户下单/新增订单 1支付成功 2商家接单/商家已确认 3正在配送/配送中 4确认收货/已送到/完成 5用户取消 6自动取消  7后台客服退单 8物流取消订单 9微信标记退款失败，10店pos取消
    "dis_status": 0, // 派送状态 0|未接单.1|系统已接单.2|分配骑手.3|到店取货.4|配送中.5|已送达.10|已取消.11|系统异常
    "pay_status": 0, // 支付状态 0|等待支付.1|支付完成
    "refund_status": 0, // 退款状态 0|未退款.1|审核通过.2|审核失败.3|用户退款.4|退款成功.5|退款失败
    "version": 0,
    "order_status_web_ctime": "2019-07-02 10:06:24",
    "order_status_web_utime": "2019-07-02 10:22:01"
  },
  "shop_name": "绝味鸭脖(定福庄西街店)", // 门店名称
  "shop_tel": "13000000000", // 门店电话
  "shop_longitude": "116.557588",
  "shop_latitude": "39.916042",
  "order_no": "jwd0119070226362488" // 订单id
}






// 例如 data.order_status_info.order_status=2
// 页面显示   1,2,3

// 待支付           00:00
// 待取餐           00:10
// 门店已接单       00:20
