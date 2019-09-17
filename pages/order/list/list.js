// pages/order/list/list.js
import { imageUrl } from '../../common/js/baseUrl'
import { contact, guide, isloginFn, log, MODAL } from '../../common/js/utils'
import Request from '../../common/js/li-ajax'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    _sid: '',
    loginOpened: false,
    refreshFinish: false,
    menuList: [
      {
        key: '官方外卖订单',
        value: '',
        page: 1,
        dis_type: 1,
        finish: false,
        list: [],
        loading: false
      },
      {
        key: '门店自提订单',
        value: '',
        page: 1,
        dis_type: 2,
        finish: false,
        list: [],
        loading: false
      }
    ],

    dis_type: 1,

    takeOutState: [
      '等待支付',
      '订单已提交',
      '商家已接单',
      '骑手正在送货',
      '订单已完成',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '骑手已接单',
    ],

    pickUpState: [
      '等待支付',
      '等待接单',
      '商家已接单',
      '等待取餐',
      '订单已完成',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消'
    ],

    cur: 0,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.eventReduceTime()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    // 校验用户是否登录
    // 校验是否 需要刷新
    if (app.globalData.refresh == true) {
      wx.showToast({
        content: '取消成功'
      });
      app.globalData.refresh = false
    }


    return this.setData({
      cur: app.globalData.refresh_state || 0
    }, () => this.refresh())
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.onModalClose();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let { menuList, cur } = this.data;
    this.setData({ menuList });
    this.setData = () => {
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    this.refresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getOrderList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 刷新
  async refresh() {
    const { menuList, refreshFinish } = this.data;
    if (refreshFinish) {
      return
    }

    // 重置数据
    let _menuList = [
      {
        key: '官方外卖订单',
        value: '',
        page: 1,
        dis_type: 1,
        finish: false,
        fun: 'getTakeOutList',
        list: [],
        loading: menuList[0].loading
      },
      {
        key: '门店自提订单',
        value: '',
        page: 1,
        dis_type: 2,
        finish: false,
        fun: 'getPickUpList',
        list: [],
        loading: menuList[1].loading
      }
    ];


    // 拉取最新数据
    setTimeout(() => {
      this.setData({
        menuList: _menuList,
        refreshFinish: true,
      }, async () => {
        await this.getOrderList();
        wx.stopPullDownRefresh()
      })
    })

  },

  contact,
  isloginFn,
  guide,

  makePhoneCall(e) {
    const { dis_tel } = e.currentTarget.dataset;
    wx.makePhoneCall({ number: dis_tel });
  },


  /**
   * @function 关闭modal
   */
  onModalClose() {
    // 清空所有计时器
    const { menuList } = this.data;
    this.setData({
      loginOpened: false,
      menuList: [
        {
          key: '官方外卖订单',
          value: '',
          page: 1,
          dis_type: 1,
          finish: false,
          list: [],
          loading: menuList[0].loading
        },
        {
          key: '门店自提订单',
          value: '',
          page: 1,
          dis_type: 2,
          finish: false,
          list: [],
          loading: menuList[1].loading
        }
      ],

      dis_type: 1,
    })
  },


  /**
   * @function 选择菜单
   */

  async changeMenu(e) {
    const { cur } = e.currentTarget.dataset;
    if (this.data.cur === cur) {
      return
    }
    setTimeout(() => {
      this.setData({ cur }, () => {
        setTimeout(() => {
          this.refresh();
          app.globalData.refresh_state = cur
        })
      }, 0)
    }, 0)
  },


  /**
   * @function 获取订单列表
   */
  async getOrderList() {

    let { menuList, cur } = this.data;
    let { page, dis_type, list, loading } = menuList[cur];
    if (loading) {
      return
    }
    menuList[cur].page++;
    let { data, code } = await Request.orderList({ page_size: 20, page, dis_type });
    menuList[loading] = true;
    this.setData({ loading: true }, () => {
      if (code === 0) {
        list = [...list, ...data];
        menuList[cur].finish = true;
        menuList[cur].list = list;
        menuList[loading] = false;
        this.setData({
          menuList,
          loading: false,
          refreshFinish: false
        })
      } else {
        MODAL({
          title: '',
          content: '用户未登录',
          confirmText: '登录',
          confirm: isloginFn
        });
      }
    })
  },

  /**
   * @function 递归时间
   */

  eventReduceTime() {
    let { menuList, cur } = this.data;
    let { list, loading } = menuList[cur];
    if (loading) {
      return
    }
    list = list.map(({ remaining_pay_minute, remaining_pay_second, ...item }) => {
      remaining_pay_second--;
      if (remaining_pay_second === 0 && remaining_pay_minute === 0) {
        // 此处不要停。。。
      }
      if (remaining_pay_second <= 0) {
        --remaining_pay_minute;
        remaining_pay_second = 59
      }
      return {
        remaining_pay_minute,
        remaining_pay_second,
        ...item,
      }
    });
    menuList[cur].finish = true;
    menuList[cur].list = list;
    menuList[loading] = false;
    this.setData({
      menuList,
      loading: false,
      refreshFinish: false
    });
    setTimeout(() => {
      this.eventReduceTime();
    }, 1000)
  },
  /**
   * @function 跳转订单详情页面
   */
  toDetail(e) {
    const { order_no } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/package_order/pages/orderdetail/orderdetail?order_no=' + order_no
    });
  },

  /**
   * @function 去评价页面
   */
  toComment(e) {
    const { order_no } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/package_order/pages/comment/comment?order_no=' + order_no
    });
  },

  /**
   * @function 再来一单
   */

  buyAgain() {
    const { menuList, cur } = this.data;

    app.globalData.type = menuList[cur].dis_type;
    log(app.globalData.type);

    if (app.globalData.province &&
      app.globalData.city &&
      app.globalData.address &&
      app.globalData.position) {
      wx.switchTab({
        url: '/pages/home/goodslist/goodslist'
      });
    } else {
      wx.navigateTo({
        url: '/pages/position/position'
      });
    }
  }
});