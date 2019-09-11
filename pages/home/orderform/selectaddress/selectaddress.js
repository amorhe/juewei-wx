import {
  imageUrl,
  geotable_id,
  ak,
  ak_wx,
  wxGet,
  wxSet
} from '../../../common/js/baseUrl'
import {
  useraddress,
  GetLbsShop,
  NearbyShop
} from '../../../common/js/home'
import {
  cur_dateTime,
  sortNum
} from '../../../common/js/time'
import {
  navigateTo
} from '../../../common/js/router.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    addressList: [],
    mask: false,
    modalShow: false,
    addressListNoUse: [],
    address_id: '',
    lng: '',
    lat: '',
    address: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.funGetAddress();
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
  // 选择不在配送范围内的地址
  eveChooseNewAddress(e) {
    this.setData({
      mask: true,
      modalShow: true,
      lng: e.currentTarget.dataset.lng,
      lat: e.currentTarget.dataset.lat,
      address: e.currentTarget.dataset.address
    })
  },
  onCounterPlusOne(data) {
    if (data.type == 1) {
      wxSet('lng', this.data.lng);
      wxSet('lat', this.data.lat);
      this.getLbsShop(this.data.lng, this.data.lat, this.data.address);
      this.getNearbyShop(this.data.lng, this.data.lat, this.data.address)
    }
    this.setData({
      mask: data.mask,
      modalShow: data.modalShow
    })
  },
  funGetAddress() {
    useraddress(wxGet('shop_id')).then((res) => {
      let addressList = [],
        addressListNoUse = [];
      for (let value of res.data) {
        value.lng = value.user_address_lbs_baidu.split(',')[0];
        value.lat = value.user_address_lbs_baidu.split(',')[1];
        if (value.is_dis == 1) {
          addressList.push(value)
        } else {
          addressListNoUse.push(value)
        }
      }
      this.setData({
        addressList,
        addressListNoUse
      })
    })
  },
  eveChooseAddress(e) {
    app.globalData.address_id = e.currentTarget.dataset.id;
    wx.navigateBack({
      url: '/pages/home/orderform/orderform'
    });
  },
  // 编辑收货地址　
  eveEditAddress(e) {
    navigateTo({
      url: "/package_my/pages/myaddress/addaddress/addaddress?Id=" + e.currentTarget.dataset.id
    });
  },
  // 外卖附近门店
  funGetLbsShop(lng, lat, address) {
    let that = this;
    const location = `${lng},${lat}`
    const shopArr1 = [];
    const shopArr2 = [];
    app.globalData.address = address;
    GetLbsShop(location).then((res) => {
      if (res.code == 0 && res.data.length > 0) {
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
         wxSet('takeout', shopArray); // 保存外卖门店到本地
        that.getNearbyShop(lng, lat, address);
        redirectTo({
          url: '/pages/home/goodslist/goodslist'
        })
      } else {
        // 无外卖去自提
        this.setData({
          loginOpened: true
        })
      }

    })
  },
  // 自提附近门店
  funGetNearbyShop(lng, lat, address) {
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
  // 自提
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
      wxSet('self', shopArray);// 保存自提门店到本地
    })
  },
})