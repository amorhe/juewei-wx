export default {
  reqCategory: {  // 获取目录
    url: '/mini/wmvip/wap/category/category',
    method: 'POST',
  },
  reqBanner: {  // --获取banner图
    url: '/mini/wmvip/wap/banner/banner_list',
    method: 'POST',
    loading: false
  },
  reqGoodsList: {  // 获取商品列表
    url: '/mini/wmvip/wap/goods/goods_list',
    method: 'POST',
    loading: false
  },
  reqDetail: {  // 获取当商品面详情
    url: '/mini/wmvip/wap/goods/goods_detail',
    method: 'POST',
    loading: false
  },
  reqPositionList: {  // 获取公众号展位列表
    url: '/mini/wmvip/wap/show_position/list',
    method: 'POST',
    loading: false
  },
  reqUserPoint: {  // 获取用户积分
    url: '/mini/user/user_point',
    method: 'POST',
    loading: false
  },
  reqPointList: {  // 获取积分详情
    url: '/mini/point_exchange/point_list',
    method: 'GET',
    loading: false
  },
  reqOrderList: {  // 获取订单列表
    url: '/mini/wmvip/wap/order/order_list',
    method: 'POST',
    loading: false
  },
  reqCreateOrder: {  // 创建订单
    url: '/mini/wmvip/wap/trade/create_order',
    method: 'POST',
    loading: false
  },
  reqCancelOrder: {  // 取消订单
    url: '/mini/wmvip/wap/trade/cancel_order',
    method: 'POST',
    loading: false
  },
  reqOrderInfo: {  // 获取公众号支付前订单详情
    url: '/mini/wmvip/wap/order/order_info',
    method: 'POST',
    loading: false
  },
  reqOrderDetail: {  // 获取订单列表
    url: '/mini/wmvip/wap/order/order_detail',
    method: 'POST',
  },
  //todo: vip订单支付成功 回调接口
  //todo: vip金额支付 获取订单金额信息接口
  reqConfirmOrder: {  // 确认订单
    url: '/mini/wmvip/wap/trade/confirm_order',
    method: 'POST',
    loading: false
  },


  reqPay: {  // 支付订单
    url: '/juewei-service/payment/AliMiniPay',
    method: 'POST',
  },


  reqWait: {  // 核销
    url: '/juewei-api/order/waiting',
    method: 'GET',
    loading: false
  },

  reqCouponsList: {  // 获取礼包列表
    url: '/mini/coupons/list',
    defaultData: { get_type : 'new_user' },
    method: 'POST',
    loading: false
  },
}
