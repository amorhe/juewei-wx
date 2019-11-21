import {
  imageUrl,
  imageUrl2,
  imageUrl3,
  ak,
  img_url,
  jsonUrl,
  wxGet,
  wxSet
} from '../../common/js/baseUrl'
import {
  bannerList,
  showPositionList,
  activityList,
  GetShopGoods,
  couponsExpire
} from '../../common/js/home'
import {
  getuserInfo,
  loginByAuth
} from '../../common/js/login'
import {
  datedifference,
  cur_dateTime,
  compare,
  upformId,
  sortNum,
  getNowDate
} from '../../common/js/time'
import {
  bd_encrypt
} from '../../common/js/map'
import {
  navigateTo,
  redirectTo
} from '../../common/js/router.js'
import {
  startAddShopAnimation
} from '../../common/js/AddShopCar.js'
import {
  event_getNavHeight
} from '../../common/js/utils.js'
const {
  $Toast
} = require('../../../iview-weapp/base/index');
var app = getApp();
let tim = null,
  goodsret = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isSelf: false, // 是不是去自提页
    imageUrl,
    imageUrl2,
    imageUrl3,
    img_url,
    firstAddress: '定位失败',
    isClose: false,
    indicatorDots: false,
    autoplay: false,
    interval: 2000,
    circular: true,
    imgUrls: [],
    province_id: '', //省
    city_id: '', // 市
    region_id: '', //区
    showListObj: [], // 展位
    isOpen: '', //门店是否营业
    shopTakeOut: {}, // 附近门店列表
    shopGoodsList: [], // 门店商品列表
    typeList1: {
      "折扣": "zk",
      "套餐": "zhsm",
    },
    typeList: {
      "爆款": "hot",
      "超辣": "kl",
      "甜辣": "tl",
      "微辣": "wl",
      "不辣": "bl",
      "招牌系列": "zhao_series",
      "藤椒系列": "tj_series",
      "素菜系列": "su_series",
      "黑鸭系列": "hei_series",
      "五香系列": "wu_series",
      "解辣神器": "qqt_series"
    },
    shopGoodsAll: [],
    content: '',
    confirmButtonText: '',
    cancelButtonText: '',
    modalShow: false,
    mask: false,
    otherGoods: [], // 参与换购的商品
    type: 1, // 默认外卖
    shopGoods: [], // 门店商品
    fullActivity: '',
    freeMoney: -1,
    jingxuan: true,
    btnClick: true,
    activityList: [],
    shopcartList: {}, // 购物车缓存
    goodsType: 1, //系列
    togoodsType: 1, // 点击跳转
    maskView: false,
    shopcarShow: false,
    goodsModal: false,
    scrollT: 0,
    couponsExpire: {}, // 优惠券过期提醒     
    isShow: false, // 优惠券过期提醒是否显示
    companyGoodsList: [], //公司所有商品
    activityAllObj: [],
    goodsItem: {}, //选择规格一条商品
    priceAll: 0, // 商品总价
    shopcartAll: [], //购物车数组
    shopcartNum: 0, // 购物车显示总数
    activityText: '', // 购物车活动提示内容
    priceFree: 0, // 购物车包邮商品价格
    freeText: '', // 购物车包邮提示内容
    isScorll: true,
    // isTab: false,
    goodsClass: {
      "折扣": 1,
      "套餐": 2,
      "爆款": 3,
      "超辣": 4,
      "甜辣": 5,
      "微辣": 6,
      "不辣": 7,
      "招牌系列": 8,
      "藤椒系列": 9,
      "素菜系列": 10,
      "黑鸭系列": 11,
      "五香系列": 12,
      "解辣神器": 13,
    },
    repurse_price: 0, // 购物车换购商品价格
    pagescrollTop: 0,
    leftTop: 0,
    navbarInitTop: 0, //导航栏初始化距顶部的距离
    isFixedTop: false, //是否固定顶部
    shopcart_top: 0,
    shopcart_left: 0,
    togoodsType: 1, //点击跳转
    totalH: 0,
    bottomTabbar: 98,
    freeId: '',
    isiphonex: app.globalData.isIphoneX || false //判断是否是iphonex以上的全面屏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.isSelf) {
      this.setData({
        isSelf: true
      })
    }
    if (app.globalData && !app.globalData.address && wxGet('appglobalData')) {
      app.globalData = wxGet('appglobalData');
    }
    if (wxGet('appglobalData')) {
      wx.removeStorage({
        key: 'appglobalData'
      });
    }
    let isPhone = app.globalData.isIphoneX;
    if (isPhone) {
      this.setData({
        bottomTabbar: 146,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.createSelectorQuery().select(".e1").boundingClientRect((rect) => {
      this.setData({
        shopcart_top: rect.top
      })
    }).exec()
    //获取节点距离顶部的距离
    setTimeout(() => {
      wx.createSelectorQuery().select('.pagesScorll ').boundingClientRect().exec((rect) => {
        if (rect[0] != null) {
          var navbarInitTop = parseInt(rect[0].top);
          this.setData({
            navbarInitTop: navbarInitTop * 200
          });
        }
      });
    }, 2000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    // 定位地址
    this.setData({
      type: app.globalData.type,
      shopTakeOut: {},
      firstAddress: (this.data.isSelf?app.globalData.address1 : app.globalData.address)
    })
    wx.showLoading({
      title: '加载中...'
    });
    // 初始化默认外卖
    let shopArray = [];
    if (!this.data.isSelf && app.globalData.shopIng && !app.globalData.switchClick) {
      if (wxGet('shop_id') != app.globalData.shop_id) {
        const status = cur_dateTime(app.globalData.shopIng.start_time, app.globalData.shopIng.end_time);
        this.setData({
          isOpen: status,
          shopTakeOut: app.globalData.shopIng
        })
        wxSet('shop_id', app.globalData.shopIng.shop_id)
        app.globalData.isOpen = status;
        app.globalData.shopTakeOut = this.data.shopTakeOut;
      }
      this.setData({
        jingxuan: app.globalData.shopIng.jingxuan || false,
        shopTakeOut: app.globalData.shopIng
      })
    } else if (this.data.isSelf && app.globalData.shopIng1 && !app.globalData.switchClick) {
      if (wxGet('shop_id') != app.globalData.shop_id) {
        const status = cur_dateTime(app.globalData.shopIng1.start_time, app.globalData.shopIng1.end_time);
        this.setData({
          isOpen: status,
          shopTakeOut: app.globalData.shopIng1
        })
        wxSet('shop_id', app.globalData.shopIng1.shop_id)
        app.globalData.isOpen = status;
        app.globalData.shopTakeOut = this.data.shopTakeOut;
      }
      this.setData({
        jingxuan: app.globalData.shopIng1.jingxuan || false,
        shopTakeOut: app.globalData.shopIng1
      })
    } else if (!app.globalData.shopIng && !app.globalData.switchClick) {
      if (app.globalData.type == 1) {
        shopArray = wxGet('takeout')
      } else {
        shopArray = wxGet('self')
      }
      const status = cur_dateTime(shopArray[0].start_time, shopArray[0].end_time);
      this.setData({
        isOpen: status,
        shopTakeOut: shopArray[0],
        jingxuan: true
      })
      wxSet('shop_id', shopArray[0].shop_id)
      app.globalData.shopTakeOut = shopArray[0];
      app.globalData.isOpen = status;
    } else {
      this.setData({
        shopTakeOut: app.globalData.shopTakeOut
      })
    }
    app.globalData.switchClick = null;
    if (app.globalData.activityList) {
      app.globalData.activityList.DIS = [];
      app.globalData.activityList.PKG = [];
    }
    let user_id = 1;
    if (wxGet('userInfo') && wxGet('userInfo').user_id) {
      user_id = wxGet('userInfo').user_id;
      // 优惠券
      this.funGetcouponsExpire(wxGet('_sid'));
    } else {
      // 设置scroll-view高度
      this.setData({
        totalH: wx.getSystemInfoSync().windowHeight * (750 / wx.getSystemInfoSync().windowWidth) - 408
      })
    }
    this.funGetBannerList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id); //banner
    this.funGetShowpositionList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id);
    this.funGetActivityList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id,    app.globalData.type, user_id, app.globalData.type) //营销活动
    wxSet('vip_address', app.globalData.shopTakeOut);
    this.funGotopage();
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
    app.globalData.isSelf = false;
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
  onPageScroll: function(e) {
    var that = this;
    var scrollTop = parseInt(e.scrollTop); //滚动条距离顶部高度
    //判断'滚动条'滚动的距离 和 '元素在初始时'距顶部的距离进行判断
    var isSatisfy = scrollTop >= (that.data.navbarInitTop / 2 - 44) ? true : false;
    //为了防止不停的setData, 这儿做了一个等式判断。 只有处于吸顶的临界值才会不相等
    if (that.data.isFixedTop === isSatisfy) {
      return false;
    }

    that.setData({
      isFixedTop: isSatisfy
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 下拉刷新
  onPullDownRefresh: function() {
    // Do something when pull down.
    wx.showLoading({
      title: '加载中...',
    })
    this.onShow();
    wx.stopPullDownRefresh()
  },
  setDelayTime(sec) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, sec)
    });
  },
  // 关闭提醒
  eveCloseOpen() {
    this.setData({
      isClose: true
    })
  },
  funGotopage() {
    // 自定义跳转页面
    let topage = (app.globalData.gopages || '');
    topage = decodeURIComponent(topage);
    app.globalData.gopages = ''; //删除
    if (topage != '') {
      switch (topage) {
        //商城首页
        case '/pages/home/goodslist/goodslist':
          //就是当前页不用跳转任何
          break;
          //会员
        case '/pages/vip/index/index':
          wx.reLaunch({
            url: topage
          });
          break;
          // 订单
        case '/pages/order/list/list':
          wx.reLaunch({
            url: topage
          });
          break;
          // 个人中心
        case '/pages/my/index/index':
          wx.reLaunch({
            url: '/pages/my/index/index'
          });
          break;
          // 优惠券
        case '/package_my/pages/coupon/coupon':
          setTimeout(function() {
            wx.navigateTo({
              url: topage
            });
          }, 200)
          break;
          // 会员卡
        case '/package_my/pages/membercard/membercard':
          setTimeout(function() {
            wx.navigateTo({
              url: topage
            });
          }, 200)
          break;
          //  附近门店
        case '/package_my/pages/nearshop/nearshop':
          setTimeout(function() {
            wx.navigateTo({
              url: topage
            });
          }, 200)
          break;
        default:
          setTimeout(function() {
            wx.navigateTo({
              url: topage
            });
          }, 200)
          break;
      }
    }
  },
  // 切换外卖自提
  eveChooseTypes(e) {
    // js节流防短时间重复点击
    if (this.data.btnClick == false) {
      return
    }
    this.setData({
      btnClick: false
    })
    // 未登录时，use_id=1
    let user_id = 1;
    if (wxGet('user_id')) {
      user_id = wxGet('user_id')
    }

    if (e.currentTarget.dataset.type == 'ziti') {
      let shopTakeOut = wxGet('self')[0] || '';
      this.setData({
        shopTakeOut,
        type: 2,
        jingxuan: true
      });
      app.globalData.type = 2;
      this.funGetActivityList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id, app.globalData.type, user_id, app.globalData.type)
      this.funGetBannerList(shopTakeOut.city_id, shopTakeOut.district_id, shopTakeOut.company_sale_id); //banner
      this.funGetShowpositionList(shopTakeOut.city_id, shopTakeOut.district_id, shopTakeOut.company_sale_id);
    } else {
      //切换外卖
      if (!wxGet('takeout')) {
        this.setData({
          btnClick: true
        })
        wx.showModal({
          content: '您的定位地址无可配送门店',
          cancelText: '去自提',
          cancelColor: '#E60012',
          confirmText: '修改地址',
          confirmColor: '#E60012',
          success(res) {
            if (res.confirm) {
              navigateTo({
                url: '/pages/home/selecttarget/selecttarget?type=true'
              })
            } else if (res.cancel) {

            }
          }
        })
        return
      }
      let shopTakeOut = wxGet('takeout')[0] || '';
      this.setData({
        shopTakeOut,
        type: 1,
        jingxuan: true
      })
      app.globalData.type = 1;
      this.funGetActivityList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id, app.globalData.type, user_id, app.globalData.type)
      this.funGetBannerList(shopTakeOut.city_id, shopTakeOut.district_id, shopTakeOut.company_sale_id); //banner
      this.funGetShowpositionList(shopTakeOut.city_id, shopTakeOut.district_id, shopTakeOut.company_sale_id);
    }
    app.globalData.shopTakeOut = this.data.shopTakeOut;
    const status = cur_dateTime(this.data.shopTakeOut.start_time, this.data.shopTakeOut.end_time);
    this.setData({
      isOpen: status,
      btnClick: true
    })
    wxSet('shop_id', this.data.shopTakeOut.shop_id)
    app.globalData.isOpen = status;
    app.globalData.shopIng = null;
  },
  // 首页banner列表
  funGetBannerList(city_id, district_id, company_id) {
    bannerList(city_id, district_id, company_id).then((data) => {
      if (data.data.length == 1) {
        this.setData({
          indicatorDots: false,
          autoplay: false,
          imgUrls: data.data
        })
      } else if (data.data.length > 1) {
        this.setData({
          indicatorDots: true,
          autoplay: true,
          imgUrls: data.data
        })
      } else {
        this.setData({
          indicatorDots: false,
          autoplay: false,
          imgUrls: []
        })
      }

    });
  },
  // 首页商品展位
  funGetShowpositionList(city_id, district_id, company_id) {
    showPositionList(city_id, district_id, company_id).then((res) => {
      this.setData({
        showListObj: res.data
      })
    })
  },
  // 门店营销活动(折扣和套餐)
  async funGetActivityList(city_id, district_id, company_id, buy_type, user_id, type) {
    let res = await activityList(city_id, district_id, company_id, buy_type, user_id, 2, type);
    if (res && res.data){//活动接口存在
        // 获取加价购商品
        if (res && res.data && res.data.MARKUP && res.data.MARKUP != null) {
          app.globalData.gifts = res.data.MARKUP.gifts;
          // 获取活动金额
          let newArr = Object.keys(res.data.MARKUP.gifts);
          app.globalData.fullActivity = newArr;
          this.setData({
            fullActivity: newArr
          })
        } else {
          app.globalData.gifts = [];
          app.globalData.fullActivity = [];
          this.setData({
            fullActivity: []
          })
        }
        this.setData({
          activityList: res.data
        }, () => {
          this.funGetCompanyGoodsList(this.data.shopTakeOut.company_sale_id); //获取公司所有商品(第一个为当前门店)
        })
    }else{//活动接口崩溃的时候，发生错误的情况，没有活动接口了
      console.log('活动接口崩溃！');
      app.globalData.gifts = [];
      app.globalData.fullActivity = [];
      this.setData({
        fullActivity: [],
        activityList:{}
      })
      this.funGetCompanyGoodsList(this.data.shopTakeOut.company_sale_id); //获取公司所有商品(第一个为当前门店)
    }
  },
  // 公司商品列表
  funGetCompanyGoodsList(company_id) {
    const timestamp = new Date().getTime();
    wx.request({
      url: `${jsonUrl}/api/product/company_sap_goods${company_id}.json?v=${timestamp}`,
      success: (res) => {
        // 该公司所有的商品
        this.setData({
          companyGoodsList: res.data.data[`${company_id}`]
        }, () => {
          this.funGetShopGoodsList(this.data.shopTakeOut.shop_id);
        })
      }
    });
  },
  // 门店商品列表
  funGetShopGoodsList(shop_id) {
    GetShopGoods(shop_id).then((res) => {
      const shopGoodsList = res.data[`${shop_id}`];
      const companyGoodsList = this.data.companyGoodsList;
      //  获取某公司下的某一个门店的所有商品
      let arr = companyGoodsList.filter(item => {
        return shopGoodsList.includes(item.sap_code)
      })
      // 获取参与加价购商品的列表（可换购）
      if (this.data.activityList && this.data.activityList.MARKUP != null) {
        if (this.data.activityList.MARKUP.goods.length == 0) {
          app.globalData.repurseGoods = [];
        } else {
          app.globalData.repurseGoods = this.data.activityList.MARKUP.goods;
        }
        for (let item of this.data.activityList.MARKUP.goods) {
          for (let value of arr) {
            if (item.goods_code == value.sap_code) {
              value['huangou'] = 1;
            }
          }
        }
      }
      // 筛选在当前门店里面的折扣商品
      let DIS = [],
        PKG = [],
        obj1 = {},
        obj2 = {};
      if (this.data.activityList.DIS) {
        DIS = this.data.activityList.DIS.filter(item => arr.findIndex(value => value.sap_code == item.goods_sap_code) != -1)
        DIS.forEach(item => item.key = '折扣');
      }
      // 筛选在当前门店里面的套餐商品  
      if (this.data.activityList.PKG) {
        PKG = this.data.activityList.PKG.filter(item => item.pkg_goods.map(ott => arr.findIndex(value => value.sap_code == ott.sap_code) != -1));
        PKG.forEach(item => item.key = '套餐');
      }
      // 套餐商品图片格式
      for (let item of PKG) {
        item.goods_img = [item.goods_img];
        item.goods_img_detail_origin = [item.goods_img_detail_origin]
        item.goods_img_intr_origin = [item.goods_img_intr_origin]
      }
      // 包邮活动
      if (this.data.activityList && this.data.activityList.FREE) {
        this.setData({
          freeMoney: this.data.activityList.FREE.money,
          freeId: this.data.activityList.FREE.id
        })
        app.globalData.freeId = this.data.activityList.FREE.id;
        app.globalData.freeMoney = this.data.activityList.FREE.money
      } else {
        app.globalData.freeId = '';
        app.globalData.freeMoney = '';
        this.setData({
          freeMoney: -1,
          freeId: ''
        })
      }
      obj1 = {
        "key": "折扣",
        "last": DIS
      }
      obj2 = {
        "key": "套餐",
        "last": PKG
      }
      const str = new Date().getTime();
      wx.request({
        url: `${jsonUrl}/goods/goods_sort.json?v=${str}`,
        success: (conf) => {
          let _T = conf.data.data.country
          const {
            typeList
          } = this.data

          let keys = Object.keys(typeList);
          let list = keys.map(
            item => ({
              key: item,
              values: arr.filter(_item => item === _item.cate_name || item === _item.taste_name)
            })
          )
          let sortList = list.map(({
            key,
            values
          }) => {
            let _sort = typeList[key]
            let _t = _T[_sort]
            if (!_t) {
              return {
                key,
                last: []
              }
            }

            let last = []
            _t.map(_item => {
              if (values.length == 0) {
                values = arr;
              }
              let cur = values.filter(({
                goods_code
              }) => goods_code === _item);
              if (cur.length > 0) {
                cur[0].key = cur[0].taste_name
              }
              last = new Set([...last, ...cur])
            })
            return {
              key,
              last: [...last]
            }
          })
          sortList.unshift(obj1, obj2);
          let goodsArr = [...DIS, ...PKG, ...arr]; // 门店所有列表（一维数组）
          let goodsNew = sortList.filter(item => item.last.length > 0);
          goodsNew = new Set(goodsNew)
          goodsNew = [...goodsNew];
          app.globalData.goodsArr = goodsArr; // 详情页，确认订单页使用
          app.globalData.goodsCommon = arr; // 不包含折扣，套餐
          app.globalData.DIS = DIS;
          app.globalData.PKG = PKG;
          // 最终商品总数据
          // console.log(goodsNew)
          this.setData({
            shopGoodsAll: goodsNew,
            shopGoods: arr
          }, () => {
            let
              num = 0, // 购物车总数量
              shopcartAll = [], // 购物车数组
              priceAll = 0, // 总价
              shopcartNum = 0, // 购物车总数量
              priceFree = 0, // 满多少包邮
              shopcartObj = {}, //商品列表 
              repurse_price = 0, // 换购活动提示价
              snum = 0,
              goodsList = wxGet('goodsList');
            if (goodsList == undefined) {
              shopcartAll = [];
              shopcartNum = 0;
              priceFree = 0;
              priceAll = 0;
              repurse_price = 0
            };
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
                if (arr) {
                  for (let value of arr) {
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
                } else {
                  priceAll += shopcartObj[val].goods_price * shopcartObj[val].num;
                }
                if (!shopcartObj[val].goods_discount) {
                  priceFree += shopcartObj[val].goods_price * shopcartObj[val].num;
                }
                //计算可换购价格
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
            this.funShopcartPrompt(this.data.fullActivity, priceFree, repurse_price)
            if (!wxGet('goodsList')) {
              let data = {}
              this.funChangeShopcart(data);
            }
            this.setData({
              shopcartList: shopcartObj,
              priceAll,
              shopcartAll,
              shopcartNum,
              priceFree,
              repurse_price
            })
            wxSet('goodsList', shopcartObj);
          })
          // 获取商品模块的节点
          wx.createSelectorQuery().selectAll('.goodsTypeEv').boundingClientRect().exec((ret) => {
            if (ret[0] == null || ret[0][0] == null) {
              return;
            }
            let top = ret[0][0].top;
            let arr = ret[0].map((item, index) => {
              return item.top = item.top - top - 37;
            })
            goodsret = arr;
          })
          wxSet('shopGoods', goodsArr);
          wx.hideLoading();
        },
      });

    })
  },
  // 监听商品列表滚动
  bindscroll(e) {
    //用于判断左侧显示的位置 
    if (e.detail.scrollTop > 0) {
      let retArr = [...goodsret];
      wx.createSelectorQuery().select('.scrolllist').scrollOffset().exec((ret) => {
        let sum = 0;
        if (retArr.indexOf(ret[0].scrollTop) > -1) {
          retArr.push(ret[0].scrollTop + 1);
          retArr.sort((a, b) => a - b);
          sum = retArr.findIndex(item => (item == (ret[0].scrollTop + 1)));
        } else {
          retArr.push(ret[0].scrollTop);
          retArr.sort((a, b) => a - b);
          sum = retArr.findIndex(item => (item == ret[0].scrollTop));
        }
        if (this.data.goodsType != sum) {
          this.setData({
            goodsType: sum
          })
        }
      })
    }
  },
  //手势移开
  bindtouchend(e) {
    //e没有可用参数所以用查询办法
    wx.createSelectorQuery().select('.scrolllist').scrollOffset().exec((ret) => {
      if (ret[0].scrollTop > 0) {
        wx.pageScrollTo({
          scrollTop: 999999 //这里可以给了最大的数字，来代表滚动到最底部就可以了  this.data.navbarInitTop
        })
      }
    })
  },
  // 购物车小球动画
  funAnimate(e) {
    let finger = {};
    finger['x'] = e.detail.touches[0].clientX / wx.getSystemInfoSync().windowWidth * 750;
    finger['y'] = e.detail.touches[0].clientY / wx.getSystemInfoSync().windowWidth * 750;
    startAddShopAnimation([{
      x: 80,
      y: 750 * wx.getSystemInfoSync().windowHeight / wx.getSystemInfoSync().windowWidth - 200
    }, finger], this);
  },
  // 加入购物车
  eveAddshopcart(e) {
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
      
      if (e.currentTarget.dataset.goods_discount) {//是商品折扣的
        oneGood = {
          "goods_name": e.currentTarget.dataset.goods_name,
          "taste_name": e.currentTarget.dataset.taste_name,
          "goods_price": e.currentTarget.dataset.goods_price * 100,
          "num": 1,
          "sumnum": 1,
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
      } else {//普通商品
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
      //判断是否含有必要参数,如果不含有就直接终止本次循环
      if (!goodlist[keys].goods_price || goodlist[keys].goods_price==0){
        continue;
      }

      //
      if (e.currentTarget.dataset.goods_discount) {
        if (goodlist[keys].goods_order_limit && goodlist[keys].goods_order_limit != null && goodlist[`${e.currentTarget.dataset.goods_code}_${goods_format}`].num > e.currentTarget.dataset.goods_order_limit) {
          $Toast({
            content: `折扣商品限购${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}，超过${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}恢复原价`
          })
        }
      }
      //折扣和套餐的
      if (goodlist[keys].goods_order_limit && goodlist[keys].goods_order_limit!=null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
        priceAll += goodlist[keys].goods_price * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        if (keys.indexOf('PKG') == -1) {
          priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        }
      //普通商品
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
      shopcartAll.push(goodlist[keys]);
      shopcartNum += goodlist[keys].num
    }
    this.setData({
      shopcartList: goodlist,
      shopcartAll,
      priceAll,
      shopcartNum,
      priceFree,
      repurse_price
    })
    let datas = {
      detail: {
        goodlist,
        shopcartAll,
        priceAll,
        shopcartNum,
        priceFree,
        repurse_price
      }
    }
    this.funChangeShopcart(datas)
    wxSet('goodsList', goodlist)
  },
  //减少购物车
  eveReduceshopcart(e) {
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
      //判断是否含有必要参数,如果不含有就直接终止本次循环
      if (!goodlist[keys].goods_price) {
        continue;
      }

      if (goodlist[keys].goods_order_limit && goodlist[keys].goods_order_limit != null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
        priceAll += goodlist[keys].goods_price * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        if (keys.indexOf('PKG') == -1) {
          priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        }
      } else if (goodlist[keys].goods_price && goodlist[keys].num) {
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
      if (goodlist[keys].num > 0) {
        newGoodlist[keys] = goodlist[keys];
        shopcartAll.push(goodlist[keys]);
        shopcartNum += goodlist[keys].num;
      }
    }
    this.setData({
      shopcartList: newGoodlist,
      shopcartAll,
      priceAll,
      shopcartNum,
      priceFree,
      repurse_price
    })
    let datas = {
      detail: {
        goodlist: newGoodlist,
        shopcartAll,
        priceAll,
        shopcartNum,
        priceFree,
        repurse_price
      }
    }
    this.funChangeShopcart(datas)
    wxSet('goodsList', newGoodlist)
  },
  // sku商品
  funCart(data) {
    if (Object.keys(data).length == 0) {
      return
    }
    this.setData({
      shopcartList: data.detail.goodlist || {},
      shopcartAll: data.detail.shopcartAll || [],
      priceAll: data.detail.priceAll || 0,
      shopcartNum: data.detail.shopcartNum || 0,
      priceFree: data.detail.priceFree || 0,
      repurse_price: data.detail.repurse_price || 0
    })
    this.funShopcartPrompt(this.data.fullActivity, data.detail.priceFree || 0, data.detail.repurse_price || 0)
  },
  // 购物车
  funChangeShopcart(data) {
    this.funCart(data)
  },
  // 选择商品系列
  eveChooseGoodsType(e) {
    this.setData({
      goodsType: e.currentTarget.dataset.type,
      togoodsType: e.currentTarget.dataset.type,
      shopcartList: wxGet('goodsList')
    })
    wx.pageScrollTo({
      scrollTop: this.data.navbarInitTop
    })
  },
  eveCloseModal(data) {
    this.setData({
      maskView: data.detail.maskView,
      goodsModal: data.detail.goodsModal
    })
  },
  // 选规格
  eveChooseSizeTap(e) {
    this.setData({
      maskView: true,
      goodsModal: true,
      goodsItem: e.currentTarget.dataset.item,
      goodsKey: e.currentTarget.dataset.key,
      goodsLast: e.currentTarget.dataset.index
    })
  },
  funOpenShopcar(data) {
    this.setData({
      shopcarShow: data.detail
    })
  },
  // 优惠券过期提醒
  funGetcouponsExpire(_sid) {
    couponsExpire(_sid).then((res) => {
      if (Object.keys(res.data).length > 0) {
        res.data.days = datedifference(getNowDate(), res.data.end_time);
        this.setData({
          couponsExpire: res.data,
          isShow: true,
          totalH: wx.getSystemInfoSync().windowHeight * (750 / wx.getSystemInfoSync().windowWidth) - 454
        })
      } else {
        this.setData({
          isShow: false,
          totalH: wx.getSystemInfoSync().windowHeight * (750 / wx.getSystemInfoSync().windowWidth) - 408
        })
      }
    })
  },
  // 关闭优惠券提醒
  eveCloseCouponView() {
    this.setData({
      isShow: false,
      totalH: wx.getSystemInfoSync().windowHeight * (750 / wx.getSystemInfoSync().windowWidth) - 408
    })
  },
  // 购物车活动提示
  funShopcartPrompt(oldArr, priceFree, repurse_price) {
    let activityText = '',
      freeText = '';
    for (let v of oldArr) {
      if (oldArr.findIndex(v => v > repurse_price) != -1) {
        if (oldArr.findIndex(v => v > repurse_price) == 0) {
          activityText = `只差${(oldArr[0] - repurse_price) / 100}元,超值福利等着你!`;
        } else if (oldArr.findIndex(v => v > repurse_price) > 0 && oldArr.findIndex(v => v > repurse_price) < oldArr.length) {
          activityText = `已购满${oldArr[oldArr.findIndex(v => v > repurse_price) - 1] / 100}元,去结算享受换购优惠;满${oldArr[oldArr.findIndex(v => v > repurse_price)] / 100}元更高福利等着你!`
        } else {
          activityText = `已购满${oldArr[oldArr.length - 1] / 100}元,去结算获取优惠!`;
        }
      } else {
        activityText = `已购满${oldArr[oldArr.length - 1] / 100}元,去结算获取优惠!`;
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
    }else if(this.data.freeMoney == 0){
      //加入变量说明可以免配送
      app.globalData.freetf = true;
      freeText = '免配送费'
    }else{//-1的状态
      app.globalData.freetf = false;
      freeText='';
    }
    this.setData({
      activityText,
      freeText
    })
  },
  // 去商品详情页
  eveGoodsdetailContent(e) {
    navigateTo({
      url: '/pages/home/goodslist/goodsdetail/goodsdetail?goods_code=' + e.currentTarget.dataset.goods_code
    });
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
    this.funShopcartPrompt(this.data.fullActivity, 0, 0)
  },
  //  活动跳转链接
  imageLink(e) {
    navigateTo({
      url: e.currentTarget.dataset.link
    });
  },
  // banner图跳转链接
  linkUrl(e) {
    if ((e.currentTarget.dataset.link).indexOf('https://') > -1 && (e.currentTarget.dataset.link).indexOf('https://')<4 ){
      redirectTo({
        url: '/pages/webview/webview?url='+ e.currentTarget.dataset.link
      });
    }else{
      navigateTo({
        url: e.currentTarget.dataset.link
      });
    }
  },
  // 会员卡，卡券
  navigate(e) {
    let userid = wxGet('user_id');
    let userInfo = wxGet('userInfo');
    //判断更加严谨
    if (userid && userid != '' && userInfo && userInfo.user_id!='') {
      navigateTo({
        url: e.currentTarget.dataset.url
      });
    }else{
      navigateTo({
        url: '/pages/login/auth/auth'
      });
    }
  },
  onSubmit(e) {
    upformId(e.detail.formId);
  }
})