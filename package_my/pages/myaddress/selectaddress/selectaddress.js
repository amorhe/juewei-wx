import {
  imageUrl,
  ak,
  ak_wx,
  geotable_id
} from '../../../../pages/common/js/baseUrl'
import {
  tx_decrypt,
  bd_encrypt
} from '../../../../pages/common/js/map'
// 引入百度地图微信小程序
var bmap = require('../../../../utils/libs/bmap-wx.js');
var BMap = new bmap.BMapWX({
  ak: ak_wx
});
var app = getApp();
Page({
  data: {
    imageUrl,
    mapiconInfo: '',
    mapInfo: [],
    addressList: [],
    city: '',
    inputAddress: '', //手动输入的地址
    loginOpened: false,
    isOnfoucs: false,
    noSearchResult: false
  },
  onLoad(e) {
    this.funGetposition();
  },
  onShow() {
    if (app.globalData.chooseBool) {
      app.globalData.chooseBool = false;
      this.setData({
        city: app.globalData.choosecity
      })
    } else {
      this.setData({
        city: app.globalData.city
      })
    }
  },
  funGetposition() {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success(ott) {
        wx.hideLoading();
        let res = {};
        // 发起regeocoding检索请求
        BMap.regeocoding({
          success(data) {
            res = data.originalData.result;
            that.setData({
              longitude: res.location.lng,
              latitude: res.location.lat,
              city: res.addressComponent.city
            })
            that.searchShop(res.poiRegions[0].name)
          },
          fail: function() {
            clearInterval(timeCount);
            // 定位失败
            wx.hideLoading();
            reLaunch({
              url: '/pages/noposition/noposition'
            })
          }
        });
      },
      fail() {
        clearInterval(timeCount);
        // 定位失败
        wx.hideLoading();
        reLaunch({
          url: '/pages/noposition/noposition'
        })
      },
    })
  },
  setIcon(lng, lat) {
    let url = 'https://api.map.baidu.com/geosearch/v3/nearby?ak=' + ak + '&geotable_id=' + geotable_id + '&location=' + lng + ',' + lat + '&radius=2000'
    wx.request({
      url,
      success: (res) => {
        // 设置定位位置的图标

        if (!this.data.sysInfo) {
          let sysInfo = wx.getSystemInfoSync();
          this.setData({
            sysInfo: sysInfo
          })
        }
        let windowWidth = this.data.sysInfo.windowWidth;
        let windowHeight = this.data.sysInfo.windowHeight;
        var arr = [{
          iconPath: imageUrl + 'position.png',
          latitude: lat, // 高德经纬度
          longitude: lng,
          width: 32,
          height: 32,
          fixedPoint: {
            originX: windowWidth / 2,
            originY: windowHeight / 4
          }
        }]
        // 设置门店的图标
        res.data.contents.forEach(item => {
          var obj = {}
          obj.iconPath = imageUrl + 'position.png'
          let txPos = tx_decrypt(item.location[0], item.location[1])
          obj.latitude = txPos.lat;
          obj.longitude = txPos.lng;
          obj.width = 20
          obj.height = 20
          arr.push(obj)
        })

        this.setData({
          mapInfo: arr
        })
      },
    });
  },
  //地址列表
  searchShop(value) {
    let that = this;
    let str = '';
    let url = `https://api.map.baidu.com/place/v2/search?query=${value}&region=${that.data.city}&city_limit=true&output=json&ak=${ak}`;
    wx.request({
      url,
      success: (res) => {
        if (res.data.status === 0) {
          let result = res.data.results;
          // 无数据显示无数据页面
          if (result.length === 0) {
            this.setData({
              addressList: [],
              noSearchResult: true
            })
            return
          }
          this.setData({
            addressList: result,
            noSearchResult: false
          })
        }
        // 搜索到的位置
        let centerPos = res.data.results[0];
        if (centerPos) {
          const tx_pos = tx_decrypt(centerPos.location.lng, centerPos.location.lat);
          this.setData({
            longitude: tx_pos.lng,
            latitude: tx_pos.lat
          });
          this.setIcon(tx_pos.lng, tx_pos.lat);
        }
      },
      fail: (res) => {
        this.setData({
          noSearchResult: true
        })
      }
    });
  },
  // 切换城市
  eveChoosecityTap() {
    app.globalData.chooseBool = false;
    wx.navigateTo({
      url: '/pages/city/city'
    })
  },
  evebindinput(e) {
    if (e.detail.value == '') {
      this.setData({
        list: [],
        isOnfoucs: false,
        noSearchResult: false
      })
    } else {
      this.setData({
        inputAddress: e.detail.value
      })
      this.searchShop(e.detail.value);
    }
  },
  closeFN() {
    this.setData({
      inputAddress: '',
      list: [],
      noSearchResult: false,
      isOnfoucs: false
    })
  },
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
  },
  mapTap(e) {
    if (!this.data.movePosFlag) {
      return;
    }
    if (e.type == 'end' || e.type == 'tap') {

      let newLat = e.latitude;
      let newLng = e.longitude;
      let that = this;
      that.setIcon(e.longitude, e.latitude);
      let baiduPos = bd_encrypt(e.longitude, e.latitude);
      this.mapCtx.updateComponents({
        longitude: e.longitude,
        latitude: e.latitude,
      })
      let url = `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${ak}&output=json&coordtype=bd09ll&location=${baiduPos.bd_lat},${baiduPos.bd_lng}&extensions_poi=1`;
      url = encodeURI(url);
      my.request({
        url,
        success: (res) => {
          if (res.data.status === 0) {
            let result = res.data.result.pois;
            let addressComponent = res.data.result.addressComponent
            // 无数据显示无数据页面
            if (result.length === 0) {
              this.setData({
                noSearchResult: true
              })
            }

            result.forEach(item => {
              item.province = addressComponent.province,
                item.city = addressComponent.city,
                item.district = addressComponent.district
              item.location = {
                lng: item.point.x,
                lat: item.point.y
              }
            })
            this.setData({
              addressList: result,
              noSearchResult: false
            })
          }
        },
      });
    }
  },
  eveSwitchAddress(e) {
    let pos = e.currentTarget.dataset.info;
    app.globalData.addAddressInfo = pos;
    wx.navigateBack();
  }
});