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
  /**
   * 组件的属性列表
   */
  properties: {
    shopcartAll:Array,
    activityText:String,
    shopcartNum:Number,

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
    isOpen: ''
  },

  /**
   * 组件的方法列表
   */
  attached() {
    this.setData({
      activityText: this.properties.activityText,
      shopcartAll:this.properties.shopcartAll,
      shopcartNum:this.properties.shopcartNum
    })
    this.getSendPrice();
  },
  methods: {
    // 获取起送价格
    getSendPrice() {
      const timestamp = new Date().getTime();
      let opencity = (wxGet('opencity') || null);
      if (opencity) {
        this.setData({
          send_price: opencity[app.globalData.position.cityAdcode].shop_send_price,
          dispatch_price: opencity[app.globalData.position.cityAdcode].shop_dispatch_price
        });
        //存储一个起送起购价格
        wxSet('send_price', opencity[app.globalData.position.cityAdcode].shop_send_price)
        //存储一个配送费
        wxSet('dispatch_price', opencity[app.globalData.position.cityAdcode].shop_dispatch_price)
      } else {
        wx.request({
          url: `${jsonUrl}/api/shop/open-city.json?v=${timestamp}`,
          success: (res) => {
            //app.globalData.position.cityAdcode这个参数在手动修改地址的时候缺失。
            //这里采用通过门店的具体地址来确定起送价地址
            this.setData({
              send_price: res.data.data[app.globalData.position.cityAdcode].shop_send_price,
              dispatch_price: res.data.data[app.globalData.position.cityAdcode].shop_dispatch_price
            })
            //存储一个起送起购价格
            wxSet('send_price', res.data.data[app.globalData.position.cityAdcode].shop_send_price)
            //存储一个配送费
            wxSet('dispatch_price', res.data.data[app.globalData.position.cityAdcode].shop_dispatch_price)
            wxSet('opencity', res.data.data)
          },
        });
      }
    },
  }
})