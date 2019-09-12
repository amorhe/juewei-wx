// pages/vip/index/index.js
import {
  imageUrl,
  imageUrl2,
  wxGet
} from '../../common/js/baseUrl'
import Request from '../../common/js/li-ajax'
import {
  event_getNavHeight,
  event_getUserPoint
} from '../../common/js/utils'
import { navigateTo } from "../../common/js/router";

const app = getApp();
const my = wx;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    imageUrl2,

    finish: false,
    toast: false,

    _sid: '',
    navHeight: '',
    loginFinish: false,

    menuTop: 0,
    menuFixed: false,

    shop_id: '',
    district_id: 110105,
    cate_id: 0,
    page_num: 1,
    page_size: 10000,
    company_id: 1,
    city_id: 110100,
    release_channel: 1,

    cur: 0,

    userPoint: '',
    bannerList: [],
    positionList: [],
    new_user: [],
    list: [],
    goodsList: [],

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
  async onShow() {
    // 查看用户登录状态
    await event_getUserPoint();
    let _sid = wxGet('_sid');
    //获取当前所需要的分子公司id,城市id，门店id,区域id
    const {
      company_sale_id: company_id,
      city_id,
      shop_id,
      district_id
    } = (app.globalData.shopTakeOut || my.getStorageSync('takeout')[0]);
    let navHeight = event_getNavHeight();
    this.setData({
      _sid,
      navHeight,
      city_id,
      district_id,
      company_id,
      shop_id,
      loginFinish: true,
      cur: 0
    }, async () => {
      //  获取列表信息
      this.event_getBanner();
      this.event_getPositionList();
      this.event_getCouponsList();
      // 先获取 目录 之后才能获取 商品列表
      await this.event_getCategory();
      this.event_getGoodsList();
    })
  },

  navigateTo,

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  /**
   * @function 获取轮播
   */
  async event_getBanner() {
    const {
      city_id,
      district_id,
      release_channel
    } = this.data;
    const bannerListOption = {
      city_id,
      district_id,
      release_channel
    };
    let res = await Request.reqBanner(bannerListOption);
    if (res.code === 100) {
      this.setData({
        bannerList: res.data
      })
    }
  },

  /**
   * @function 获取位置列表
   */
  async event_getPositionList() {
    let {
      city_id,
      district_id,
      company_id,
      release_channel
    } = this.data;
    let positionListOption = {
      city_id,
      district_id,
      company_id,
      release_channel
    };
    let res = await Request.reqPositionList(positionListOption);
    if (res.code === 100) {
      if (!res.data.length) {
        return this.setData({
          positionList: []
        })
      }
      let {
        pic_src,
        link_url
      } = res.data[0];
      let positionList = pic_src.map((pic, index) => {
        return {
          pic,
          url: link_url[index]
        }
      });

      this.setData({
        positionList
      })
    }
  },

  /**
   * @function 获取礼包列表
   */
  async event_getCouponsList() {
    let res = await Request.reqCouponsList();
    if (res.CODE === 'A100') {
      this.setData({
        new_user: res.DATA.new_user
      })
    } else {
      this.setData({
        new_user: []
      })
    }
  },

  /**
   * @function 获取分类
   */
  async event_getCategory() {
    const {
      cur
    } = this.data;
    let res = await Request.reqCategory({
      type: 1
    });
    if (res.code === 100) {
      this.setData({
        list: res.data,
        cate_id: res.data[cur].id
      })
    }
  },


  /**
   * @function 获取商品列表
   */
  async event_getGoodsList() {
    let {
      shop_id,
      district_id,
      city_id,
      cate_id,
      page_num,
      page_size,
    } = this.data;


    let goodsListOption = {
      shop_id,
      district_id,
      city_id,
      cate_id,
      page_num,
      page_size
    };
    let res = await Request.reqGoodsList(goodsListOption);
    if (res.code === 100) {
      this.setData({
        finish: true,
        goodsList: res.data.data
      })
    }
  },

});