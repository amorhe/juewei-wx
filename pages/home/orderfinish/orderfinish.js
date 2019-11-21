import {
  imageUrl,
  wxGet,
  wxSet
} from '../../common/js/baseUrl'
import {
  ajax,
  log
} from '../../common/js/li-ajax'
import {
  redirectTo,
  navigateTo
} from '../../common/js/router.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    order_no: '',
    show: false,
    new_user: [],
    newUserShow: false,
    gifts: false,
    gift_type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    const {
      order_no
    } = e
    this.setData({
      order_no
    }, () => {
      this.isNewUser()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.eveClose();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  eveCheckOrder() {
    app.globalData.refresh_state = app.globalData.type - 1;
    redirectTo({
      url: '/pages/order/list/list',
    })
  },
  /**
   * @function 判断是否是新用户
   */
  // 订单详情接口  
  // 中会返回一个 new_user 参数   
  // new_user如果为空或者不存在或者为0   都说明不是新用户首单  
  // 如果new_user==1则是新用户首单 新用户下单当天只弹一次  
  // 不同用户同一设备都要弹  弹框内容是百元大礼包券（请求coupon/list接口  和会员新人礼包券一样）

  async isNewUser() {
    const {
      order_no
    } = this.data
    let new_user = wxGet('new_user');
    // 说明不是 第一次
    if (new_user == 1) {
      return
    }
    let res = await ajax({url:'/juewei-api/order/detail', data:{
      order_no
    }})
    if (res.code == 0) {
      // 说明是新用户
      if (res.data.new_user == 1) {
        wxSet('new_user', 1);
        this.funGetCouponsList();
        this.setData({
          newUserShow: true
        })
      }
      // 虚拟商品弹框
      let static_no = 0;
      res.data.goods_list.forEach(item => {
        if (item.is_gifts == 1 && static_no == 0) {
          static_no = 1;
          // 优惠券
          if (item.gift_type == 1) {
            this.setData({
              gift_type: 1,
              gifts: true
            })
          }
          // 兑换码
          if (item.gift_type == 2) {
            this.setData({
              gift_type: 2,
              gifts: true
            })
          }
        } else {
          this.setData({
            gifts: false
          })
        }
      })
    }else{
      //获取详情订单失败
      this.setData({
        newUserShow: false
      })
    }
  },

  confirmTap() {
    this.setData({
      gifts: false
    })
  },
  eveClose() {
    this.setData({
      newUserShow: false
    })
  },

  /**
   * @function 获取礼包列表
   */

  async funGetCouponsList() {
    let res = await ajax({url:'/mini/coupons/list', data:{ get_type: 'new_user'}})
    if (res.CODE === 'A100' && res.DATA.new_user && res.DATA.new_user.length> 0) {
      let new_user = res.DATA.new_user
        .map(({
          end_time,
          ...item
        }) => ({
          end_time: new Date(end_time * 1000).toLocaleDateString(),
          ...item
        }))
      this.setData({
        newUserShow: true,
        new_user
      })
    }else{//没有获取到新用户礼包
      this.setData({
        newUserShow: false,
        new_user: []
      })
    }
  },

  eveToTakeIn() {
    redirectTo({
      url: '/pages/home/goodslist/goodslist'
    });
  },
  evenotap(){

  }
})