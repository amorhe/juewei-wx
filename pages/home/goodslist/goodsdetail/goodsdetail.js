import {
  imageUrl,
  imageUrl2,
  imageUrl3,
  img_url,
  wxGet,
  wxSet
} from '../../../common/js/baseUrl'
import {
  commentList,
  DispatchCommentList
} from '../../../common/js/home'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 0,
    tabActive: 0,
    tabs: [{
        title: '商品简介'
      },
      {
        title: '商品详情'
      }
    ],
    tabsT: [{
        title: '商品口味'
      },
      {
        title: '配送服务'
      }
    ],
    imageUrl,
    imageUrl2,
    imageUrl3,
    img_url,
    // 评论
    commentArr: [],
    key: '',
    index: '',
    dispatchArr: [],
    maskView: false,
    goodsItem: {},
    shopcartList: {}, // 购物车缓存数据
    shopcartAll: [],
    priceAll: 0,
    goodsLast: '',
    shopcartNum: 0,
    goodsKey: '',
    activityText: '',
    pagenum: 1,
    pagesize: 10,
    freeText: '',
    freeMoney: 0,
    goodsInfo: {}, // 商品数据
    repurse_price: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    let goods = app.globalData.goodsArr,
      goodlist = wxGet('goodsList') || {},
      goodsInfo = {},
      priceAll = 0,
      shopcartAll = [],
      shopcartNum = 0,
      priceFree = 0,
      repurse_price = 0,
      shop_id = wxGet('shop_id') || {};
    for (let value of goods) {
      if (value.goods_code == e.goods_code) {
        goodsInfo = value;
        goodsInfo['key'] = e.goodsKey
      }
    }
    for (let keys in goodlist) {
      if (goodlist[keys].goods_order_limit != null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
        priceAll += goodlist[keys].goods_price * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        if (keys.indexOf('PKG') == -1) {
          priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        }
      } else {
        priceAll += goodlist[keys].goods_price * goodlist[keys].num;
      }
      // 计算包邮商品价格
      if (!goodlist[keys].goods_discount) {
        priceFree += goodlist[keys].goods_price * goodlist[keys].num;
      }
      // 计算可换购商品价格
      if (goodlist[keys].huangou) {
        repurse_price += goodlist[keys].goods_price * goodlist[keys].num;
      }
      shopcartAll.push(goodlist[keys]);
      shopcartNum += goodlist[keys].num
    }
    this.setData({
      goodsInfo,
      shopcartList: goodlist,
      priceAll,
      shopcartAll,
      shopcartNum,
      goodsKey: e.goodsKey,
      freeMoney: e.freeMoney,
      repurse_price
    })
    // 购物车活动提示
    this.funShopcartPrompt(app.globalData.fullActivity, priceFree, repurse_price)
    // 评论
    this.funGetCommentList(goodsInfo.goods_code, this.data.pagenum, this.data.pagesize);
    this.funGetDispatchCommentList(shop_id, this.data.pagenum, this.data.pagesize)
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
    this.data.pagenum++;
    const shop_id = wxGet('shop_id') || '';
    this.funGetCommentList(this.data.goodsInfo.goods_code, this.data.pagenum, this.data.pagesize);
    this.funGetDispatchCommentList(shop_id, this.data.pagenum, this.data.pagesize)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 购物车活动提示
  funShopcartPrompt(oldArr, priceFree, repurse_price) {
    let activityText = '',
      freeText = '';
    for (let v of oldArr) {
      if (oldArr.findIndex(v => v > repurse_price) != -1) {
        if (oldArr.findIndex(v => v > repurse_price) == 0) {
          activityText = `只差${(oldArr[0] - repurse_price) / 100}元,超值福利等着你!`
        } else if (oldArr.findIndex(v => v > repurse_price) > 0 && oldArr.findIndex(v => v > repurse_price) < oldArr.length) {
          activityText = `已购满${oldArr[oldArr.findIndex(v => v > repurse_price) - 1] / 100}元,去结算享受换购优惠;满${oldArr[oldArr.findIndex(v => v > repurse_price)] / 100}元更高福利等着你!`
        } else {
          activityText = `已购满${oldArr[oldArr.length - 1] / 100}元,去结算获取优惠!`
        }
      } else {
        activityText = `已购满${oldArr[oldArr.length - 1] / 100}元,去结算获取优惠!`
      }
    }
    if (priceFree == 0) {
      freeText = `满${this.data.freeMoney / 100}元 免配送费`
    } else if (priceFree < this.data.freeMoney) {
      freeText = `还差${(this.data.freeMoney / 100 - priceFree / 100).toFixed(2)}元 免配送费`
    } else {
      freeText = `已满${this.data.freeMoney / 100}元 免配送费`
    }
    this.setData({
      activityText,
      freeText
    })
  },
  //关闭遮罩
  eveCloseModal(data) {
    this.setData({
      maskView: data.detail.maskView,
      goodsModal: data.detail.goodsModal
    })
  },
  // 简介、详情
  eveChangeMenu(e) {
    this.setData({
      activeTab: e.currentTarget.dataset.cur
    })
  },
  // 口味、服务
  eveChangeTab(e) {
    this.setData({
      tabActive: e.currentTarget.dataset.cur,
      pagenum: 1
    });
  },
  // 商品评价
  funGetCommentList(goods_code, pagenum, pagesize) {
    commentList(goods_code, pagenum, pagesize, 2).then((res) => {
      this.setData({
        commentArr: res
      })
    })
  },
  // 配送评价
  funGetDispatchCommentList(shop_id, pagenum, pagesize) {
    DispatchCommentList(shop_id, pagenum, pagesize, 2).then((res) => {
      this.setData({
        dispatchArr: res
      })
    })
  },
  // sku加入购物车弹框
  eveChooseSizeTap(e) {
    this.setData({
      maskView: true,
      goodsModal: true,
      goodsItem: e.currentTarget.dataset.item,
      shopcartList: wxGet('goodsList')
    })
  },
  // 清空购物车
  funClearshopcart() {
    this.setData({
      shopcartList: {},
      shopcartAll: {},
      shopcartNum: 0,
      priceAll: 0,
    })
    wxSet('goodsList', {})
  },
  // sku商品
  funCart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price) {
    this.setData({
      shopcartList: goodlist,
      shopcartAll,
      priceAll,
      shopcartNum,
      priceFree,
      repurse_price
    })
  },
  // 监听购物车数据变更
  funChangeShopcart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price) {
    this.funCart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price)
  },
  // 加入购物车
  addshopcart(e) {
    let goods_car = {};
    let goods_code = e.currentTarget.dataset.goods_code;
    let goods_format = e.currentTarget.dataset.goods_format;
    let goodlist = wxGet('goodsList') || {};
    if (goodlist[`${goods_code}_${goods_format}`]) {
      goodlist[`${goods_code}_${goods_format}`].num += 1;
      goodlist[`${goods_code}_${goods_format}`].sumnum += 1;
    } else {
      let oneGood = {};
      if (e.currentTarget.dataset.goods_discount) {
        oneGood = {
          "goods_name": e.currentTarget.dataset.goods_name,
          "taste_name": e.currentTarget.dataset.taste_name,
          "goods_price": e.currentTarget.dataset.goods_price * 100,
          "num": 1,
          "sumnum": 1,
          "goods_code": e.currentTarget.dataset.goods_code,
          "goods_activity_code": e.currentTarget.dataset.goods_activity_code,
          "goods_discount": e.currentTarget.dataset.goods_discount,
          "goods_original_price": e.currentTarget.dataset.goods_original_price * 100,
          "goods_discount_user_limit": e.currentTarget.dataset.goods_discount_user_limit,
          "goods_order_limit": e.currentTarget.dataset.goods_order_limit,
          "goods_format": goods_format,
          "goods_img": e.currentTarget.dataset.goods_img,
          "sap_code": e.currentTarget.dataset.sap_code
        }
      } else {
        oneGood = {
          "goods_name": e.currentTarget.dataset.goods_name,
          "taste_name": e.currentTarget.dataset.taste_name,
          "goods_price": e.currentTarget.dataset.goods_price * 100,
          "num": 1,
          "sumnum": 1,
          "goods_code": e.currentTarget.dataset.goods_code,
          "goods_format": goods_format,
          "goods_img": e.currentTarget.dataset.goods_img,
          "sap_code": e.currentTarget.dataset.sap_code,
          "huangou": e.currentTarget.dataset.huangou
        }
      }
      goodlist[`${goods_code}_${goods_format}`] = oneGood;
    }
    let shopcartAll = [],
      priceAll = 0,
      shopcartNum = 0,
      priceFree = 0,
      repurse_price = 0;
    for (let keys in goodlist) {
      if (e.currentTarget.dataset.goods_discount) {
        if (goodlist[keys].goods_order_limit != null && goodlist[`${e.currentTarget.dataset.goods_code}_${e.currentTarget.dataset.goods_format}`].num > e.currentTarget.dataset.goods_order_limit) {
          wx.showToast({
            title: `折扣商品限购${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}，超过${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}恢复原价`,
            icon: 'none'
          });
          priceAll += goodlist[keys].goods_price * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
          if (e.currentTarget.dataset.key == '折扣') {
            priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
          }
        } else {
          priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        }
      } else {
        priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        priceFree += goodlist[keys].goods_price * goodlist[keys].num;
      }
      // 计算可换购商品价格
      if (goodlist[keys].huangou) {
        repurse_price += goodlist[keys].goods_price * goodlist[keys].num;
      }
      shopcartAll.push(goodlist[keys]);
      shopcartNum += goodlist[keys].num
    }
    // 购物车活动提示
    this.funShopcartPrompt(app.globalData.fullActivity, priceFree, repurse_price);
    this.funChangeShopcart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price)
    this.setData({
      shopcartList: goodlist,
      shopcartAll,
      priceAll,
      shopcartNum
    })
    wxSet('goodsList', goodlist)
  },
  reduceshopcart(e) {
    let code = e.currentTarget.dataset.goods_code;
    let format = e.currentTarget.dataset.goods_format;
    let goodlist = wxGet('goodsList') || {};
    let shopcartAll = [],
      priceAll = 0,
      shopcartNum = 0,
      priceFree = 0,
      repurse_price = 0;
    goodlist[`${code}_${format}`].num -= 1;
    goodlist[`${code}_${format}`].sumnum -= 1;
    for (let keys in goodlist) {
      if (goodlist[keys].goods_order_limit != null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
        priceAll += goodlist[keys].goods_price * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        if (keys.indexOf('PKG') == -1) {
          priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        }
      } else {
        priceAll += goodlist[keys].goods_price * goodlist[keys].num;
      }
      // 计算包邮商品价格
      if (!goodlist[keys].goods_discount) {
        priceFree += goodlist[keys].goods_price * goodlist[keys].num;
      }
      // 计算可换购商品价格
      if (goodlist[keys].huangou) {
        repurse_price += goodlist[keys].goods_price * goodlist[keys].num;
      }
      shopcartAll.push(goodlist[keys]);
      shopcartNum += goodlist[keys].num
    }
    // 删除
    if (goodlist[`${code}_${format}`].num == 0) {
      shopcartAll = this.data.shopcartAll.filter(item => `${item.goods_code}_${format}` != `${code}_${format}`)
      delete(goodlist[`${code}_${format}`]);
    }
    // 购物车活动提示
    this.funShopcartPrompt(app.globalData.fullActivity, priceFree, repurse_price);
    this.funChangeShopcart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price)
    this.setData({
      shopcartList: goodlist,
      shopcartAll,
      priceAll,
      shopcartNum
    })
    wxSet('goodsList', goodlist)
  },
})