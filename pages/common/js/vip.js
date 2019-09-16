export default {
  reqCategory: {  // 获取目录
    url: '/mini/wmvip/wap/category/category',
    methods: 'POST',
  },
  reqBanner: {  // --获取banner图
    url: '/mini/wmvip/wap/banner/banner_list',
    methods: 'POST',
    loading: false
  },
  reqGoodsList: {  // 获取商品列表
    url: '/mini/wmvip/wap/goods/goods_list',
    methods: 'POST',
    loading: false
  },
  reqDetail: {  // 获取当商品面详情
    url: '/mini/wmvip/wap/goods/goods_detail',
    methods: 'POST',
    loading: false
  },
  reqPositionList: {  // 获取公众号展位列表
    url: '/mini/wmvip/wap/show_position/list',
    methods: 'POST',
    loading: false
  },
  reqUserPoint: {  // 获取用户积分
    url: '/mini/user/user_point',
    methods: 'POST',
    loading: false
  },
  reqPointList: {  // 获取积分详情
    url: '/mini/point_exchange/point_list',
    methods: 'GET',
    loading: false
  },
  reqOrderList: {  // 获取订单列表
    url: '/mini/wmvip/wap/order/order_list',
    methods: 'POST',
    loading: false
  },
  reqCreateOrder: {  // 创建订单
    url: '/mini/wmvip/wap/trade/create_order',
    methods: 'POST',
    loading: false
  },
  reqCancelOrder: {  // 取消订单
    url: '/mini/wmvip/wap/trade/cancel_order',
    methods: 'POST',
    loading: false
  },
  reqOrderInfo: {  // 获取公众号支付前订单详情
    url: '/mini/wmvip/wap/order/order_info',
    methods: 'POST',
    loading: false
  },
  //todo: vip订单支付成功 回调接口
  //todo: vip金额支付 获取订单金额信息接口
  reqConfirmOrder: {  // 确认订单
    url: '/mini/wmvip/wap/trade/confirm_order',
    methods: 'POST',
    loading: false
  },


  reqPay: {  // 支付订单
    url: '/juewei-service/payment/AliMiniPay',
    methods: 'POST',
    loading: false
  },
  reqOrderDetail: {  // 获取订单列表
    url: '/mini/vip/wap/order/order_detail',
    methods: 'POST',
    loading: false
  },

  reqWait: {  // 核销
    url: '/juewei-api/order/waiting',
    methods: 'GET',
    loading: false
  },

  reqCouponsList: {  // 获取礼包列表
    url: '/mini/coupons/list',
    defaultData: { get_type : 'new_user' },
    methods: 'POST',
    loading: false
  },
}
