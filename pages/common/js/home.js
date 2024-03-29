import {
  ajax
} from './ajax'
const ajaxUrl = {
  bannerList: '/mini/wmindex/wap/banner/list', // 首页改版公众号 banner列表
  upAliMiniFormId: '/juewei-api/order/upAliMiniFormId', // 发送模板信息
  upAliMiniTradeNo: '/juewei-api/order/upAliMiniTradeNo', // 订单支付后模板消息发送
  couponsList: '/mini/coupons/list', // 优惠券列表
  getQRcode: '/juewei-api/coupons/getQRcode', // 优惠券核销二维码
  couponsExpire: '/mini/wmindex/wap/coupon/expire_detail', // 优惠券过期提醒
  checkDis: '/juewei-api/shop/CheckDis', // 判断收获地址是不是在当前门店配送范围内
  MyNearbyShop: '/juewei-api/shop/MyNearbyShop', // 我的/周边门店
  activityList: '/mini/Mini_activity/wxlist', // 商城页面营销活动
  showPositionList: '/mini/wmindex/wap/show_position/list', // 展位列表
  // GetLbsShop: '/juewei-api/shop/GetLbsShop', // 根据经纬度获取外卖附近门店
  GetLbsShop: '/wx/mini/shop/get-lbs-shop',
  NearbyShop: '/juewei-api/shop/NearbyShop', // 根据经纬度获取自提附近门店
  GetShopGoods: '/juewei-api/shop/GetShopGoods', // 门店商品列表
  createOrder: '/juewei-api/order/create', // 创建订单
  confirmOrder: '/juewei-api/order/confirm', // 确认订单（商品加入购物车点击立即购买）
  useraddress: '/juewei-api/useraddress/listDis', // 我的地址，可配送收货地址列表
  exchangeCode: '/mini/user/exchange_code_list', // 兑换码列表
  exchangeCoupon: '/mini/coupons/exchange_coupons', // 兑换优惠券
  exchangedetail: '/mini/user/exchange_code_view', // 兑换详情
  commentList: '/juewei-api/comment/GoodsCommentList', //  商品详情中的商品评价列表
  DispatchCommentList: '/juewei-api/comment/DispatchCommentList', // 商品详情中的配送评价列表
  add_lng_lat: '/mini/order_online/add_lng_lat', // 风控数据经纬度
  getMarkActivity: '/mini/activity/markup/mark/getMarkActivity', // 加价购列表
  payment: '/juewei-service/payment/jsPay', // 获取预支付交易单号
  useraddressInfo: '/juewei-api/useraddress/info', // 地址详情
  addressList: '/juewei-api/useraddress/list', // 定位页我的地址列表
}

export const bannerList = (city_id, district_id, company_id) => ajax(ajaxUrl.bannerList, {
  city_id,
  district_id,
  company_id
});

export const upAliMiniFormId = (_sid, aliUid, formId) => ajax(ajaxUrl.upAliMiniFormId, {
  _sid,
  aliUid,
  formId
}, "GET");

export const upAliMiniTradeNo = (aliUid, tradeNo) => ajax(ajaxUrl.upAliMiniTradeNo, {
  aliUid,
  tradeNo
}, "GET");

export const couponsList = (_sid, get_type, money, shop_id, phone) => ajax(ajaxUrl.couponsList, {
  _sid,
  get_type,
  money,
  shop_id,
  phone
});

export const getQRcode = (_sid) => ajax(ajaxUrl.getQRcode, {
  _sid
}, "GET");

export const couponsExpire = (_sid) => ajax(ajaxUrl.couponsExpire, {
  _sid
});

export const checkDis = (shop_id, location) => ajax(ajaxUrl.checkDis, {
  shop_id,
  location
}, "GET");

export const MyNearbyShop = (data) => ajax(ajaxUrl.MyNearbyShop, {
  data
});

export const activityList = (city_id, district_id, company_id, buy_type, user_id, activity_channel, join_way) => ajax(ajaxUrl.activityList, {
  city_id,
  district_id,
  company_id,
  buy_type,
  user_id,
  activity_channel,
  join_way
});

export const showPositionList = (city_id, district_id, company_id) => ajax(ajaxUrl.showPositionList, {
  city_id,
  district_id,
  company_id
});

