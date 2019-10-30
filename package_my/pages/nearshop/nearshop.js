import {
  imageUrl,
  ak,
  geotable_id,
  wxGet,
  wxSet
} from '../../../pages/common/js/baseUrl'
import {
  MyNearbyShop,
  GetLbsShop,
  NearbyShop
} from '../../../pages/common/js/home'
import {
  cur_dateTime
} from '../../../pages/common/js/time'
import {
  tx_decrypt
} from '../../../pages/common/js/map'
import {
  navigateTo,
  switchTab,
  reLaunch,
  redirectTo
} from '../../../pages/common/js/router.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    // 地图中心点
    longitude: '',
    latitude: '',
    markersArray: [],
    shopList: [], // 附近门店列表
    inputAddress: '',
    city: '',
    activeIndex: 0,
    height: 448,
    isSearch: false,
    noResult: false,
    isOnfoucs: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.nearShop(wxGet('lng'), wxGet('lat'));
    let ott = tx_decrypt(wxGet('lng'), wxGet('lat'));
    this.setData({
      longitude: ott.lng,
      latitude: ott.lat,
      selfshop: false,
      city: app.globalData.position.city || app.globalData.city
    })
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
    this.setData({
      city: app.globalData.city
    })
    if (app.globalData.chooseBool) {
      this.searchShop('', true)
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
    // app.globalData.shopIng = null;
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
  funInputword(e) {
    if (e.detail.value == '') {
      this.setData({
        searchResult: [],
        isOnfoucs: false,
        noResult: false
      })
    } else {
      this.setData({
        inputAddress: e.detail.value,
        isOnfoucs: false,
        noResult: false
      })
      this.searchShop(e.detail.value, true);
    }
  },
  closeFN() {
    this.setData({
      inputAddress: '',
      searchResult: [],
      noResult: false,
      isOnfoucs: false
    })
  },
  // 输入地址搜索门店
  searchShop(value, bol) {
    let that = this;
    let url = `https://api.map.baidu.com/geocoding/v3/?address=${this.data.city}${value}&output=json&ak=${ak}`
    url = encodeURI(url);
    wx.request({
      url,
      success: (res) => {
        if (res.data.status == 0) {
          let lng = res.data.result.location.lng;
          let lat = res.data.result.location.lat;
          this.setData({
            longitude: lng,
            latitude: lat
          })
          wxSet('lng', lng);
          wxSet('lat', lat)
          that.nearShop(lng, lat);
        } else {
          this.setData({
            noResult: true
          })
        }
      },
      fail: (res) => {
        this.setData({
          noResult: true
        })
      }
    });
  },
  // 获取附近门店
  nearShop(lng, lat) {
    wx.request({
      url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=${geotable_id}&location=${lng}%2C${lat}&ak=${ak}&radius=3000&sortby=distance%3A1&page_index=0&page_size=50&_=`,
      success: (res) => {
        const obj = res.data.contents;
        if (obj.length == 0) {
          this.setData({
            searchResult:[],
            noResult: true
          })
          return
        }
        MyNearbyShop(JSON.stringify(obj)).then((conf) => {
          conf.forEach(item => {
            if (cur_dateTime(item.start_time, item.end_time) != 2) {
              item['isOpen'] = true
            }
          })
          let arr = conf
            .map(({
              shop_gd_latitude,
              shop_gd_longitude
            }) => ({
              longitude: shop_gd_longitude,
              latitude: shop_gd_latitude
            }))
            .map((item, index) => {
              if (index == 0) {
                return {
                  ...item,
                  iconPath: `${imageUrl}position_map1.png`,
                  width: 32,
                  height: 32
                }
              } else {
                return {
                  ...item,
                  iconPath: `${imageUrl}position_map1.png`,
                  width: 15,
                  height: 15
                }
              }
            })
          this.setData({
            markersArray: arr,
            shopList: conf,
            searchResult: conf
          })
          app.globalData.shopIng = null;
          app.globalData.switchClick = false;
          // app.globalData.address = conf[0].address;
          // this.funGetLbsShop(conf[0].location[0], conf[0].location[1], conf[0].address);
          // this.funGetNearbyShop(conf[0].location[0], conf[0].location[1], conf[0].address)
        })
      },
    });
  },
  // 切换城市
  eveChoosecityTap() {
    navigateTo({
      url: '../../../pages/city/city'
    })
  },
  // 切换门店
  eveSwitchShop(e) {
    let arr = this.data.markersArray.map((item, index) => {
      if (index == e.currentTarget.dataset.index) {
        return {
          ...item,
          iconPath: `${imageUrl}position_map1.png`,
          width: 32,
          height: 32
        }
      } else {
        return {
          ...item,
          iconPath: `${imageUrl}position_map1.png`,
          width: 15,
          height: 15
        }
      }
    })
    this.setData({
      markersArray: arr,
      activeIndex: e.currentTarget.dataset.index
    })
  },
  // 导航
  goLocation(e) {
    wx.openLocation({
      latitude: Number(e.currentTarget.dataset.latitude),
      longitude: Number(e.currentTarget.dataset.longitude),
      scale: 16
    })
  },
  // 去自提
  goSelf(e) {
    app.globalData.shopIng = e.currentTarget.dataset.info;
    app.globalData.type = 2;
    wx.reLaunch({
      url: '/pages/home/goodslist/goodslist?isSelf=true'
    })
  },
  // // 外卖附近门店
  // async funGetLbsShop(lng, lat, address) {
  //   let that = this;
  //   const location = `${lng},${lat}`
  //   const shopArr1 = [];
  //   const shopArr2 = [];
  //   app.globalData.address = address;
  //   GetLbsShop(lng, lat).then((res) => {
  //     if (res.code == 100 && res.data.shop_list.length > 0) {
  //       wx.hideLoading();
  //       for (let i = 0; i < res.data.shop_list.length; i++) {
  //         const status = cur_dateTime(res.data.shop_list[i].start_time, res.data.shop_list[i].end_time);
  //         app.globalData.isOpen = status
  //         // 判断是否营业
  //         if (status == 1 || status == 3) {
  //           shopArr1.push(res.data.shop_list[i]);
  //         } else {
  //           shopArr2.push(res.data.shop_list[i]);
  //         }
  //       }

  //       // 按照goods_num做降序排列
  //       let shopArray = shopArr1.concat(shopArr2);
  //       shopArray[0]['jingxuan'] = true;
  //       app.globalData.position.cityAdcode = shopArray[0].city_id
  //       app.globalData.position.districtAdcode = shopArray[0].district_id
  //       app.globalData.type = 1;
  //       wxSet('takeout', shopArray); // 保存外卖门店到本地
  //     }
  //   })
  // },
  // // 自提附近门店
  // async funGetNearbyShop(lng, lat, address) {
  //   const location = `${lng},${lat}`
  //   const str = new Date().getTime();
  //   wx.request({
  //     url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=${geotable_id}&location=${lng}%2C${lat}&ak=${ak}&radius=3000&sortby=distance%3A1&page_index=0&page_size=50&_=${str}`,
  //     success: (res) => {
  //       // 3公里有门店
  //       if (res.data.contents && res.data.contents.length > 0) {
  //         this.funGetSelf(res.data.contents, address)
  //       } else {
  //         // 没有扩大搜索范围到1000000公里
  //         wx.request({
  //           url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=${geotable_id}&location=${lng}%2C${lat}&ak=${ak}&radius=1000000000&sortby=distance%3A1&page_index=0&page_size=50&_=${str}`,
  //           success: (conf) => {
  //             if (conf.data.contents && conf.data.contents.length > 0) {
  //               this.funGetSelf(conf.data.contents, address)
  //             } else {
  //               // 无自提门店

  //             }
  //           },
  //         });
  //       }
  //     },
  //   });
  // },
  // // 获取自提门店信息
  // funGetSelf(obj, address) {
  //   let shopArr1 = [];
  //   let shopArr2 = [];
  //   NearbyShop(JSON.stringify(obj)).then((res) => {
  //     for (let i = 0; i < res.length; i++) {
  //       let status = cur_dateTime(res[i].start_time, res[i].end_time);
  //       app.globalData.isOpen = status
  //       // 判断是否营业
  //       if (status == 1 || status == 3) {
  //         shopArr1.push(res[i]);
  //       } else {
  //         shopArr2.push(res[i]);
  //       }
  //     }
  //     // 根据距离最近排序
  //     const shopArray = shopArr1.concat(shopArr2);
  //     shopArray[0]['jingxuan'] = true;
  //     app.globalData.address = address;
  //     wxSet('self', shopArray); // 保存自提门店到本地  
  //   })
  // },
  funOnfocus() {
    this.setData({
      isOnfoucs: true
    })
  },
  funOutfocus() {
    //判断是否有信息如果有不能false
    if (this.data.inputAddress == '') {
      this.setData({
        isOnfoucs: false
      })
    }
  }
})