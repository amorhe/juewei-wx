// pages/order/list/list.js
import { imageUrl } from '../../common/js/baseUrl'
import { ajax, log, contact, isloginFn, guide, egetSid } from '../../common/js/utils'
import { reqUserPoint } from '../../common/js/vip'
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
        timer: -1,
        list: [],
        loading: false
      },
      {
        key: '门店自提订单',
        value: '',
        page: 1,
        dis_type: 2,
        finish: false,
        timer: -1,
        list: [],
        loading: false
      }
    ],

    timers: [-1],

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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow:async function () {
    const { timers } = this.data;

    timers.forEach(item => clearInterval(item))

    // 校验用户是否登录
    await reqUserPoint()
    let _sid = await getSid()
    if (!_sid) { return isloginFn() }
    // 校验是否 需要刷新
    if (app.globalData.refresh == true) {
      my.showToast({
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
    this.onModalClose()
    let { menuList, cur, timers } = this.data
    clearInterval(menuList[cur].timer)
    timers.forEach(item => clearInterval(item))
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let { menuList, cur, timers } = this.data
    clearInterval(menuList[cur].timer)
    timers.forEach(item => clearInterval(item))
    menuList[cur].timer = -1
    this.setData({ menuList })
    this.setData = () => { }
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
    this.getMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 刷新
  async refresh() {
    const { menuList, timers, refreshFinish } = this.data
    if (refreshFinish) { return }

    // 重置数据
    let _menuList = [
      {
        key: '官方外卖订单',
        value: '',
        page: 1,
        dis_type: 1,
        finish: false,
        fun: 'getTakeOutList',
        timer: -1,
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
        timer: -1,
        list: [],
        loading: menuList[1].loading
      }
    ]


    // 清空所有计时器
    menuList.forEach(({ timer }) => clearInterval(timer))
    timers.forEach(item => clearInterval(item))

    // 拉取最新数据
    setTimeout(() => {
      this.setData({
        menuList: _menuList,
        refreshFinish: true,
      }, async () => {
        await this.getMore();
        my.stopPullDownRefresh()
      })
    })

  },

  contact,
  isloginFn,
  guide,

  /**
   * @function 打开用户登录弹窗
   */
  open() {
    // 清空所有计时器
    const { menuList, timers } = this.data
    menuList.forEach(({ timer }) => clearInterval(timer))
    timers.forEach(item => clearInterval(item))
    this.setData({
      loginOpened: true
    })
  },

  makePhoneCall(e) {
    const { dis_tel } = e.currentTarget.dataset
    my.makePhoneCall({ number: dis_tel });
  },


  /**
   * @function 关闭modal
   */
  onModalClose() {
    // 清空所有计时器
    const { menuList, timers } = this.data
    menuList.forEach(({ timer }) => clearInterval(timer))
    timers.forEach(item => clearInterval(item))
    this.setData({
      loginOpened: false,
      menuList: [
        {
          key: '官方外卖订单',
          value: '',
          page: 1,
          dis_type: 1,
          finish: false,
          timer: -1,
          list: [],
          loading: menuList[0].loading
        },
        {
          key: '门店自提订单',
          value: '',
          page: 1,
          dis_type: 2,
          finish: false,
          timer: -1,
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
    let { menuList, timers } = this.data
    // 清空所有计时器
    menuList.forEach(({ timer }) => clearInterval(timer))
    timers.forEach(item => clearInterval(item))
    const { cur } = e.currentTarget.dataset
    if (this.data.cur === cur) { return }
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

    let { menuList, cur, timers } = this.data
    let { page, dis_type, timer, list, loading } = menuList[cur]
    if (loading) { return }
    menuList[cur].page++
    menuList.forEach(({ timer }) => clearInterval(timer))
    timers.forEach(item => clearInterval(item))
    let { data, code } = await ajax('/juewei-api/order/list', { page_size: 20, page, dis_type }, 'GET')
    my.showLoading({
      content: '加载中...',
    });
    menuList[loading] = true
    this.setData({ loading: true }, () => {
      menuList.forEach(({ timer }) => clearInterval(timer))
      timers.forEach(item => clearInterval(item))
      if (code === 0) {
        list = [...list, ...data]
        timer = setInterval(() => {
          list = list.map(({ remaining_pay_minute, remaining_pay_second, ...item }) => {
            remaining_pay_second--
            if (remaining_pay_second === 0 && remaining_pay_minute === 0) {
              clearInterval(timer)
            }
            if (remaining_pay_second <= 0) {
              --remaining_pay_minute
              remaining_pay_second = 59
            }
            return {
              remaining_pay_minute,
              remaining_pay_second,
              ...item,
            }
          })
          menuList[cur].timer = timer
          menuList[cur].finish = true
          menuList[cur].list = list
          menuList[loading] = false
          timers.push(timer)
          if (timers.length > 10) { timers = [] }
          this.setData({
            menuList,
            timers,
            loading: false,
            refreshFinish: false
          }, () => my.hideLoading())
        }, 1000)


      } else {
        this.open()
        my.hideLoading()
      }
    })

  },

  /**
   * @function 获取更对订单信息
   */

  async getMore() {
    // 页面被拉到底部
    const { menuList, cur } = this.data;
    setTimeout(async () => {
      await this.getOrderList()
    }, 300)
  },

  /**
   * @function 跳转订单详情页面
   */
  toDetail(e) {
    const { order_no } = e.currentTarget.dataset;
    my.navigateTo({
      url: '/package_order/pages/orderdetail/orderdetail?order_no=' + order_no
    });
  },

  /**
   * @function 去评价页面
   */
  toComment(e) {
    const { order_no } = e.currentTarget.dataset;
    my.navigateTo({
      url: '/package_order/pages/comment/comment?order_no=' + order_no
    });
  },

  /**
   * @function 再来一单
   */

  buyAgain() {
    const { menuList, cur } = this.data;

    app.globalData.type = menuList[cur].dis_type;
    log(app.globalData.type)

    if (app.globalData.province &&
      app.globalData.city &&
      app.globalData.address &&
      app.globalData.position) {
      my.switchTab({
        url: '/pages/home/goodslist/goodslist'
      });
    } else {
      my.navigateTo({
        url: '/pages/position/position'
      });
    }
  }
  // <!--未登录提示 -->
  // <modal show="{{loginOpened}}" showClose="{{ false }}">
  // <view class="modalInfo">
  // 用户未登录
  // </view>
  // <view slot="footer" class="footerButton">
  // <view class="modalButton confirm " onTap="onModalClose">取消</view>
  // <view class="modalButton cancel " onTap="isloginFn">登录</view>
  // </view>
  // </modal>
})