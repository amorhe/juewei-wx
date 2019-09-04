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
