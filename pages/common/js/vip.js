export default {
  reqCategory: {  // 获取目录
    url:'/mini/vip/wap/category/category',
    methods:'POST',
  },
  reqBanner: {  // 获取banner图
    url: '/mini/vip/wap/banner/banner_list',
    methods: 'POST',
    loading: false
  },
  reqGoodsList: {  // 获取商品列表
    url: '/mini/vip/wap/goods/goods_list',
    methods: 'POST',
    loading: false
  },
  reqPositionList: {  // 获取推荐
    url: '/mini/vip/wap/show_position/list',
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
    methods: 'POST',
    loading: false
  },
  reqCouponsList: {  // 获取礼包列表
    url: '/mini/coupons/list',
    defaultData: { get_type : 'new_user' },
    methods: 'POST',
    loading: false
  },
}



/**
* @function 获取当商品面详情
*/
export const reqDetail = id => ajax('/mini/vip/wap/goods/goods_detail', { id })

/**
* @function 创建订单
*/
export const reqCreateOrder = params => ajax('/mini/vip/wap/trade/create_order', params)

/**
 * @function 确认订单
 */
export const reqConfirmOrder = params => ajax('/mini/vip/wap/trade/confirm_order', params)

/**
 * @function 支付订单
 */
export const reqPay = order_no => ajax('/juewei-service/payment/AliMiniPay', { order_no })

/**
 * @function 获取订单列表
 */
export const reqOrderList = ({ page_num, page_size = 10 }) => ajax('/mini/vip/wap/order/order_list', { page_num, page_size })

/**
 * @function 获取订单详情
 */

export const reqOrderDetail = id => ajax('/mini/vip/wap/order/order_detail', { id })

/**
 * @function 取消订单
 */

export const reqCancelOrder = order_sn => ajax('/mini/vip/wap/trade/cancel_order', { order_sn }, 'POST')

/**
 * @function 核销
 */

export const reqWait = () => ajax('/juewei-api/order/waiting', {}, 'GET')


/**
 * @function 获取公众号支付前订单详情
 */
export const reqOrderInfo = order_sn => ajax('/mini/vip/wap/order/order_info', order_sn)
