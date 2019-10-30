// pages/components/goodsModal/goodsModal.js
import {
  imageUrl,
  wxGet,
  wxSet
} from '../../common/js/baseUrl'
import {
  startAddShopAnimation
} from '../../common/js/AddShopCar.js'
const {
  $Toast
} = require('../../../iview-weapp/base/index');
Component({
  // 组件样式隔离
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    maskView: Boolean,
    goodsModal: Boolean,
    goodsKey: String,
    goodsItem: Object,
    priceAll: Number,
    shopcartNum: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageUrl,
    size: 999,
    goodsIndex: '',
    price: 0,
    sizeText: '',
    goods_activity_code: '',
    goods_discount: 0,
    goods_original_price: 0,
    goods_discount_user_limit: 0,
    goods_order_limit: 0,
    shopcartAll: [],
    goodsList: {}
  },
  observers: {
    '**': function() {

    }
  },
  ready() {
    this.setData({
      maskView: this.properties.maskView,
      goodsModal: this.properties.goodsModal,
      goodsKey: this.properties.goodsKey,
      goodsItem: this.properties.goodsItem,
      priceAll: this.properties.priceAll,
      shopcartNum: this.properties.shopcartNum,
      goodsList: this.properties.goodsList
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹框
    eveCloseModal() {
      const goodsModalObj = {
        maskView: false,
        goodsModal: false
      }
      this.triggerEvent('CloseModal', goodsModalObj);
      // 重新选择商品
      this.setData({
        size: 999
      })
    },
    // 选择商品规格
    eveChooseSize(e) {
      this.setData({
        size: e.currentTarget.dataset.size,
        price: this.data.goodsItem.goods_format[e.currentTarget.dataset.size].goods_price / 100,
        sizeText: this.data.goodsItem.goods_format[e.currentTarget.dataset.size].type,
        goodsList: wxGet('goodsList')
      })
    },
    eveAddshopcart(e) {
      if (this.data.size == 999) {
        return
      }
      // 购物车小球动画
      this.triggerEvent('Animate', e);
      let goods_car = {};
      let goods_code = e.currentTarget.dataset.goods_code;
      let goods_format = e.currentTarget.dataset.goods_format;
      let types = [];
      e.currentTarget.dataset.goods_format_all.forEach(item => {
        types.push(item.type);
      })
      let goodlist = wxGet('goodsList') || {};
      let sumnum = 0;
      for (let i = 0; i < types.length; i++) {
        if (goodlist[`${goods_code}_${types[i]}`]) {
          sumnum += goodlist[`${goods_code}_${types[i]}`].num;
        }
      }
      sumnum += 1;
      // 统计总数
      for (let i = 0; i < types.length; i++) {
        if (goodlist[`${goods_code}_${types[i]}`]) {
          goodlist[`${goods_code}_${types[i]}`].sumnum = sumnum
        }
      }
      if (goodlist[`${goods_code}_${goods_format}`]) {
        goodlist[`${goods_code}_${goods_format}`].num++;
      } else {
        let oneGood = {};
        if (e.currentTarget.dataset.goods_discount) {
          oneGood = {
            "goods_name": e.currentTarget.dataset.goods_name,
            "taste_name": e.currentTarget.dataset.taste_name,
            "goods_price": e.currentTarget.dataset.goods_price * 100,
            "num": 1,
            "sumnum": sumnum,
            "goods_code": e.currentTarget.dataset.goods_code,
            "goods_activity_code": e.currentTarget.dataset.goods_activity_code,
            "goods_discount": e.currentTarget.dataset.goods_discount,
            "goods_original_price": e.currentTarget.dataset.goods_original_price,
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
            "sumnum": sumnum,
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
        } else {
          priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        }

        // 计算可换购商品价格
        if (goodlist[keys].huangou) {
          repurse_price += goodlist[keys].goods_price * goodlist[keys].num;
        }
        shopcartAll.push(goodlist[keys]);
        shopcartNum += goodlist[keys].num
      }
      this.setData({
        goodsList: goodlist,
        shopcartAll
      })
      this.bindCart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price);
      wxSet('goodsList', goodlist)
    },
    bindCart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price) {
      let data = {
        goodlist,
        shopcartAll,
        priceAll,
        shopcartNum,
        priceFree,
        repurse_price
      }
      this.triggerEvent('Cart', data)
    },
    eveReduceshopcart(e) {
      let code = e.currentTarget.dataset.goods_code;
      let format = e.currentTarget.dataset.goods_format
      let goodlist = wxGet('goodsList') || {};
      let types = [];
      e.currentTarget.dataset.goods_format_all.forEach(item => {
        types.push(item.type);
      })
      for (let i = 0; i < types.length; i++) {
        if (goodlist[`${code}_${types[i]}`]) {
          goodlist[`${code}_${types[i]}`].sumnum -= 1;
        }
      }
      goodlist[`${code}_${format}`].num -= 1;
      let shopcartAll = [],
        priceAll = 0,
        shopcartNum = 0,
        priceFree = 0,
        repurse_price = 0,
        newGoodlist = {};
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
        if (goodlist[keys].num > 0) {
          newGoodlist[keys] = goodlist[keys];
          shopcartAll.push(goodlist[keys]);
          shopcartNum += goodlist[keys].num;
        }
      }
      this.bindCart(newGoodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price)
      this.setData({
        goodsList: newGoodlist,
        shopcartAll
      })
      wxSet('goodsList', newGoodlist)
    },
    touchstart() {

    }
  },
})