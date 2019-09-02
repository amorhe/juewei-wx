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
  GetLbsShop,
  NearbyShop,
  GetShopGoods,
  couponsExpire,
  MyNearbyShop
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
var app = getApp();
let tim = null;
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
    companyGoodsList: [],
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
    goodsType: 0, //系列
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
    type: {
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
    leftTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    if (app.globalData.isSelf) {
      this.setData({
        isSelf: true
      })
    }
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
        shopTakeOut: app.globalData.shopIng,
        shopGoodsAll: []
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
        jingxuan: true,
        shopGoodsAll: []
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
    if (wxGet('user_id')) {
      user_id = wxGet('user_id');
    }
    this.getCompanyGoodsList(this.data.shopTakeOut.company_sale_id); //获取公司所有商品
    this.getBannerList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id); //banner
    this.getShowpositionList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id);
    this.getActivityList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id, app.globalData.type, user_id) //营销活动
    wxSet('vip_address', app.globalData.shopTakeOut)

    // 自定义跳转页面
    let topage = (app.globalData.page || wxGet('query') || '');
    app.globalData.page = null; //删除
    wx.removeStorage({
      key: 'query'
    }); //删除
    // console.log('topage',topage);
    if (topage != '') {
      switch (topage) {
        //会员
        case '/pages/home/goodslist/goodslist':
          //就是当前页不用跳转任何
          break;
          //会员
        case '/pages/vip/index/index':
          wx.switchTab({
            url: topage
          });
          break;
          // 订单
        case '/pages/order/list/list':
          wx.switchTab({
            url: topage
          });
          break;
          // 个人中心
        case '/pages/my/index/index':
          wx.switchTab({
            url: topage
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
          }, 500)
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
  // 关闭提醒
  closeOpen() {
    this.setData({
      isClose: true
    })
  },
  // 切换外卖自提
  chooseTypes(e) {
    // js节流防短时间重复点击
    if (this.data.btnClick == false) {
      return
    }
    this.setData({
      btnClick: false
    })
    console.log('切换');
    let user_id = 1;
    if (wxGet('user_id')) {
      user_id = wxGet('user_id')
    }

    if (e.currentTarget.dataset.type == 'ziti') {
      console.log('ziti');
      let shopTakeOut = wxGet('self')[0] || '';
      this.setData({
        shopTakeOut,
        type: 2,
        jingxuan: true
      });
      app.globalData.type = 2;
      this.getActivityList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id, app.globalData.type, user_id)
      this.getCompanyGoodsList(shopTakeOut.company_sale_id); //获取公司所有商品(第一个为当前门店)
      this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id); //banner
      this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id);
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
      this.getActivityList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id, app.globalData.type, user_id)
      this.getCompanyGoodsList(shopTakeOut.company_sale_id); //获取公司所有商品(第一个为当前门店)
      this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id); //banner
      this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id);
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
  async getBannerList(city_id, district_id, company_id) {
    await bannerList(city_id, district_id, company_id, 1).then((data) => {
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
  getShowpositionList(city_id, district_id, company_id) {
    showPositionList(city_id, district_id, company_id, 1).then((res) => {
      this.setData({
        showListObj: res.data
      })
    })
  },
  // 门店营销活动(折扣和套餐)
  getActivityList(city_id, district_id, company_id, buy_type, user_id) {
    activityList(city_id, district_id, company_id, buy_type, user_id).then((res) => {
      // 获取加价购商品
      if (res.data.MARKUP) {
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
        this.getShopGoodsList(this.data.shopTakeOut.shop_id);
      })
    })
  },
  // 公司商品列表
  getCompanyGoodsList(company_id) {
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

  // 门店商品列表
  getShopGoodsList(shop_id) {
    GetShopGoods(shop_id).then((res) => {
      wx.hideLoading();
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
      } else {
        app.globalData.freeId = null;
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
            if (goodsList == null) {
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
            this.shopcartPrompt(nextProps.fullActivity, priceFree, repurse_price);
            if (!wxGet('goodsList')) {
              this.onchangeShopcart({}, [], 0, 0, 0);
            }
            this.setData({
              shopcartList: shopcartObj,
              priceAll,
              shopcartAll,
              shopcartNum,
              priceFree,
              freeMoney: nextProps.freeMoney,
              repurse_price
            })
            wxSet('goodsList', shopcartObj);


            // 获取商品模块的节点
            wx.createSelectorQuery().selectAll('.goodsTypeEv').boundingClientRect().exec((ret) => {
              if (ret[0] == null) {
                return;
              }
              let top = ret[0][0].top;
              let arr = ret[0].map((item, index) => {
                return item.top = item.top - top - 37;
              })
              app.globalData.ret = arr;
            })
            wx.createSelectorQuery().selectAll('#pagesinfo').boundingClientRect().exec((e) => {
              if (e[0] == null) {
                return;
              }
              if (!this.data.isSelf) {
                app.globalData.scrollTop = e[0][0].top
              }
            })
            let h = 0,
              heightArr = [];
            wx.createSelectorQuery().selectAll('.sc_right_item').boundingClientRect().exec((rect) => {
              if (rect[0].length > 0) {
                rect[0].forEach((item) => {
                  h += item.height;
                  heightArr.push(h);
                })
                app.globalData.heightArr = heightArr;
              } else {
                app.globalData.heightArr = []
              }
            });
          })
          wxSet('shopGoods', goodsArr)
        },
      });

    })
  },
  //  活动跳转链接
  imageLink(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    });
  },
  // banner图跳转链接
  linkUrl(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    });
  },
  // 会员卡，卡券
  navigate(e) {
    if (wxGet('user_id') == null) {
      wx.navigateTo({
        url: '/pages/login/auth/auth'
      });
      return
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },
  onSubmit(e) {
    upformId(e.detail.formId);
  }
})