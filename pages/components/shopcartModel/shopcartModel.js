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
    priceAll: Number
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
    freeId: false, // 是否有包邮活动
    isTake: false,
    isOpen: '',
    priceAll: 0
  },
  observers: {
    '**': function() {
      this.data === this.data
    }
  },
  /**
   * 组件的方法列表
   */
  attached() {
    this.setData({
      activityText: this.properties.activityText,
      shopcartAll: this.properties.shopcartAll,
      shopcartNum: this.properties.shopcartNum,
      priceAll: this.properties.priceAll
    })
    this.funGetSendPrice();
  },

  methods: {
    // 打开购物车
    eveOpenShopcart() {
      this.setData({
        showShopcar: true,
        mask1: true
      })
    },
    // 隐藏购物车
    eveHiddenShopcart() {
      this.setData({
        showShopcar: false,
        mask1: false
      })
    },
    // 清空购物车
    eveClearShopcart() {
      var that = this;
      wx.showModal({
        content: '清空购物车？',
        cancelText: "确定",
        confirmText: "取消",
        cancelColor: "#999999",
        confirmColor: "#E60012",
        success(res) {
          if (res.confirm) {
            console.log('用户点击取消')
          } else if (res.cancel) {
            console.log('用户点击确定')
            that.triggerEvent('Clearshopcart');
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
        if (e.currentTarget.dataset.goods_discount && goodlist[keys].goods_order_limit != null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
          wx.showToast({
            title: `折扣商品限购${goodlist[keys].goods_order_limit}份，超过${goodlist[keys].goods_order_limit}份恢复原价`
          });
          priceAll += goodlist[keys].goods_price * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        } else {
          priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        }
        // 包邮商品价格
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
        repurse_price = 0;
      for (let keys in goodlist) {
        if (goodlist[keys].goods_order_limit && goodlist[keys].num > goodlist[keys].goods_order_limit) {
          priceAll += goodlist[keys].goods_price * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        } else {
          priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        }
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
      let arr = this.data.shopcartAll.filter(item => item.goods_code == code)
      for (let item of arr) {
        goodlist[`${item.goods_code}_${item.goods_format}`].sumnum -= 1;
      }
      if (goodlist[`${code}_${format}`].num == 0) {
        shopcartAll = this.data.shopcartAll.filter(item => `${item.goods_code}_${item.goods_format}` != `${code}_${format}`)
        delete(goodlist[`${code}_${format}`]);
      } else {
        shopcartAll = [];
        for (let keys in goodlist) {
          shopcartAll.push(goodlist[keys])
        }
      }
      this.funChangeshopcart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price);
      wxSet('goodsList', goodlist)
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
      this.triggerEvent('ChangeShopcart',data)
    },
  }
})