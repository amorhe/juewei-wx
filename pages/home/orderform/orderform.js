import {
  imageUrl,
  imageUrl2,
  imageUrl3,
  img_url,
  wxGet,
  wxSet
} from '../../common/js/baseUrl'
import {
  couponsList,
  confirmOrder,
  createOrder,
  useraddressInfo,
  add_lng_lat,
  payment,
  useraddress
} from '../../common/js/home'
import {
  upformId
} from '../../common/js/time'
import {
  tx_decrypt
} from '../../common/js/map'
import {
  navigateTo,
  redirectTo,
  reLaunch
} from '../../common/js/router.js'
const { $Toast } = require('../../../iview-weapp/base/index');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    imageUrl2,
    imageUrl3,
    img_url,
    isCheck: true, //协议
    // 换购商品列表
    repurseList: [],
    countN: 0,
    mask: false,
    modalShow: false,
    address: false,
    type: 0,
    content: "",
    orderType: 1, //1为外卖，2为自提
    longitude: '',
    latitude: '',
    markersArray: [],
    shopObj: {}, // 自提商店的详细信息
    couponslist: [], //优惠券列表
    couponsDefault: null,
    coupon_code: '', // 优惠券码
    full_money: 0,
    goodsInfo: '',
    addressInfo: {},
    dispatch_price: 0, // 配送费
    remark: '口味偏好等要求', // 备注
    goodsReal: [], // 非赠品
    goodsInvented: [], // 赠品
    gifts: {}, // 选择的换购商品
    gifts_price: '', // 换购商品价格
    gift_id: '', // 换购商品id
    order_price: '', //订单总价
    showRepurse: false, // 是否显示换购商品
    coupon_money: 0, // 优惠金额
    goodsList: [],
    notUse: false,
    isClick: true,
    phone: '', // 手机号
    newArr: [], // 变更商品列表
    addressList: [],
    trueprice: 0, //真实的总价价格
    send_price: 0,
    price_no_count: false,
    goodsOrder:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 外卖默认地址
    if (app.globalData.type == 1) {
      this.funGetDefault();
    }
    let goodsList = wxGet('goodsList');
    let obj1 = {},
      obj2 = {},
      obj3 = {},
      obj4 = {},
      obj5 = {},
      obj6 = {},
      goodlist = [];
    for (let key in goodsList) {
      if (goodsList[key].goods_discount) {
        if (goodsList[key].num > goodsList[key].goods_order_limit) {
          goodlist.push({
            goods_price: goodsList[key].goods_price,
            goods_quantity: goodsList[key].goods_order_limit,
            goods_code: goodsList[key].goods_code,
            goods_format: goodsList[key].goods_format,
            goods_order_limit: goodsList[key].goods_order_limit
          }, {
            goods_price: goodsList[key].goods_original_price,
            goods_quantity: goodsList[key].num - goodsList[key].goods_order_limit,
            goods_code: goodsList[key].goods_activity_code,
            goods_format: goodsList[key].goods_format,
          });
        } else {
          goodlist.push({
            goods_price: goodsList[key].goods_price,
            goods_quantity: goodsList[key].num,
            goods_code: goodsList[key].goods_code,
            goods_format: goodsList[key].goods_format,
            goods_order_limit: goodsList[key].goods_order_limit
          });
        }
      } else {
        //  普通商品
        goodsList[key]['goods_quantity'] = goodsList[key].num
        goodlist.push(goodsList[key])
      }
    }
    const self = app.globalData.shopTakeOut;
    // console.log(goodlist)
    this.setData({
      goodsList: goodlist,
      shopObj: self
    })
    if (app.globalData.type == 2) {
      const shop_id = wxGet('shop_id');
      const phone = wxGet('userInfo').phone;
      let ott = tx_decrypt(wxGet('lng'), wxGet('lat'));
      let location_s = tx_decrypt(self.location[0], self.location[1]);
      let arr = [{
          longitude: ott.lng,
          latitude: ott.lat,
          iconPath: `${imageUrl}position_map1.png`,
          width: 20,
          height: 20,
          rotate: 0
        },
        {
          longitude: location_s.lng,
          latitude: location_s.lat,
          iconPath: `${imageUrl}position_map2.png`,
          width: 36,
          height: 36,
          label: {
            content: `距你${self.distance}米`,
            color: "#333333",
            fontSize: 11,
            borderRadius: 30,
            bgColor: "#ffffff",
            padding: 5,
            anchorX: -36,
            anchorY: -60
          }
        }
      ]
      this.setData({
        longitude: location_s.lng,
        latitude: location_s.lat,
        markersArray: arr,
        orderType: app.globalData.type,
        phone
      })
    }
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
    // 备注
    if (app.globalData.remarks) {
      this.setData({
        remark: app.globalData.remarks
      })
    }
    if (app.globalData.coupon_code) {
      this.setData({
        coupon_code: app.globalData.coupon_code,
      })
    }
    if (app.globalData.notUse == 1) {
      this.setData({
        notUse: true
      })
    } else {
      this.setData({
        notUse: false
      })
    }
    if (app.globalData.address_id) {
      this.funGetAddress(app.globalData.address_id, wxGet('_sid'))
    } else {
      this.setData({
        address: false,
        addressList: []
      })
    }
    let gifts = [];
    if (this.data.gifts[this.data.gift_id]) {
      gifts.push(this.data.gifts[this.data.gift_id]);
      this.setData({
        gifts
      })
    }
    this.funConfirmOrder(wxGet('shop_id'), JSON.stringify(this.data.goodsList));
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
  // 换购显示
  eveAddRepurseTap(e) {
    let gifts = {},
      gifts_price = '',
      order_price = '',
      trueprice = 0;
    gifts[e.currentTarget.dataset.id] = {
      "activity_id": e.currentTarget.dataset.activity_id,
      "gift_id": e.currentTarget.dataset.gift_id,
      "id": e.currentTarget.dataset.id,
      "num": 1,
      "cash": e.currentTarget.dataset.cash,
      "point": e.currentTarget.dataset.point,
      "gift_price": e.currentTarget.dataset.gift_price
    }
    if (e.currentTarget.dataset.cash == 0 && e.currentTarget.dataset.point == 0) {
      gifts_price = `¥0`;
      order_price = `¥${this.data.orderInfo.real_price / 100}`;
      trueprice = this.data.orderInfo.sum_price / 100 - this.data.orderInfo.dispatch_price / 100;
    }
    if (e.currentTarget.dataset.cash == 0 && e.currentTarget.dataset.point != 0) {
      gifts_price = `${e.currentTarget.dataset.point}积分`;
      order_price = `¥${this.data.orderInfo.real_price / 100}+${e.currentTarget.dataset.point}积分`
      trueprice = this.data.orderInfo.sum_price / 100 - this.data.orderInfo.dispatch_price / 100;
    }
    if (e.currentTarget.dataset.cash != 0 && e.currentTarget.dataset.point == 0) {
      gifts_price = ` ¥${e.currentTarget.dataset.cash / 100}`;
      order_price = `¥${e.currentTarget.dataset.cash / 100 + this.data.orderInfo.real_price / 100}`;
      trueprice = e.currentTarget.dataset.cash / 100 + this.data.orderInfo.sum_price / 100 - this.data.orderInfo.dispatch_price / 100;
    }
    if (e.currentTarget.dataset.cash != 0 && e.currentTarget.dataset.point != 0) {
      gifts_price = `¥${e.currentTarget.dataset.cash / 100}+${e.currentTarget.dataset.point}积分`;
      order_price = `¥${e.currentTarget.dataset.cash / 100 + this.data.orderInfo.real_price / 100}+${e.currentTarget.dataset.point}积分`
      trueprice = e.currentTarget.dataset.cash / 100 + this.data.orderInfo.sum_price / 100 - this.data.orderInfo.dispatch_price / 100;
    }
    this.setData({
      gifts,
      gift_id: e.currentTarget.dataset.id,
      gifts_price,
      order_price,
      trueprice
    })
  },
  // 减
  eveReduceBtnTap(e) {
    this.setData({
      gifts: {},
      gift_id: '',
      order_price: `¥${this.data.orderInfo.real_price / 100}`,
      trueprice: this.data.orderInfo.sum_price / 100 - this.data.orderInfo.dispatch_price / 100
    })
  },
  // 弹框事件回调
  bindCounterPlusOne(data) {
    let goodlist = wxGet('goodsList');
    let newShopcart = {},
      newGoodsArr = [],
      obj1 = {},
      obj2 = {};
    if (this.data.newArr.length > 0 && !this.data.newArr[0].user_id) {
      for (let _item of this.data.newArr) {
        for (let item of this.data.goodsList) {
          // 商品价格变更
          if (_item.type == 1) {
            if (`${_item.goodsCode}${_item.goodsFormat}` == `${item.goods_code}${item.goods_format}`) {
              item.goods_price = _item.goodsPrice;
            }
            obj1[`${item.goods_code}_${item.goods_format}`] = item; //多
          } else if (_item.type == 3) {
            // 商品库存不足
            if (`${_item.goodsCode}${_item.goodsFormat}` == `${item.goods_code}${item.goods_format}`) {
              if (_item.goods_stock > item.goods_order_limit) {
                if (item.goods_order_limit) {
                  item.goods_quantity = item.goods_order_limit;
                } else {
                  item.goods_quantity = _item.goods_stock - item.goods_order_limit
                }
              } else {
                item.goods_quantity = _item.goods_stock
              }
            }
            goodlist[`${_item.goodsCode}_${_item.goodsFormat}`].num = _item.goods_stock;
            goodlist[`${_item.goodsCode}_${_item.goodsFormat}`].sumnum = _item.goods_stock;
            obj1[`${item.goods_code}_${item.goods_format}`] = item;
          } else {
            // 商品下架
            if (`${_item.goodsCode}${_item.goodsFormat}` != `${item.goods_code}${item.goods_format}`) {
              obj2[`${item.goods_code}_${item.goods_format}`] = item; //少
            }
          }
        }
      }
      if (Object.keys(obj2).length > 0 && Object.keys(obj1).length == 0) {
        newShopcart = obj2;
      } else if (Object.keys(obj1).length > 0 && Object.keys(obj2).length == 0) {
        newShopcart = obj1;
      } else if (Object.keys(obj1).length > 0 && Object.keys(obj2).length > 0) {
        for (let key in obj1) {
          if (obj2[key]) {
            newShopcart[key] = obj1[key];
          }
        }
      } else {
        wx.removeStorage({
          key: 'goodsList'
        })
        redirectTo({
          url: '/pages/home/goodslist/goodslist'
        })
        return;
      }
    } else {
      newShopcart = goodlist;
    }
    for (let ott in newShopcart) {
      newGoodsArr.push(newShopcart[ott])
    }
    wxSet('goodsList', goodlist);
    this.setData({
      goodsList: newGoodsArr
    })
    // 重新选择商品
    if (data.detail.isType == 'orderConfirm' && data.detail.type == 1) {
      wx.navigateBack({
        delta: 1
      });
      return;
    }
    // 继续结算
    if (data.detail.isType == 'orderConfirm' && data.detail.type == 0) {
      this.funConfirmOrder(wxGet('shop_id'), JSON.stringify(newGoodsArr));
    }
    this.setData({
      mask: false,
      modalShow: false
    })
  },
  // 同意协议
  checkedTrueTap() {
    this.setData({
      isCheck: !this.data.isCheck
    })
  },
  // 选择地址
  funGetAddress(address_id, _sid) {
    useraddressInfo(address_id, _sid).then((res) => {
      if (res.code == 0) {
        this.setData({
          address: true,
          addressInfo: res.data
        })
      } else {
        this.setData({
          address: false,
          addressInfo: {}
        })
      }
    })
  },
  // 获取默认地址
  funGetDefault() {
    useraddress(wxGet('shop_id'), wxGet('_sid')).then((res) => {
      let addressList = [];
      for (let value of res.data) {
        if (value.is_dis == 1) {
          addressList.push(value)
        }
      }
      if (addressList.length > 0 && addressList[0].user_address_id) {
        app.globalData.address_id = addressList[0].user_address_id;
        this.setData({
          address: true,
          addressInfo: addressList[0],
          addressList
        })
      } else {
        this.setData({
          address: false,
          addressList: []
        })
      }
    })
  },
  // 选择优惠券
  eveChooseCoupon(e) {
    navigateTo({
      url: '/pages/home/orderform/chooseCoupon/chooseCoupon?coupon=' + e.currentTarget.dataset.coupon + '&money=' + e.currentTarget.dataset.money
    });
  },
  // 订单确认
  funConfirmOrder(shop_id, goods) {
    let notUse = 0;
    if (app.globalData.notUse) {
      notUse = app.globalData.notUse
    }
    confirmOrder(this.data.orderType, shop_id, goods, shop_id, this.data.coupon_code, this.data.repurseList, notUse, (app.globalData.freetf?app.globalData.freeId:''), wxGet('_sid'), 2).then((res) => {
      // console.log(res)
      let goodsList = wxGet('goodsList');
      if (res.code == 0) {
        let goodsReal = [],
          goodsInvented = [];
        for (let item of res.data.activity_list[''].goods_list) {
          if (item.is_gifts == 1 && (item.gift_type == 1 || item.gift_type == 2)) {
            // 赠品虚拟
            goodsInvented.push(item)
          } else {
            // 非赠品和赠品实物
            goodsReal.push(item)
          }
        }
        if (goodsReal.length > 0) {
          for (let val of goodsReal) {
            if (!val.is_gifts) {
              if (val.goods_type == 'PKG') {
                val['goods_img'] = img_url + app.globalData.goodsArr[app.globalData.goodsArr.findIndex(item => item.goods_code == val.goods_code)].goods_img[0];
              } else {
                val['goods_img'] = app.globalData.goodsArr[app.globalData.goodsArr.findIndex(item => item.sap_code == val.sap_code || item.goods_sap_code == val.sap_code)].goods_img[0].indexOf('http://imgcdnjwd.juewei.com/') == -1 ? 'http://imgcdnjwd.juewei.com/' + app.globalData.goodsArr[app.globalData.goodsArr.findIndex(item => item.sap_code == val.sap_code || item.goods_sap_code == val.sap_code)].goods_img[0] : app.globalData.goodsArr[app.globalData.goodsArr.findIndex(item => item.sap_code == val.sap_code || item.goods_sap_code == val.sap_code)].goods_img[0];
              }
            }
          }
        }
        // 参与加价购的商品
        // 加购商品列表
        const gifts = app.globalData.gifts;
        let repurseTotalPrice = 0,
          arr_money = [];
        // console.log(gifts)
        if (app.globalData.repurseGoods) {
          if (Object.keys(gifts).length > 0) {
            for (let key in gifts) {
              gifts[key].forEach(val => {
                val.goods_count = 0;
                val.goods_choose = true
              })
              arr_money.push(key);
            }
          }
          // 换购商品不指定
          if (app.globalData.repurseGoods.length == 0) {
            arr_money.push(res.data.activity_list[''].real_price);
            arr_money.sort((a, b) => {
              return a - b;
            });
            let k = arr_money.findIndex(item => item == res.data.activity_list[''].real_price);
            if (res.data.activity_list[''].real_price >= arr_money[k - 1]) {
              this.setData({
                showRepurse: true,
                repurseList: gifts[arr_money[k - 1]]
              })
            }
            if (res.data.activity_list[''].real_price >= arr_money[k]) {
              this.setData({
                showRepurse: true,
                repurseList: gifts[arr_money[k]]
              })
            }
          } else { // 换购商品为指定
            for (let item of app.globalData.repurseGoods) {
              for (let value of goodsReal) {
                if (item.goods_code == value.sap_code && value.goods_type != "DIS") {
                  repurseTotalPrice += value.goods_price * value.goods_quantity;
                }
              }
            }
            arr_money.push(repurseTotalPrice);
            arr_money.sort((a, b) => {
              return a - b;
            });
            let i = arr_money.findIndex(item => item == repurseTotalPrice);
            if (repurseTotalPrice >= arr_money[i - 1]) {
              this.setData({
                showRepurse: true,
                repurseList: gifts[arr_money[i - 1]]
              })
            }
          }
        }
        //  优惠券
        let coupon_money = 0;
        if (res.data.activity_list[''].reduce_detail.length == 1) {
          coupon_money = res.data.activity_list[''].reduce_detail[0].coupon.reduce
        } else if (res.data.activity_list[''].reduce_detail.length > 1) {
          coupon_money = res.data.activity_list[''].reduce_detail[res.data.activity_list[''].reduce_detail.findIndex(val => Math.max(val.coupon.reduce))].coupon.reduce;
        }
        this.setData({
          goodsReal,
          goodsInvented,
          orderInfo: res.data.activity_list[''],
          order_price: `¥${res.data.activity_list[''].real_price / 100}`,
          trueprice: res.data.activity_list[''].sum_price / 100 - res.data.activity_list[''].dispatch_price / 100,
          coupon_money,
          orderDetail: res.data
        })
      } else if (res.code == 277) {
        this.setData({
          mask: true,
          modalShow: true,
          showShopcar: false,
          isType: 'orderConfirm',
          content: res.msg + '，系统已经更新,是否确认结算',
          newArr: res.data
        })
      }else if(res.code == 'A123'){
        wx.showModal({
          content: res.msg,
          showCancel:false,
          confirmText:'重新选择',
          confirmColor:'#E60012',
          success(conf){
            wx.navigateBack({
              delta: 1
            })
          }
        })
      } else {
        this.setData({
          mask: true,
          modalShow: true,
          showShopcar: false,
          isType: 'orderConfirm',
          content: res.msg,
          newArr: []
        })
      }
    })
  },
  // 确认支付
  eveConfirmPay() {
    if (app.globalData.type == 2 && !this.data.isCheck) {
      wx.showModal({
        content: '请同意到店自提协议',
        confirmText: '我知道了',
        showCancel: false,
        confirmColor: '#E60012'
      });
      return
    }
    const lng = wxGet('lng');
    const lat = wxGet('lat');
    const shop_id = wxGet('shop_id');
    const goods = JSON.stringify(this.data.goodsList);
    let type = '',
      typeClass = '',
      gift_arr = [],
      giftObj = {},
      notUse = 0,
      remark = '',
      str_gift = '';
    if (app.globalData.type == 1) {
      type = 1;
      typeClass = 2;
    }
    if (app.globalData.type == 2) {
      type = 3;
      typeClass = 4
    }

    let address_id = app.globalData.address_id;
    if (app.globalData.type == 1) {
      if (!address_id) {
        $Toast({
          content: '请选择收货地址'
        })
        return
      }
    }
    // js节流防短时间重复点击
    if (this.data.isClick == false) {
      return
    }
    this.setData({
      isClick: false
    })

    if (app.globalData.notUse) {
      notUse = app.globalData.notUse;
    }
    // 备注
    if (app.globalData.remarks) {
      remark = app.globalData.remarks
    }
    if (Object.keys(this.data.gifts).length > 0) {
      giftObj['activity_id'] = this.data.gifts[this.data.gift_id].activity_id;
      giftObj['gift_id'] = this.data.gifts[this.data.gift_id].gift_id;
      giftObj['id'] = this.data.gifts[this.data.gift_id].id;
      gift_arr.push(giftObj);
      str_gift = JSON.stringify(gift_arr);
    }
    // 创建订单
    let use_coupons = ''
    if (this.data.orderInfo.use_coupons[0] != undefined) {
      use_coupons = this.data.orderInfo.use_coupons[0]
    }
    createOrder(app.globalData.type, shop_id, goods, shop_id, 8, remark, '微信小程序', address_id, lng, lat, type, str_gift, use_coupons, notUse, (app.globalData.freetf ? app.globalData.freeId : ''), wxGet('_sid'), 2).then((res) => {
      if (res.code == 0) {
        if (app.globalData.type == 2 && this.data.orderInfo.real_price == 0) {
          this.setData({
            isClick: true,
            coupon_code: ''
          })
          app.globalData.coupon_code = '';
          app.globalData.remarks = '';
          add_lng_lat(res.data.order_no, typeClass, lng, lat).then((conf) => {
            wx.removeStorage({
              key: 'goodsList', // 缓存数据的key
            });
            redirectTo({
              url: '/pages/home/orderfinish/orderfinish?order_no=' + res.data.order_no, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
            });
          })
          return
        }
        payment(res.data.order_no).then((val) => {
          if (val.code == 0) {
            // 微信调起支付
            this.setData({
              isClick: true,
              coupon_code: ''
            })
            app.globalData.coupon_code = '';
            app.globalData.remarks = '';
            // 微信支付
            wx.requestPayment({
              timeStamp: val.data.timeStamp,
              nonceStr: val.data.nonceStr,
              package: val.data.package,
              signType: val.data.signType,
              paySign: val.data.paySign,
              success(conf) {
                // console.log(conf)
                add_lng_lat(res.data.order_no, typeClass, lng, lat).then((confs) => {
                  if (confs.CODE == 'A100') {
                    wx.removeStorageSync('goodsList');
                    redirectTo({
                      url: '/pages/home/orderfinish/orderfinish?order_no=' + res.data.order_no
                    });
                  }
                })
              },
              fail(conf) {
                wx.removeStorageSync('goodsList');
                if (conf.errMsg.indexOf('cancel') != -1) {
                  // 取消支付
                  redirectTo({
                    url: '/package_order/pages/orderdetail/orderdetail?order_no=' + res.data.order_no
                  })
                } else {
                  // 支付失败
                  redirectTo({
                    url: '/pages/home/orderError/orderError'
                  })
                }
              }
            })
          }
        })
      } else {
        $Toast({
          content: res.msg,
        })
        this.setData({
          isClick: true,
        })
      }
    })
  },
})