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
import {
  startAddShopAnimation
} from '../../../common/js/AddShopCar.js'
const {
  $Toast
} = require('../../../../iview-weapp/base/index');
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
    commentArr: {
      data: []
    },
    key: '',
    index: '',
    dispatchArr: {
      data: []
    },
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
    freeMoney: -1,
    goodsInfo: {}, // 商品数据
    repurse_price: 0,
    freeId: '',
    type: 1,
    goods_code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    this.setData({
      goods_code: e.goods_code
    })
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    let isPhone = app.globalData.isIphoneX;
    let
      num = 0, // 购物车总数量
      shopcartAll = [], // 购物车数组
      priceAll = 0, // 总价
      shopcartNum = 0, // 购物车总数量
      priceFree = 0, // 满多少包邮
      shopcartObj = {}, //商品列表 
      repurse_price = 0, // 换购活动提示价
      snum = 0,
      goodsInfo = {},
      goods = app.globalData.goodsArr,
      shop_id = wxGet('shop_id') || {},
      DIS = app.globalData.DIS,
      PKG = app.globalData.PKG,
      goodsList = wxGet('goodsList');
    if (goodsList == undefined) {
      shopcartAll = [];
      shopcartNum = 0;
      priceFree = 0;
      priceAll = 0;
      repurse_price = 0
    };
    for (let value of goods) {
      // 折扣套餐爆款
      if (value.goods_discount_user_limit || value.goods_discount_id) {
        if (value.goods_format[0].goods_activity_code == this.data.goods_code) {
          goodsInfo = value;
        }
      } else {
        if (value.goods_channel + value.goods_type + value.company_goods_id == this.data.goods_code) {
          goodsInfo = value;
        }
      }
    }
    // 判断购物车商品是否在当前门店里
    for (let val in goodsList) {
      if (goodsList[val].goods_discount) {
        if (DIS != null || PKG != null) {
          // 折扣
          if (goodsList[val].goods_code.indexOf('PKG') == -1 && DIS != null) {
            for (let ott of DIS) {
              for (let fn of ott.goods_format) {
                if (val == `${fn.goods_activity_code}_${fn.type}`) {
                  shopcartObj[val] = goodsList[val];
                  // 判断购物车商品价格更新
                  if (goodsList[val].goods_price != fn.goods_price) {
                    snum += shopcartObj[val].num;
                    shopcartObj[val].goods_price = fn.goods_price
                  }
                }
              }
            }
          } else {
            // 套餐
            if (PKG != null) {
              for (let ott of PKG) {
                for (let fn of ott.goods_format) {
                  if (val == `${fn.goods_activity_code}_${fn.type != undefined ? fn.type : ''}`) {
                    shopcartObj[val] = goodsList[val];
                    // 判断购物车商品价格更新
                    if (goodsList[val].goods_price != fn.goods_price) {
                      snum += shopcartObj[val].num;
                      shopcartObj[val].goods_price = fn.goods_price
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        // 普通不带折扣的
        if (app.globalData.goodsCommon) {
          for (let value of app.globalData.goodsCommon) {
            for (let fn of value.goods_format) {
              // 在门店
              if (val == `${value.goods_channel}${value.goods_type}${value.company_goods_id}_${fn.type}`) {
                shopcartObj[val] = goodsList[val];
                // 判断购物车商品价格更新
                if (goodsList[val].goods_price != fn.goods_price) {
                  snum += shopcartObj[val].num;
                  shopcartObj[val].goods_price = fn.goods_price
                }
              }
            }
          }
        }
      }
      num += goodsList[val].num;
      // 计算购物车是否在门店内后筛选剩余商品价格
      if (shopcartObj[val]) { //判断商品是否存在
        if (shopcartObj[val].goods_discount && shopcartObj[val].num > shopcartObj[val].goods_order_limit) {
          priceAll += shopcartObj[val].goods_price * shopcartObj[val].goods_order_limit + (shopcartObj[val].num - goodsList[val].goods_order_limit) * shopcartObj[val].goods_original_price;
          priceFree += (shopcartObj[val].num - shopcartObj[val].goods_order_limit) * shopcartObj[val].goods_original_price;
        } else if (shopcartObj[val].goods_price && shopcartObj[val].num) {
          priceAll += shopcartObj[val].goods_price * shopcartObj[val].num;
        } else {

        }
        // 计算包邮商品价格
        if (!shopcartObj[val].goods_discount) {
          priceFree += shopcartObj[val].goods_price * shopcartObj[val].num;
        }
        // 计算可换购商品价格
        if (app.globalData.repurseGoods && app.globalData.repurseGoods.length > 0) {
          if (shopcartObj[val].huangou && shopcartObj[val].goods_price && shopcartObj[val].num) {
            repurse_price += shopcartObj[val].goods_price * shopcartObj[val].num;
          }
        } else {
          repurse_price = priceAll
        }
        shopcartAll.push(shopcartObj[val]);
        shopcartNum += shopcartObj[val].num;
      }
    }
    // 购物车活动提示
    if (!wxGet('goodsList')) {
      let data = {}
      this.funChangeShopcart(data);
    } else {
      this.funShopcartPrompt(app.globalData.fullActivity, priceFree, repurse_price)
    }
    this.setData({
      shopcartList: shopcartObj,
      priceAll,
      shopcartAll,
      shopcartNum,
      priceFree,
      repurse_price,
      goodsInfo,
      freeMoney: app.globalData.freeMoney || -1,
      repurse_price,
      freeId: app.globalData.freeId,
      type: app.globalData.type
    })
    wxSet('goodsList', shopcartObj);
    // 评论
    this.funGetCommentList(this.data.goods_code, this.data.pagenum, this.data.pagesize);
    this.funGetDispatchCommentList(shop_id, this.data.pagenum, this.data.pagesize)
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
  funGetMoreComment() {
    this.data.pagenum++;
    this.funGetCommentList(this.data.goodsInfo.goods_code, this.data.pagenum, this.data.pagesize);
  },
  funGetMoreDispatch() {
    this.data.pagenum++;
    const shop_id = wxGet('shop_id') || '';
    this.funGetDispatchCommentList(shop_id, this.data.pagenum, this.data.pagesize)
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
    if (this.data.freeMoney > 0) {
      app.globalData.freetf = false; //orderconform中是否传送freeid
      if (priceFree == 0) {
        freeText = `满${this.data.freeMoney / 100}元 免配送费`
      } else if (priceFree < this.data.freeMoney) {
        freeText = `还差${(this.data.freeMoney / 100 - priceFree / 100).toFixed(2)}元 免配送费`
      } else {
        freeText = `已满${this.data.freeMoney / 100}元 免配送费`
        //加入变量说明可以免配送
        app.globalData.freetf = true;
      }
    }else if(this.data.freeMoney == 0) {
      freeText = '免配送费'
      //加入变量说明可以免配送
      app.globalData.freetf = true;
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
  // 商品口味评价
  funGetCommentList(goods_code, pagenum, pagesize) {
    commentList(goods_code, pagenum, pagesize, 0, 'all', '').then((res) => {
      let commentArr = this.data.commentArr.data;
      if (res.data.length > 0) {
        let newcommentArr = commentArr.concat(res.data);
        res.data = newcommentArr
      }
      this.setData({
        commentArr: res
      })
    })
  },
  // 配送评价
  funGetDispatchCommentList(shop_id, pagenum, pagesize) {
    DispatchCommentList(shop_id, pagenum, pagesize, 0, 'all', '').then((res) => {
      let dispatchArr = this.data.dispatchArr.data;
      if (res.data.length > 0) {
        let newdispatchArr = dispatchArr.concat(res.data);
        res.data = newdispatchArr
      }
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
    wxSet('goodsList', {});
    this.funShopcartPrompt(app.globalData.fullActivity, 0, 0)
  },
  // sku商品
  funCart(data) {
    this.setData({
      shopcartList: data.detail.goodlist || {},
      shopcartAll: data.detail.shopcartAll || [],
      priceAll: data.detail.priceAll || 0,
      shopcartNum: data.detail.shopcartNum || 0,
      priceFree: data.detail.priceFree || 0,
      repurse_price: data.detail.repurse_price || 0
    })
    // 购物车活动提示
    this.funShopcartPrompt(app.globalData.fullActivity, data.detail.priceFree || 0, data.detail.repurse_price || 0);
  },
  // 监听购物车数据变更
  funChangeShopcart(data) {
    this.funCart(data)
  },
  // 购物车小球动画
  funAnimate(e) {
    let finger = {};
    finger['x'] = e.detail.touches[0].clientX / wx.getSystemInfoSync().windowWidth * 750;
    finger['y'] = e.detail.touches[0].clientY / wx.getSystemInfoSync().windowWidth * 750;
    startAddShopAnimation([{
      x: 80,
      y: 750 * wx.getSystemInfoSync().windowHeight / wx.getSystemInfoSync().windowWidth - 100
    }, finger], this);
  },
  // 加入购物车
  addshopcart(e) {
    let events = {
      detail: e
    }
    this.funAnimate(events);

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
      if (!goodlist[keys].goods_price) {
        continue;
      }
      if (e.currentTarget.dataset.goods_discount) {
        if (goodlist[keys].goods_order_limit && goodlist[keys].goods_order_limit != null && goodlist[`${e.currentTarget.dataset.goods_code}_${goods_format}`].num > e.currentTarget.dataset.goods_order_limit) {
          $Toast({
            content: `折扣商品限购${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}，超过${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}恢复原价`
          })
        }
      }
      if (goodlist[keys].goods_order_limit && goodlist[keys].goods_order_limit != null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
        priceAll += goodlist[keys].goods_price * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        if (keys.indexOf('PKG') == -1) {
          priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        }
      } else if (goodlist[keys].goods_price && goodlist[keys].num){
        priceAll += goodlist[keys].goods_price * goodlist[keys].num;
      }else{

      }
      // 计算包邮商品价格
      if (!goodlist[keys].goods_discount) {
        priceFree += goodlist[keys].goods_price * goodlist[keys].num;
      }
      // 计算可换购商品价格
      if (app.globalData.repurseGoods && app.globalData.repurseGoods.length > 0) {
        if (goodlist[keys].huangou && goodlist[keys].goods_price && goodlist[keys].num) {
          repurse_price += goodlist[keys].goods_price * goodlist[keys].num;
        }
      } else {
        repurse_price = priceAll
      }
      shopcartAll.push(goodlist[keys]);
      shopcartNum += goodlist[keys].num
    }

    let datas = {
      detail: {
        goodlist,
        shopcartAll,
        priceAll,
        shopcartNum,
        priceFree,
        repurse_price
      }
    };
    this.funChangeShopcart(datas)
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
      repurse_price = 0,
      newGoodlist = {};
    goodlist[`${code}_${format}`].num -= 1;
    goodlist[`${code}_${format}`].sumnum -= 1;
    for (let keys in goodlist) {
      if (!goodlist[keys].goods_price) {
        continue;
      }
      if (goodlist[keys].goods_order_limit && goodlist[keys].goods_order_limit != null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
        priceAll += goodlist[keys].goods_price * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        if (keys.indexOf('PKG') == -1) {
          priceFree += (parseInt(goodlist[keys].num) - parseInt(goodlist[keys].goods_order_limit)) * parseInt(goodlist[keys].goods_original_price);
        }
      } else if (goodlist[keys].goods_price && goodlist[keys].num){
        priceAll += goodlist[keys].goods_price * goodlist[keys].num;
      } else {

      }
      // 计算包邮商品价格
      if (!goodlist[keys].goods_discount) {
        priceFree += goodlist[keys].goods_price * goodlist[keys].num;
      }
      // 计算可换购商品价格
      if (app.globalData.repurseGoods && app.globalData.repurseGoods.length > 0) {
        if (goodlist[keys].huangou && goodlist[keys].goods_price && goodlist[keys].num) {
          repurse_price += goodlist[keys].goods_price * goodlist[keys].num;
        }
      } else {
        repurse_price = priceAll
      }
      if (goodlist[keys].num > 0) {
        newGoodlist[keys] = goodlist[keys]
        shopcartAll.push(goodlist[keys]);
        shopcartNum += goodlist[keys].num
      }
    }
    let datas = {
      detail: {
        goodlist: newGoodlist,
        shopcartAll,
        priceAll,
        shopcartNum,
        priceFree,
        repurse_price
      }
    };
    this.funChangeShopcart(datas)
    this.setData({
      shopcartList: newGoodlist,
      shopcartAll,
      priceAll,
      shopcartNum
    })
    wxSet('goodsList', newGoodlist)
  },
})