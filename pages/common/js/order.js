export default {
  orderList: {  // --获取banner图
    url: '/juewei-api/order/list',
    method: 'GET',
  },
  orderDetail: {
    url: '/juewei-api/order/detail',
    method: 'GET',
  },
  commentTag: {
    url: '/juewei-api/comment/CommentTag',
    method: 'POST',
  },
  Create: {
    url: '/juewei-api/comment/Create',
    method: 'POST',
  },
  CancelOrder:{
    url:'/juewei-api/order/cancel',
    method: 'POST',
  },
  waiting:{
    url:'/juewei-api/order/waiting',
    method:'GET'
  }
}
