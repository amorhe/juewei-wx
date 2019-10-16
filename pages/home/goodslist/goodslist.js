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
  navigateTo
} from '../../common/js/router.js'
import {
  startAddShopAnimation
} from '../../common/js/AddShopCar.js'
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
    freeMoney: '',
    jingxuan: true,
    btnClick: true,
    activityList: [],
    shopcartList: {}, // 购物车缓存
    goodsType: 1, //系列
    togoodsType: 1, // 点击跳转
    maskView: false,
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
    isTab: false,
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.createSelectorQuery().select(".e1").boundingClientRect((rect) => {
      this.setData({
        shopcart_top: rect.top - 100
      })
    }).exec()
    //获取节点距离顶部的距离
    setTimeout(() => {
      wx.createSelectorQuery().select('#pages_s').boundingClientRect().exec((rect) => {
        if (rect[0] != null) {
          var navbarInitTop = parseInt(rect[0].top);
          this.setData({
            navbarInitTop: navbarInitTop * 2
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
      firstAddress: app.globalData.address,
      type: app.globalData.type,
      shopTakeOut: {}
    })
    wx.showLoading({
      title: '加载中...'
    });
    // 初始化默认外卖
    let shopArray = [];
    if (app.globalData.shopIng && !app.globalData.switchClick) {
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
    } else if (!app.globalData.shopIng && !app.globalData.switchClick) {
      if (app.globalData.type == 1) {
        shopArray = wxGet('takeout')
      } else {
        shopArray = wxGet('self')
      }

      // console.log(shopArray)
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
    if (wxGet('userInfo').user_id) {
      user_id = wxGet('userInfo').user_id;
      // 优惠券
      this.funGetcouponsExpire(wxGet('_sid'));
    }
    this.funGetCompanyGoodsList(this.data.shopTakeOut.company_sale_id); //获取公司所有商品
    this.funGetBannerList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id); //banner
    this.funGetShowpositionList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id);
    this.funGetActivityList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id, app.globalData.type, user_id) //营销活动
    wxSet('vip_address', app.globalData.shopTakeOut);
    this.funGotopage()
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
    // console.log(scrollTop)
    // console.log('1', that.data.navbarInitTop / 2)
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
  setDelayTime(sec) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, sec)
    });
  },
  // 创建动画
  createAnimation(ballX, ballY) {
    let that = this,
      bottomX = 45,
      bottomY = that.data.shopcart_top,
      animationX = that.flyX(bottomX, ballX), // 创建小球水平动画
      animationY = that.flyY(bottomY, ballY); // 创建小球垂直动画
    that.setData({
      showBall: true,
      ballX,
      ballY
    })
    that.setDelayTime(100).then(() => {
      // 100ms延时,  确保小球已经显示
      that.setData({
        animationX: animationX.export(),
        animationY: animationY.export()
      })
      // 500ms延时, 即小球的抛物线时长
      return that.setDelayTime(500);
    }).then(() => {
      that.setData({
        showBall: true,
        animationX: that.flyX(0, 0, 0).export(),
        animationY: that.flyY(0, 0, 0).export(),
        ballX: 0,
        ballY: 0
      })
    })
  },
  // 水平动画
  flyX(bottomX, ballX, duration) {
    let animation = wx.createAnimation({
      duration: duration || 500,
      timingFunction: 'linear',
    })
    animation.translateX(-(ballX - bottomX)).step();
    return animation;
  },
  // 垂直动画
  flyY(bottomY, ballY, duration) {
    let animation = wx.createAnimation({
      duration: duration || 500,
      timingFunction: 'ease-in',
    })
    animation.translateY(bottomY - ballY).step();
    return animation;
  },
  // 关闭提醒
  eveCloseOpen() {
    this.setData({
      isClose: true
    })
  },
  funGotopage() {
    // 自定义跳转页面
    let topage = (app.globalData.gopages || wxGet('query') || '');
    app.globalData.gopages = ''; //删除
    wx.removeStorageSync('query'); //删除
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
      this.funGetCompanyGoodsList(shopTakeOut.company_sale_id); //获取公司所有商品(第一个为当前门店)
      this.funGetActivityList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id, app.globalData.type, user_id)
      this.funGetBannerList(shopTakeOut.city_id, shopTakeOut.district_id, shopTakeOut.company_sale_id); //banner
      this.funGetShowpositionList(shopTakeOut.city_id, shopTakeOut.district_id, shopTakeOut.company_sale_id);
    } else {
      console.log('外卖');
      //切换外卖
      if (!wxGet('takeout')) {
        this.setData({
          btnClick: true
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
      this.funGetCompanyGoodsList(shopTakeOut.company_sale_id); //获取公司所有商品(第一个为当前门店)
      this.funGetActivityList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id, app.globalData.type, user_id)
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
  // 公司商品列表
  funGetCompanyGoodsList(company_id) {
    const timestamp = new Date().getTime();
    wx.request({
      url: `${jsonUrl}/api/product/company_sap_goods${company_id}.json?v=${timestamp}`,
      success: (res) => {
        // 该公司所有的商品
        this.setData({
          companyGoodsList: res.data.data[`${company_id}`]
        })
      }
    });
  },
  // 门店营销活动(折扣和套餐)
  funGetActivityList(city_id, district_id, company_id, buy_type, user_id) {
    activityList(city_id, district_id, company_id, buy_type, user_id, 2, 2).then((res) => {
      // 获取加价购商品
      if ('MARKUP' in res.data && res.data.MARKUP != null) {
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
        this.funGetShopGoodsList(this.data.shopTakeOut.shop_id);
      })
    })
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
      }
      // 筛选在当前门店里面的套餐商品  
      if (this.data.activityList.PKG) {
        PKG = this.data.activityList.PKG.filter(item => item.pkg_goods.map(ott => arr.findIndex(value => value.sap_code == ott.sap_code) != -1));
      }
      // 套餐商品图片格式
      for (let item of PKG) {
        item.goods_img = [item.goods_img];
        item.goods_img_detail_origin = [item.goods_img_detail_origin]
        item.goods_img_intr_origin = [item.goods_img_intr_origin]
      }
      // 包邮活动
      if (this.data.activityList && this.data.activityList.FREE) {
        app.globalData.freeId = this.data.activityList.FREE.id;
        this.setData({
          freeMoney: this.data.activityList.FREE.money
        })
        app.globalData.freeMoney = this.data.activityList.FREE.money
      } else {
        app.globalData.freeId = null;
        app.globalData.freeMoney = null;
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
        url: `https://images.juewei.com/prod/shop/goods_sort.json?v=${str}`,
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
                if (app.globalData.DIS != null || app.globalData.PKG != null) {
                  // 折扣
                  if (goodsList[val].goods_code.indexOf('PKG') == -1 && app.globalData.DIS != null) {
                    for (let ott of app.globalData.DIS) {
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
                    if (app.globalData.PKG != null) {
                      for (let ott of app.globalData.PKG) {
                        for (let fn of ott.goods_format) {
                          if (val == `${fn.goods_activity_code}_${fn.type != undefined ? fn.type:''}`) {
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
                } else {
                  priceAll += shopcartObj[val].goods_price * shopcartObj[val].num;
                }
                if (!shopcartObj[val].goods_discount) {
                  priceFree += shopcartObj[val].goods_price * shopcartObj[val].num;
                }
                if (shopcartObj[val].huangou) {
                  repurse_price += shopcartObj[val].goods_price * shopcartObj[val].num;
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
            if (ret[0] == null || ret[0][0]==null) {
              return;
            }
            let top = ret[0][0].top;
            let arr = ret[0].map((item, index) => {
              return item.top = item.top - top - 37;
            })
            goodsret = arr;
          })
          wxSet('shopGoods', goodsArr)
        },
      });

    })
  },
  // 监听商品列表滚动
  bindscroll(e) {
    if (e.detail.scrollTop <= 0) {
      // 滚动到最顶部
      this.setData({
        isTab: true
      })
    }
    if (!this.data.isTab) {
      wx.pageScrollTo({
        scrollTop: this.data.navbarInitTop
      })
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
        // console.log(sum)
        if (this.data.goodsType != sum) {
          this.setData({
            goodsType: sum
          })
        }
      })
    }
  },
  // 加入购物车
  eveAddshopcart(e) {
    let goods_car = {};
    let goods_code = e.currentTarget.dataset.goods_code;
    // let goods_format = e.currentTarget.dataset.goods_format;
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
        if (goodlist[keys].goods_order_limit != null && goodlist[`${e.currentTarget.dataset.goods_code}_${goods_format}`].num > e.currentTarget.dataset.goods_order_limit) {
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
        priceFree += goodlist[keys].goods_price * goodlist[keys].num;
        priceAll += goodlist[keys].goods_price * goodlist[keys].num
      }

      // 计算可换购商品价格
      if (goodlist[keys].huangou) {
        repurse_price += goodlist[keys].goods_price * goodlist[keys].num;
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
    wxSet('goodsList', goodlist)
    // console.log(e)
    // 购物车小球动画
    // let ballX = e.touches[0].clientX,
    //   ballY = e.touches[0].clientY;
    // console.log(this.data.shopcart_top)
    // console.log(e.touches[0].clientY)
    // this.createAnimation(ballX, ballY);
    var finger = {};
    finger['x'] = e.touches[0].clientX / wx.getSystemInfoSync().windowWidth * 750;
    finger['y'] = e.touches[0].clientY / wx.getSystemInfoSync().windowWidth * 750;
    startAddShopAnimation([{
      x: 45,
      y: 750 * wx.getSystemInfoSync().windowHeight / wx.getSystemInfoSync().windowWidth - 45
    }, finger], this)
  },
  eveReduceshopcart(e) {
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
    this.setData({
      shopcartList: goodlist,
      shopcartAll,
      priceAll,
      shopcartNum,
      priceFree,
      repurse_price
    })
    wxSet('goodsList', goodlist)
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
  // 优惠券过期提醒
  funGetcouponsExpire(_sid) {
    couponsExpire(_sid).then((res) => {
      // console.log(res)
      if (Object.keys(res.data).length > 0) {
        res.data.days = datedifference(getNowDate(), res.data.end_time)
        this.setData({
          couponsExpire: res.data,
          isShow: true
        })
      } else {
        this.setData({
          isShow: false
        })
      }

    })
  },
  // 关闭优惠券提醒
  eveCloseCouponView() {
    this.setData({
      isShow: false
    })
  },
  // 购物车活动提示
  funShopcartPrompt(oldArr, priceFree, repurse_price) {
    let activityText = '',
      freeText = '';
    if (oldArr == []) {
      return
    }
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
      if (priceFree == 0) {
        freeText = `满${this.data.freeMoney / 100}元 免配送费`
      } else if (priceFree < this.data.freeMoney) {
        freeText = `还差${(this.data.freeMoney / 100 - priceFree / 100).toFixed(2)}元 免配送费`
      } else {
        freeText = `已满${this.data.freeMoney / 100}元 免配送费`
      }
    }
    this.setData({
      activityText,
      freeText
    })
  },
  // 去商品详情页
  eveGoodsdetailContent(e) {
    navigateTo({
      url: '/pages/home/goodslist/goodsdetail/goodsdetail?goods_code=' + e.currentTarget.dataset.goods_code + '&key=' + e.currentTarget.dataset.key
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
  },
  //  活动跳转链接
  imageLink(e) {
    navigateTo({
      url: e.currentTarget.dataset.link
    });
  },
  // banner图跳转链接
  linkUrl(e) {
    navigateTo({
      url: e.currentTarget.dataset.link
    });
  },
  // 会员卡，卡券
  navigate(e) {
    if (wxGet('user_id') == null && wxGet('userInfo').user_id == null) {
      navigateTo({
        url: '/pages/login/auth/auth'
      });
      return
    }
    navigateTo({
      url: e.currentTarget.dataset.url
    });
  },
  onSubmit(e) {
    upformId(e.detail.formId);
  }
})