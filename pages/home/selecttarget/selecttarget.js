import {
  imageUrl,
  ak,
  geotable_id,
  wxGet,
  wxSet,
  ak_wx
} from '../../common/js/baseUrl'
import {
  addressList,
  GetLbsShop,
  NearbyShop
} from '../../common/js/home'
import {
  bd_encrypt
} from '../../common/js/map'
import {
  cur_dateTime,
  compare,
  sortNum
} from '../../common/js/time'
import {
  navigateTo,
  switchTab
} from '../../common/js/router.js'
var app = getApp();
// 引入百度地图微信小程序
var bmap = require('../../../utils/libs/bmap-wx.js');
var BMap = new bmap.BMapWX({
  ak: ak_wx
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    city: '', //城市
    addressIng: '', // 定位地址
    canUseAddress: [], // 我的地址
    nearAddress: [], // 附近地址
    isSuccess: false,
    info: '', // 一条地址信息
    inputAddress: '', //手动输入的地址
    loginOpened: false,
    searchResult: [], // 搜索结果
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.type) {
      this.setData({
        isSuccess: true,
        city: app.globalData.position.city || app.globalData.city,
        addressIng: app.globalData.address,
        info: app.globalData.position
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
    const _sid = wxGet('_sid');
    //获取用户收货地址,一次性获取下来
    if (_sid) {
      addressList(_sid, 'normal', location).then((res) => {
        let arr1 = [];
        if (res.data.length > 0) {
          arr1 = res.data.filter(item => item.user_address_is_dispatch == 1)
        }
        this.setData({
          canUseAddress: arr1
        })
      });
    }
    if (app.globalData.address) {
      const lng = wxGet('lng');
      const lat = wxGet('lat');
      const location = `${lng},${lat}`;
      this.funGetAddressList(location, lat, lng);
    }
    if (app.globalData.chooseBool) {
      this.setData({
        city: app.globalData.city
      })
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
  // 切换城市
  eveChoosecityTap() {
    app.globalData.chooseBool = false;
    navigateTo({
      url: '/pages/city/city'
    })
  },
  funInputword(e) {
    this.searchShop(e.detail.value)
  },
  // 输入地址搜索门店
  searchShop(value) {
    let that = this;
    //附近地址列表
    if (value != '') {
      let url = `https://api.map.baidu.com/geocoding/v3/?address=${this.data.city}${value}&output=json&ak=${ak}`
      url = encodeURI(url);
      wx.request({
        url,
        success: (res) => {
          if (res.data.result.level != "UNKNOWN" && res.data.result.level != this.data.level) {
            let lng = res.data.result.location.lng;
            let lat = res.data.result.location.lat;
            let location = `${lng},${lat}`;
            that.funGetAddressList(location, lat, lng);
            that.funSearchShop(that, value, lat, lng);
          }
        },
      });
    }
  },
  // 搜索门店
  funSearchShop(that, value, lat, lng) {
    wx.request({
      url: `http://api.map.baidu.com/place/v2/search?query=${value}&location=${lat},${lng}&radius=100000&scope=2&output=json&ak=${ ak }`,
      success(res) {
        if (res.data.results.length > 0) {
          that.setData({
            searchResult: res.data.results
          })
        }
      }
    })
  },
  // 选择门店
  eveChooseshop(e) {
    if (e.currentTarget.dataset.name.indexOf('绝味鸭脖') != -1) {
      this.funGetLbsShop(e.currentTarget.dataset.lng, e.currentTarget.dataset.lat, e.currentTarget.dataset.address, 'click');
      this.funGetNearbyShop(e.currentTarget.dataset.lng, e.currentTarget.dataset.lat, e.currentTarget.dataset.address, 'click');
    } else {
      wx.showToast({
        title: '请搜索绝味鸭脖相关字',
        icon: 'none'
      })
    }
  },
  //附近地址列表
  funGetAddressList(location, lat, lng) {
    //附近列表中没有传出当前的 地区id,城市id等参数
    // 百度附近POI
    let str = `https://api.map.baidu.com/place/v2/search?query=房地产$金融$公司企业$政府机构$医疗$酒店$美食$生活服务$教育培训$交通设施&location=${lat},${lng}&radius=1000&output=json&page_size=50&page_num=0&ak=${ak}`;
    str = encodeURI(str);
    wx.request({
      url: str,
      success: (res) => {
        if (res.data.status == 0) {
          this.setData({
            nearAddress: res.data.results
          })
        } else {
          this.setData({
            nearAddress: []
          })
        }
      },
      fail: (rej) => {
        this.setData({
          nearAddress: []
        })
      }
    });
  },
  // 重新定位
  eveRePosition() {
    wx.showLoading({
      title: "定位中..."
    });
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success(ott) {
        wx.hideLoading();
        let res = {};
        wxSet('txPos', ott)
        BMap.regeocoding({
          success(data) {
            res = data.originalData.result;
            wx.showToast({
              title: '定位成功！'
            })
            that.setData({
              city: res.addressComponent.city,
              addressIng: res.pois[0].name,
              info: res,
              isSuccess: true,
              nearAddress: res.pois
            })
            app.globalData.province = res.addressComponent.province;
            app.globalData.city = res.addressComponent.city;
            app.globalData.address = res.pois[0].name;
            app.globalData.position = res;
            app.globalData.position.longitude = res.location.lng;
            app.globalData.position.latitude = res.location.lat;
            wxSet('lat', res.location.lat); // 纬度
            wxSet('lng', res.location.lng); // 经度
            wxSet('nearPois', res.pois); // 附近地址
            that.funGetLbsShop(res.location.lng, res.location.lat, res.pois[0].name);
            that.funGetNearbyShop(res.location.lng, res.location.lat, res.pois[0].name);
            that.funGetAddressList((res.location.lng, res.location.lat), res.location.lat, res.location.lng);
          }
        })
      },
      fail() {
        that.setData({
          isSuccess: false
        })
      }
    })
  },
  //选择附近地址
  eveSwitchAddress(e) {
    //手动定位没有地址
    if (e.currentTarget.dataset.type == '1' && !this.data.isSuccess && e.currentTarget.dataset.address == '') {
      wx.showToast({
        title: '定位失败，请选择其他收货地址！'
      });
      this.setData({
        nearAddress:[]
      })
      return
    }
    //定位失败
    let mapPosition = '';
    let lng, lat;
    switch (parseInt(e.currentTarget.dataset.type)) {
      case 1:
        lng = e.currentTarget.dataset.info.longitude;
        lat = e.currentTarget.dataset.info.latitude;
        mapPosition = bd_encrypt(lng, lat);
        break;
      case 3:
        lng = e.currentTarget.dataset.info.location.lng;
        lat = e.currentTarget.dataset.info.location.lat;
        mapPosition = bd_encrypt(e.currentTarget.dataset.info.location.lng, e.currentTarget.dataset.info.location.lat);
        break;
    }
    wxSet('lat', mapPosition.lat);
    wxSet('lng', mapPosition.lng);
    app.globalData.position = e.currentTarget.dataset.info;
    app.globalData.position.city = e.currentTarget.dataset.info.city;
    app.globalData.position.district = e.currentTarget.dataset.info.area;
    app.globalData.position.cityAdcode = '';
    app.globalData.position.districtAdcode = '';
    app.globalData.shopIng = null;
    if (e.currentTarget.dataset.info.location) {
      app.globalData.position.latitude = e.currentTarget.dataset.info.location.lat;
      app.globalData.position.longitude = e.currentTarget.dataset.info.location.lng;
    } else {
      app.globalData.position.latitude = lat;
      app.globalData.position.longitude = lng;
    }

    app.globalData.position.province = e.currentTarget.dataset.info.province;
    //额外添加两个
    app.globalData.city = e.currentTarget.dataset.info.city;
    app.globalData.province = e.currentTarget.dataset.info.province;
    let address = '';
    if (e.currentTarget.dataset.type == 1) {
      address = e.currentTarget.dataset.address;
    } else {
      address = e.currentTarget.dataset.info.name;
    }
    this.funGetLbsShop(app.globalData.position.longitude, app.globalData.position.latitude, address, 'click');
    this.funGetNearbyShop(app.globalData.position.longitude, app.globalData.position.latitude, address, 'click')

  },
  // 选择我的收货地址
  eveSwitchPositionAddress(e) {
    //我的收获地址未能传递地区id，城市id等参数。
    let position = e.currentTarget.dataset.info.user_address_lbs_baidu.split(',');
    wxSet('lat', position[1]);
    wxSet('lng', position[0]);
    app.globalData.position = e.currentTarget.dataset.info;
    app.globalData.position.cityAdcode = '';
    app.globalData.position.districtAdcode = '';
    app.globalData.shopIng = null;
    this.funGetLbsShop(position[0], position[1], e.currentTarget.dataset.info.user_address_map_addr, 'click');
    this.funGetNearbyShop(position[0], position[1], e.currentTarget.dataset.info.user_address_map_addr, 'click')
  },
  // 外卖附近门店
  async funGetLbsShop(lng, lat, address, str) {
    let that = this;
    const location = `${lng},${lat}`
    const shopArr1 = [];
    const shopArr2 = [];
    app.globalData.address = address;
    GetLbsShop(location).then((res) => {
      if (res.code == 0 && res.data.length > 0) {
        wx.hideLoading();
        for (let i = 0; i < res.data.length; i++) {
          const status = cur_dateTime(res.data[i].start_time, res.data[i].end_time);
          app.globalData.isOpen = status
          // 判断是否营业
          if (status == 1 || status == 3) {
            shopArr1.push(res.data[i]);
          } else {
            shopArr2.push(res.data[i]);
          }
        }

        // 按照goods_num做降序排列
        let shopArray = shopArr1.concat(shopArr2);
        shopArray.sort((a, b) => {
          var value1 = a.goods_num,
            value2 = b.goods_num;
          if (value1 <= value2) {
            return a.distance - b.distance;
          }
          return value2 - value1;
        });
        shopArray[0]['jingxuan'] = true;
        app.globalData.position.cityAdcode = shopArray[0].city_id
        app.globalData.position.districtAdcode = shopArray[0].district_id
        app.globalData.type = 1;
        wxSet('takeout', shopArray); // 保存外卖门店到本地
        // that.funGetNearbyShop(lng, lat, address);
        if (str) {
          switchTab({
            url: '/pages/home/goodslist/goodslist'
          })
        }
      } else {
        // 无外卖去自提
        wx.showModal({
          content: '当前选择地址无可浏览的门店!',
          confirmText: '去自提',
          showCancel: false,
          confirmColor: "#E60012",
          success(res) {
            if (res.confirm) {
              that.funOnModalRepurse();
            }
          }
        })
      }
    })
  },
  // 自提附近门店
  async funGetNearbyShop(lng, lat, address) {
    const location = `${lng},${lat}`
    const str = new Date().getTime();
    wx.request({
      url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=${geotable_id}&location=${lng}%2C${lat}&ak=${ak}&radius=3000&sortby=distance%3A1&page_index=0&page_size=50&_=${str}`,
      success: (res) => {
        // 3公里有门店
        if (res.data.contents && res.data.contents.length > 0) {
          this.funGetSelf(res.data.contents, address)
        } else {
          // 没有扩大搜索范围到1000000公里
          wx.request({
            url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=${geotable_id}&location=${lng}%2C${lat}&ak=${ak}&radius=1000000000&sortby=distance%3A1&page_index=0&page_size=50&_=${str}`,
            success: (conf) => {
              if (conf.data.contents && conf.data.contents.length > 0) {
                this.funGetSelf(conf.data.contents, address)
              } else {
                // 无自提门店

              }
            },
          });
        }
      },
    });
  },
  // 获取自提门店信息
  funGetSelf(obj, address) {
    let shopArr1 = [];
    let shopArr2 = [];
    NearbyShop(JSON.stringify(obj)).then((res) => {
      for (let i = 0; i < res.length; i++) {
        let status = cur_dateTime(res[i].start_time, res[i].end_time);
        app.globalData.isOpen = status
        // 判断是否营业
        if (status == 1 || status == 3) {
          shopArr1.push(res[i]);
        } else {
          shopArr2.push(res[i]);
        }
      }
      // 根据距离最近排序
      shopArr1.sort(sortNum('distance'));
      shopArr2.sort(sortNum('distance'));
      const shopArray = shopArr1.concat(shopArr2);
      shopArray[0]['jingxuan'] = true;
      app.globalData.address = address;
      wxSet('self', shopArray); // 保存自提门店到本地  
    })
  },
  // 新增地址
  eveAddAddressTap() {
    // 判断 是否登录
    if (wxGet('user_id') == undefined) {
      navigateTo({
        url: '/pages/login/auth/auth'
      });
    } else {
      navigateTo({
        url: "/package_my/pages/myaddress/addaddress/addaddress"
      });
    }
  },
  // 去自提
  funOnModalRepurse() {
    app.globalData.type = 2;
    wx.removeStorageSync('takeout');
    let shopArray = wxGet('self') || [];
    app.globalData.position.cityAdcode = shopArray[0].city_id;
    app.globalData.position.districtAdcode = shopArray[0].district_id;
    switchTab({
      url: '/pages/home/goodslist/goodslist'
    })
  }
})