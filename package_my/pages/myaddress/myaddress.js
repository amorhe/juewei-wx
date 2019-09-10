import {
  imageUrl,
  wxGet
} from '../../../pages/common/js/baseUrl'
import {
  addressList
} from '../../../pages/common/js/my'
import {
  redirectTo,
  navigateTo
} from '../../../pages/common/js/router.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    order_sn: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const {
      order_sn
    } = options
    this.setData({
      order_sn
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
    this.getaddressList()
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
  back(e) {
    const {
      i
    } = e.currentTarget.dataset;
    const {
      order_sn,
      list
    } = this.data;
    const user_address_name = list[i].user_address_name
    const user_address_phone = list[i].user_address_phone
    const province = list[i].province
    const city = list[i].city
    const district = list[i].district
    console.log(district)
    const user_address_id = list[i].user_address_id
    const user_address_detail_address = list[i].user_address_detail_address
    const user_address_map_addr = list[i].user_address_map_addr
    console.log(list)
    if (order_sn) {
      redirectTo({
        url: '/package_vip/pages/waitpay/waitpay?' +
          'order_sn=' + order_sn +
          '&user_address_name=' + user_address_name +
          '&user_address_phone=' + user_address_phone +
          '&province=' + province +
          '&city=' + city +
          '&district=' + district +
          '&user_address_id=' + user_address_id +
          '&user_address_detail_address=' + user_address_detail_address +
          '&user_address_map_addr=' + user_address_map_addr
      });
    }
  },
  toUrl(e) {
    var item = e.currentTarget.dataset.item
    navigateTo({
      url: "/package_my/pages/myaddress/addaddress/addaddress?Id=" + item.user_address_id
    });
  },
  addressFn() {
    navigateTo({
      url: "/package_my/pages/myaddress/addaddress/addaddress"
    });
  },
  getaddressList() {
    var that = this
    var _sid = wxGet('_sid');
    var data = {
      _sid: _sid,
      type: 'normal'
    }
    console.log(data, 'data')
    addressList(data).then(res => {
      if (res.code == 0) {
        that.setData({
          list: res.data
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    })
  },
})