// export const GetLbsShop = (location) => ajax(ajaxUrl.GetLbsShop, {
//   location
// });
export const GetLbsShop = (longitude, latitude) => ajax(ajaxUrl.GetLbsShop, {
  longitude,
  latitude
},'POST',true);

export const NearbyShop = (data) => ajax(ajaxUrl.NearbyShop, {
  data
});

export const GetShopGoods = (shop_id) => ajax(ajaxUrl.GetShopGoods, {
  shop_id
});

export const createOrder = (dispatch_type, shop_id, goods, shops, plate, remark, source, user_address_id, longitude, latitude, type, gift, coupon_code, notUse, fsp_id, _sid, activity_channel) => ajax(ajaxUrl.createOrder, {
  dispatch_type,
  shop_id,
  goods,
  shops,
  plate,
  remark,
  source,
  user_address_id,
  longitude,
  latitude,
  type,
  gift,
  coupon_code,
  notUse,
  fsp_id,
  _sid,
  activity_channel
})
// dispatch_type	是	int	1（外卖）2（自提）
// shop_id	是	int	门店id
// goods	是	json	购物车商品
// shops	是	int	附近门店id，当dispath_type=1必传，附近门店id，英文逗号分隔
// coupon_code	否	string	用户选择的优惠券
// gift	否	json	加价购商品 数据 [{"activity_id":"29","gift_id":"79","id":"74"}] (三个id 都在订单页换购商品接口下的gifts中对应)
// notUse	是	int	优惠券不使用标识，适用在用户主动取消优惠券时的操作,使传入的优惠券码不生效
// plate	是	int	订单平台。支付宝，传值：11
// remark	是	str	订单备注
// source	是	str	订单来源。传值：阿里小程序
// user_address_id	是	int	收货地址id
// longitude	是	str	风控参数：下单经度
// latitude	是	str	风控参数：下单纬度
// type	是	int	风控参数：下单类型，1:外卖去下单；2:外卖确定支付；3:自提去下单；4:自提确认支付

export const confirmOrder = (dispatch_type, shop_id, goods, shops, coupon_code, gift, notUse, fsp_id, _sid, activity_channel) => ajax(ajaxUrl.confirmOrder, {
  dispatch_type,
  shop_id,
  goods,
  shops,
  coupon_code,
  gift,
  notUse,
  fsp_id,
  _sid,
  activity_channel
})

export const useraddress = (shop_id, _sid) => ajax(ajaxUrl.useraddress, {
  shop_id,
  _sid
});

export const exchangeCode = (_sid, get_type) => ajax(ajaxUrl.exchangeCode, {
  _sid,
  get_type
});

export const exchangeCoupon = (_sid, couponscode) => ajax(ajaxUrl.exchangeCoupon, {
  _sid,
  couponscode
});

export const exchangedetail = (_sid, gift_code_id, gift_id, order_id) => ajax(ajaxUrl.exchangedetail, {
  _sid,
  gift_code_id,
  gift_id,
  order_id
});

export const commentList = (goods_code, pagenum, pagesize, plate, level, tag_id) => ajax(ajaxUrl.commentList, {
  goods_code,
  pagenum,
  pagesize,
  plate,
  level,
  tag_id
});

export const DispatchCommentList = (shop_id, pagenum, pagesize, plate, level, tag_id) => ajax(ajaxUrl.DispatchCommentList, {
  shop_id,
  pagenum,
  pagesize,
  plate,
  level,
  tag_id
});

export const add_lng_lat = (order_no, type, longitude, latitude) => ajax(ajaxUrl.add_lng_lat, {
  order_no,
  type,
  longitude,
  latitude
});

export const getMarkActivity = (company_id, user_id) => ajax(ajaxUrl.getMarkActivity, {
  company_id,
  user_id
});

export const useraddressInfo = (address_id, _sid) => ajax(ajaxUrl.useraddressInfo, {
  address_id,
  _sid
});

export const payment = (order_no) => ajax(ajaxUrl.payment, {
  order_no
}, "GET");


export const addressList = (_sid, type, location) => ajax(ajaxUrl.addressList, {
  _sid,
  type,
  location
});