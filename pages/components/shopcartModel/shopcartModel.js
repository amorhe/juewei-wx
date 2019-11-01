import {
  imageUrl,
  jsonUrl,
  wxGet,
  wxSet
} from '../../common/js/baseUrl'
import {
  compare,
  upformId
} from '../../common/js/time'
import {
  navigateTo
} from '../../common/js/router.js'
import {
  getCurUrl
} from '../../common/js/utils.js'
import {
  startAddShopAnimation
} from '../../common/js/AddShopCar.js'
const {
  $Toast
} = require('../../../iview-weapp/base/index');
let log = console.log
var app = getApp();
Component({
  // 组件样式隔离
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    shopcartAll: Array,
    activityText: String,
    shopcartNum: Number,
    priceAll: Number,
    type: Number,
    freeId: String,
    freeText: String,
    isOpen: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    showShopcar: false, //购物车
    mask: false, //遮罩
    imageUrl, // 图片url
    modalShow: false, //弹框
    mask1: false,
    send_price: "", //起送费
    dispatch_price: '', // 配送费
    isType: '',
    content: '',
    otherGoods: [],
    confirmButtonText: '',
    cancelButtonText: '',
    type: '',
    btnClick: true,
    freeShow: false, // 是否有包邮活动
    isTake: false,
    isOpen: '',
    priceAll: 0,
    h: 0,
    curUrl: false,
  },
  observers: {
    '**': function() {

    }
  },
  /**
   * 组件的方法列表
   */
  ready() {
    this.setData({
      activityText: this.properties.activityText,
      shopcartAll: this.properties.shopcartAll,
      shopcartNum: this.properties.shopcartNum,
      priceAll: this.properties.priceAll,
      isOpen: this.properties.isOpen,
      type: this.properties.type,
      freeText: this.properties.freeText
    })
    this.funGetSendPrice();
    let isPhone = app.globalData.isIphoneX;
    if (isPhone) {
      this.setData({
        bottomTabbar: 146,
      })
    }
    if (getCurUrl() === 'pages/home/goodslist/goodslist') {
      if (isPhone) {
        this.setData({
          h: '246rpx',
          curUrl: true
        })
      } else {
        this.setData({
          h: '198rpx',
          curUrl: true
        })
      }
    }
    if (getCurUrl() === 'pages/home/goodslist/goodsdetail/goodsdetail') {
      this.setData({
        h: '98rpx'
      })
    }
  },

  methods: {
    // 打开购物车
    eveOpenShopcart() {
      this.setData({
        showShopcar: true,
        mask1: true
      })
      this.triggerEvent('OpenShopcar', true)
    },
    // 隐藏购物车
    eveHiddenShopcart() {
      this.setData({
        showShopcar: false,
        mask1: false
      })
      this.triggerEvent('OpenShopcar', false)
    },
    // 清空购物车
    eveClearShopcart() {
      var that = this;
      that.setData({
        mask1: false
      })
      wx.showModal({
        content: '是否清空购物车？',
        cancelText: "确定",
        confirmText: "取消",
        cancelColor: "#999999",
        confirmColor: "#E60012",
        success(res) {
          if (res.confirm) {
            console.log('用户点击取消')
            that.setData({
              mask1: true
            })
          } else if (res.cancel) {
            console.log('用户点击确定')
            that.setData({
              showShopcar: false
            })
            that.triggerEvent('Clearshopcart');
            that.triggerEvent('OpenShopcar', false)
          }
        }
      })
    },
    // 获取起送价格
    funGetSendPrice() {
      const timestamp = new Date().getTime();
      let opencity = (wxGet('opencity') || null);
      let cityAdcode = '';
      if (app.globalData.type == 1) {
        cityAdcode = wxGet('takeout')[0].city_id;
      } else {
        cityAdcode = wxGet('self')[0].city_id
      }
      if (opencity) {
        this.setData({
          send_price: opencity[cityAdcode].shop_send_price,
          dispatch_price: opencity[cityAdcode].shop_dispatch_price
        });
        //存储一个起送起购价格
        wxSet('send_price', opencity[cityAdcode].shop_send_price)
        //存储一个配送费
        wxSet('dispatch_price', opencity[cityAdcode].shop_dispatch_price)
      } else {
        wx.request({
          url: `${jsonUrl}/api/shop/open-city.json?v=${timestamp}`,
          success: (res) => {
            //app.globalData.position.cityAdcode这个参数在手动修改地址的时候缺失。
            //这里采用通过门店的具体地址来确定起送价地址
            this.setData({
              send_price: res.data.data[cityAdcode].shop_send_price,
              dispatch_price: res.data.data[cityAdcode].shop_dispatch_price
            })
            //存储一个起送起购价格
            wxSet('send_price', res.data.data[cityAdcode].shop_send_price)
            //存储一个配送费
            wxSet('dispatch_price', res.data.data[cityAdcode].shop_dispatch_price)
            wxSet('opencity', res.data.data)
          },
        });
      }
    },
    eveAddshopcart(e) {
      // 购物车小球动画
      this.triggerEvent('Animate', e);
      let goodlist = wxGet('goodsList') || {};
      let goods_code = e.currentTarget.dataset.goods_code;
      let goods_format = e.currentTarget.dataset.goods_format
      goodlist[`${goods_code}_${goods_format}`].num += 1;
      let shopcartAll = [],
        priceAll = 0,
        shopcartNum = 0,
        priceFree = 0,
        repurse_price = 0;
      for (let keys in goodlist) {
        if (!goodlist[keys].goods_price) {
          continue
        }
        if (e.currentTarget.dataset.goods_discount) {
          if (goodlist[keys].goods_order_limit != null && goodlist[`${e.currentTarget.dataset.goods_code}_${goods_format}`].num > e.currentTarget.dataset.goods_order_limit) {
            $Toast({
              content: `折扣商品限购${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}，超过${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}恢复原价`
            })
          }
        }
        if (goodlist[keys].goods_order_limit != null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
          priceAll += goodlist[keys].goods_price * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
          if (keys.indexOf('PKG') == -1) {
            priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
          }
        } else if (goodlist[keys].goods_price && goodlist[keys].num) {
          priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        }else{

        }
        // 计算可换购商品价格
        if (app.globalData.repurseGoods.length > 0) {
          if (goodlist[keys].huangou && goodlist[keys].goods_price && goodlist[keys].num) {
            repurse_price += goodlist[keys].goods_price * goodlist[keys].num;
          }
        } else {
          repurse_price = priceAll
        }
        shopcartAll.push(goodlist[keys]);
        shopcartNum += goodlist[keys].num
      }
      let arr = shopcartAll.filter(item => item.goods_code == goods_code)
      for (let item of arr) {
        goodlist[`${item.goods_code}_${item.goods_format}`].sumnum += 1;
      }
      this.funChangeshopcart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price)
      wxSet('goodsList', goodlist)
    },
    eveReduceshopcart(e) {
      let code = e.currentTarget.dataset.goods_code;
      let format = e.currentTarget.dataset.goods_format
      let goodlist = wxGet('goodsList') || {};
      goodlist[`${code}_${format}`].num -= 1;
      // 删除
      let shopcartAll = [],
        priceAll = 0,
        shopcartNum = 0,
        priceFree = 0,
        repurse_price = 0,
        newGoodlist = {};
      let arr = this.data.shopcartAll.filter(item => item.goods_code == code)
      for (let item of arr) {
        goodlist[`${item.goods_code}_${item.goods_format}`].sumnum -= 1;
      }
      for (let keys in goodlist) {
        if (!goodlist[keys].goods_price) {
          continue
        }
        if (goodlist[keys].goods_order_limit && goodlist[keys].num > goodlist[keys].goods_order_limit) {
          priceAll += goodlist[keys].goods_price * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        } else if (goodlist[keys].goods_price && goodlist[keys].num) {
          priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        }else{
          
        }
        if (!goodlist[keys].goods_discount) {
          priceFree += goodlist[keys].goods_price * goodlist[keys].num;
        }
        // 计算可换购商品价格
        if (app.globalData.repurseGoods.length > 0) {
          if (goodlist[keys].huangou && goodlist[keys].goods_price && goodlist[keys].num) {
            repurse_price += goodlist[keys].goods_price * goodlist[keys].num;
          }
        } else {
          repurse_price = priceAll
        }
        if (goodlist[keys].num > 0) {
          newGoodlist[keys] = goodlist[keys];
          shopcartAll.push(goodlist[keys]);
          shopcartNum += goodlist[keys].num
        }
      }
      this.funChangeshopcart(newGoodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price);
      wxSet('goodsList', newGoodlist)
      // 购物车全部为空
      if (Object.keys(newGoodlist).length == 0) {
        this.setData({
          showShopcar: false,
          mask1: false
        })
      }
    },
    funChangeshopcart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price) {
      let data = {
        goodlist,
        shopcartAll,
        priceAll,
        shopcartNum,
        priceFree,
        repurse_price
      }
      this.triggerEvent('ChangeShopcart', data)
    },
    // 立即购买
    eveGoOrderSubmit() {
      // js节流防短时间重复点击
      if (this.data.btnClick == false) {
        return
      }
      this.setData({
        btnClick: false
      })
      setTimeout(() => {
        this.setData({
          btnClick: true
        })
      }, 1000)

      //  数据加载完成前防止点击
      if (!app.globalData.goodsArr) {
        return
      }
      // 未登录
      if (wxGet('userInfo').user_id == undefined) {
        navigateTo({
          url: '/pages/login/auth/auth'
        })
        return
      }
      let goodsList = wxGet('goodsList');
      let
        num = 0, // 购物车总数量
        shopcartAll = [], // 购物车数组
        priceAll = 0, // 总价
        shopcartNum = 0, // 购物车总数量
        priceFree = 0, // 满多少包邮
        shopcartObj = {}, //商品列表 
        repurse_price = 0, // 换购活动提示价
        snum = 0,
        DIS = app.globalData.DIS || [],
        PKG = app.globalData.PKG || [],
        isfresh1 = false,
        isfresh2 = false,
        isfresh3 = false;
      if (goodsList == null) return;
      // 判断购物车商品是否在当前门店里
      for (let val in goodsList) {
        if (goodsList[val].goods_discount) {
          // 折扣
          if (goodsList[val].goods_code.indexOf('PKG') == -1) {
            for (let ott of DIS) {
              for (let fn of ott.goods_format) {
                if (val == `${fn.goods_activity_code}_${fn.type}`) {
                  shopcartObj[val] = goodsList[val];
                  // 判断购物车商品价格更新
                  if (parseInt(goodsList[val].goods_price) != parseInt(fn.goods_price)) {
                    snum += shopcartObj[val].num;
                    shopcartObj[val].goods_price = fn.goods_price;
                    isfresh1 = true;
                  }
                }
              }
            }

          } else {
            // 套餐
            for (let ott of PKG) {
              for (let fn of ott.goods_format) {
                if (val == `${fn.goods_activity_code}_${fn.type != undefined ? fn.type:''}`) {
                  shopcartObj[val] = goodsList[val];
                  // 判断购物车商品价格更新
                  if (parseInt(goodsList[val].goods_price) != parseInt(fn.goods_price)) {
                    snum += shopcartObj[val].num;
                    shopcartObj[val].goods_price = fn.goods_price;
                    isfresh2 = true;
                  }
                }
              }
            }
          }
        } else {
          // 普通不带折扣的
          for (let value of app.globalData.goodsCommon) {
            for (let fn of value.goods_format) {
              // 在门店
              if (val == `${value.goods_channel}${value.goods_type}${value.company_goods_id}_${fn.type}`) {
                shopcartObj[val] = goodsList[val];
                // 判断购物车商品价格更新
                if (parseInt(goodsList[val].goods_price) != parseInt(fn.goods_price)) {
                  snum += shopcartObj[val].num;
                  shopcartObj[val].goods_price = fn.goods_price;
                  isfresh3 = true;
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
          } else {
            priceAll += shopcartObj[val].goods_price * shopcartObj[val].num;
          }
          if (!shopcartObj[val].goods_discount) {
            priceFree += shopcartObj[val].goods_price * shopcartObj[val].num;
          }
          if (app.globalData.repurseGoods.length > 0) {
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
      // 购物车筛选后剩余数量
      shopcartNum = Object.entries(shopcartObj).reduce((pre, cur) => {
        const {
          num
        } = cur[1]
        return pre + num
      }, 0)
      this.funChangeshopcart(shopcartObj, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price);
      wxSet('goodsList', shopcartObj);
      app.globalData.goodsBuy = shopcartAll;
      if (num - shopcartNum > 0 && snum > 0) {
        return this.setData({
          showShopcar: false,
          mask1: false,
          mask: true,
          modalShow: true,
          isType: 'checkshopcart',
          content: `有${num - shopcartNum}个商品已失效，${snum}个商品价格已更新，是否继续下单`,
          confirmButtonText: '重新选择',
          cancelButtonText: '继续结算',
          btnClick: true
        })
      } else if (num - shopcartNum > 0 && snum == 0) {
        return this.setData({
          showShopcar: false,
          mask1: false,
          mask: true,
          modalShow: true,
          isType: 'checkshopcart',
          content: `有${num - shopcartNum}个商品已失效，是否继续下单`,
          confirmButtonText: '重新选择',
          cancelButtonText: '继续结算',
          btnClick: true
        })
      } else if (num - shopcartNum == 0 && snum > 0 && (isfresh1 || isfresh2 || isfresh3)) {
        return this.setData({
          showShopcar: false,
          mask1: false,
          mask: true,
          modalShow: true,
          isType: 'checkshopcart',
          content: `有${snum}个商品价格已更新，是否继续下单`,
          confirmButtonText: '重新选择',
          cancelButtonText: '继续结算',
          btnClick: true
        })
      }
      navigateTo({
        url: '/pages/home/orderform/orderform'
      })
    },
    touchstart() {

    }
  }
})