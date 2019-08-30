import { ajax } from './li-ajax'

/**
 * @function 获取目录
 */
export const reqCategory = type => ajax('/mini/vip/wap/category/category', { type }, 'POST')

/**
 * @function 获取banner图
 */
export const reqBanner = bannerListOption => ajax('/mini/vip/wap/banner/banner_list', bannerListOption)

/**
 * @function 获取商品列表
 */

export const reqGoodsList = goodslistOption => ajax('/mini/vip/wap/goods/goods_list', goodslistOption)

/**
 * @function getPositionList
 */
export const reqPositionList = positionListOption => ajax('/mini/vip/wap/show_position/list', positionListOption)

/**
* @function 获取用户积分
*/
export const reqUserPoint = () => ajax('/mini/user/user_point')


/**
 * @function 获取礼包列表
 */
export const reqCouponsList = (get_type = 'new_user') => ajax('/mini/coupons/list', { get_type })

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
 * @function 获取积分详情
 */
export const reqPointList = ({ pagenum, pagesize }) => ajax('/mini/point_exchange/point_list', { pagenum, pagesize }, 'GET')

/**
 * @function 获取公众号支付前订单详情
 */
export const reqOrderInfo = order_sn => ajax('/mini/vip/wap/order/order_info', order_sn)
