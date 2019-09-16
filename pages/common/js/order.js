export default {
  orderList: {  // --获取banner图
    url: '/juewei-api/order/list',
    methods: 'GET',
  },
  orderDetail: {
    url: '/juewei-api/order/detail',
    methods: 'GET',
  },
  commentTag: {
    url: '/juewei-api/comment/CommentTag',
    methods: 'POST',
  },
  Create: {
    url: '/juewei-api/comment/Create',
    methods: 'POST',
  },
  CancelOrder:{
    url:'/juewei-api/order/cancel',
    methods: 'POST',
  }
}
