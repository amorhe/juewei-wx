import {
  imageUrl,
  ak,
  geotable_id,
  wxSet,
  wxGet,
  ak_wx
} from '../../../../pages/common/js/baseUrl'
import {
  getRegion
} from '../../../../pages/common/js/utils'
import {
  addressCreate,
  addressinfo,
  updateaddress,
  deleteaddress
} from '../../../../pages/common/js/address'
import {
  bd_encrypt
} from '../../../../pages/common/js/map'
let region = []
var app = getApp()
// 引入百度地图微信小程序
var bmap = require('../../../../utils/libs/bmap-wx.js');
var BMap = new bmap.BMapWX({
  ak: ak_wx
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    modalShow: false, // 弹窗
    // 地址
    name: '',
    sex: 1,
    phone: '',
    address: '',
    labelList: [{
        name: '家',
        type: 1
      },
      {
        name: '公司',
        type: 2
      },
      {
        name: '学校',
        type: 3
      }
    ],
    curLabel: 0,
    selectAddress: false,
    addressList: region,
    provinceList: [],
    cityList: [],
    countryList: [],
    defaultAddress: [0, 0, 0],
    shop_id: '',
    addressId: '',
    order: 0,
    _sid: '',
    addressdetail: '',
    modalidShow: false, // 无门店,
    detailAdd: '',
    clickadd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var _sid = wxGet('_sid');
    this.data._sid = _sid
    if (options.Id) {
      this.data.addressId = options.Id
      this.getInfo(options.Id)
    } else {
      this.data.addressId = ''
      this.getLocation()
    }
    if (options.order) {
      this.data.order = 1
    }
    region = await getRegion()
    this.getAddressList()
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
  getLocation() {
    var that = this;
    let ott = {};
    wx.getLocation({
      type: 'gcj02',
      success(conf) {
        BMap.regeocoding({
          success(data) {
            ott = data.originalData.result;
            let address = ott.pois[0].name ? ott.pois[0].name : ott.pois[0].address
            let map_position = bd_encrypt(conf.longitude, conf.latitude);
            wx.request({
              url: 'https://api.map.baidu.com/geosearch/v3/nearby?ak=' + ak + '&geotable_id=' + geotable_id + '&location=' + ott.location.lng + ',' + ott.location.lat + '&radius=3000',
              success: (res) => {
                var arr = []
                res.data.contents.forEach(item => {
                  arr.push(item.shop_id)
                })
                that.data.shop_id = arr.join(',')
                if (that.data.shop_id === '') {
                  wx.showModal({
                    content: '您所选的地址周边无可配送门店，请换个地址试试吧！',
                    showCancel: false,
                    confirmText:"#E60012"
                  })
                }
              },
            });
            that.setData({
              province: ott.addressComponent.province,
              city: ott.addressComponent.city,
              district: ott.addressComponent.district,
              longitude: map_position.lng,
              latitude: map_position.lat,
              map_address: address,
              detailAdd: ott.addressComponent.province + ott.addressComponent.city + ott.addressComponent.district + ott.addressComponent.street + ott.addressComponent.streetNumber
            })
          }
        })
      },
      fail() {
        that.setData({
          address: '定位失败'
        })
      },
    })
  },
  // 地址详情
  getInfo(id) {
    var data = {
      _sid: this.data._sid,
      address_id: id
    }
    addressinfo(data).then(res => {
      var lbsArr = res.data.user_address_lbs_baidu.split(',')
      var data = res.data
      this.setData({
        sex: data.user_address_sex,
        name: data.user_address_name, // 收货人姓名
        phone: data.user_address_phone, // 手机号
        map_address: data.user_address_map_addr, // 定位地址
        address: data.user_address_detail_address, // 收货地址
        detailAdd: data.user_address_detail_address,
        province: data.province, // 省
        city: data.city, // 市
        district: data.district, // 区
        longitude: lbsArr[0], // 经度
        latitude: lbsArr[1], // 纬度
        shop_id: '', // 门店
        addressdetail: data.user_address_address, // 地址详情
        curLabel: data.tag
      })
    })
  },
  // 选择地址
  chooseLocation() {
    var that = this
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        var resadd = res.address
        var map_address = res.name ? res.name : res.address
        let map_position = bd_encrypt(res.longitude, res.latitude);
        console.log(res, '选择')
        wx.request({
          url: 'https://api.map.baidu.com/geocoder/v2/?ak=' + ak + '&location=' + res.latitude + ',' + res.longitude + '&output=json&coordtype=wgs84ll',
          success: (res) => {
            that.setData({
              province: res.data.result.addressComponent.province,
              city: res.data.result.addressComponent.city,
              district: res.data.result.addressComponent.district,
              detailAdd: res.data.result.addressComponent.province + res.data.result.addressComponent.city + res.data.result.addressComponent.district + resadd
            })
          },
        });
        wx.request({
          url: 'https://api.map.baidu.com/geosearch/v3/nearby?ak=' + ak + '&geotable_id=' + geotable_id + '&location=' + res.longitude + ',' + res.latitude + '&radius=3000',
          success: (res) => {
            var arr = []
            res.data.contents.forEach(item => {
              arr.push(item.shop_id)
            })
            that.data.shop_id = arr.join(',')
            if (that.data.shop_id === '') {
              wx.showModal({
                content: '您所选的地址周边无可配送门店，请换个地址试试吧！',
                showCancel: false,
                confirmText: "#E60012"
              })
            }
          },
        });
        that.setData({
          longitude: map_position.lng,
          latitude: map_position.lat,
          map_address: map_address
        })
      },
      fail(err) {
        console.log(err, '错误')
      }
    });
  },
  getAddressList() {
    let [curProvince, curCity, curCountry] = this.data.defaultAddress;
    let provinceList = region.map(({
      addrid,
      name
    }) => ({
      addrid,
      name
    }))
    let cityList = region[curProvince].sub
    let countryList = cityList[curCity].sub

    this.setData({
      provinceList,
      cityList,
      countryList
    })
  },

  changeAddress(e) {
    let [curProvince, curCity, curCountry] = this.data.defaultAddress;
    let cur = e.detail.value
    if (cur[0] != curProvince) {
      cur = [cur[0], 0, 0]
    }

    if (cur[1] != curCity) {
      cur = [cur[0], cur[1], 0]
    }

    this.setData({
        defaultAddress: cur,
        address: region[cur[0]].name + ' ' +
          region[cur[0]].sub[cur[1]].name + ' ' +
          ((region[cur[0]].sub[cur[1]].sub[cur[2]] && region[cur[0]].sub[cur[1]].sub[cur[2]].name) || ' ')
      },
      () => this.getAddressList()
    )
  },

  showSelectAddress() {
    this.setData({
      selectAddress: true
    })
  },

  hideSelectAddress() {
    this.setData({
      selectAddress: false
    })
  },

  // 地址
  changeSex() {
    const {
      sex
    } = this.data;
    this.setData({
      sex: sex === 0 ? 1 : 0
    })
  },

  changeCur(e) {
    let curLabel = e.currentTarget.dataset.type
    this.setData({
      curLabel
    })
  },

  handelChange(e) {
    let {
      key
    } = e.currentTarget.dataset;
    let s = /^[a-zA-Z0-9_\u4e00-\u9fa5]{0,20}$/
    let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
    let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    let patrn = /[`…~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；……‘’，。￣、…＠＃％＾＆×＿＋｛｝｜＂＞＜]/im;
    // let value = e.detail.value.trim().replace(regEn, '').replace(regCn, '').replace(patrn,'')
    let value = e.detail.value.trim()
    if (!s.test(value)) {
      return value = this.data[key]
    }
    this.setData({
      [key]: value
    })
  },
  closeFN() {
    this.setData({
      addressdetail: ''
    })
  },
  modalidShoFN() {
    // this.setData({
    //   modalidShow: false
    // })
  },
  Addaddress() {
    var that = this
    if (this.data.name === '') {
      wx.showToast({
        icon: 'none',
        content: '请输入联系人',
        duration: 1000
      });
      return
    }
    if (/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im.test(this.data.name)) {
      wx.showToast({
        icon: 'none',
        content: '联系人包含非法字符',
        duration: 1000
      });
      return
    }
    if (/^1\d{10}$/.test(this.data.phone)) {} else if (this.data.phone === '') {
      wx.showToast({
        icon: 'none',
        content: '请填写电话',
        duration: 1000
      });
      return
    } else {
      wx.showToast({
        icon: 'none',
        content: '请输入正确手机号',
        duration: 1000
      });
      return
    }
    if (this.data.addressdetail.replace(/\s+/g, "") == '') {
      wx.showToast({
        icon: 'none',
        content: '请输入门牌号',
        duration: 1000
      });
      return
    }
    if (this.data.clickadd) {
      return
    }
    this.setData({
      clickadd: true
    })
    if (this.data.addressId) {
      var data = {
        _sid: this.data._sid,
        address_id: this.data.addressId,
        sex: this.data.sex,
        name: this.data.name.trim(), // 收货人姓名
        phone: this.data.phone, // 手机号
        map_address: this.data.map_address, // 定位地址
        address: this.data.addressdetail, // 收货地址
        province: this.data.province, // 省
        city: this.data.city, // 市
        district: this.data.district, // 区
        longitude: this.data.longitude, // 经度
        latitude: this.data.latitude, // 纬度
        detail_address: this.data.detailAdd, // 地址详情
        check_edit: false,
        tag: this.data.curLabel, // 地址标签
      }
      updateaddress(data).then(res => {
        that.setData({
          clickadd: false
        })
        if (res.code == 0) {
          wx.navigateBack({
            url: '/package_my/pages/myaddress/myaddress'
          });
        } else {
          wx.showToast({
            icon: 'none',
            content: res.msg,
            duration: 1000
          });
        }
      })
    } else {
      // 添加
      var data = {
        _sid: this.data._sid,
        sex: this.data.sex,
        name: this.data.name, // 收货人姓名
        phone: this.data.phone, // 手机号
        map_address: this.data.map_address, // 定位地址
        detail_address: this.data.detailAdd, // 地址详情
        province: this.data.province, // 省
        city: this.data.city, // 市
        district: this.data.district, // 区
        longitude: this.data.longitude, // 经度
        latitude: this.data.latitude, // 纬度
        shop_id: this.data.shop_id, // 门店
        address: this.data.addressdetail, // 收货地址
        tag: this.data.curLabel, // 地址标签
      }
      addressCreate(data).then(res => {
        that.setData({
          clickadd: false
        })
        if (res.code == 0) {
          if (this.data.order == 1) {
            wx.navigateBack({
              url: '/pages/home/orderform/selectaddress/selectaddress'
            })
          } else {
            wx.navigateBack({
              url: '/package_my/pages/myaddress/myaddress'
            });
          }
        } else {
          wx.showToast({
            icon: 'none',
            content: res.msg,
            duration: 1000
          });
        }
      })
    }
  },
  // 删除地址
  modalShowFN() {
    // this.setData({
    //   modalShow: true
    // })
    wx.showModal({
      content: '是否删除该配送地址?',
      confirmText: "#E60012"
    })
  },
  modalhideFN() {
    this.setData({
      modalShow: false
    })
  },

  rmaddress() {
    var data = {
      _sid: this.data._sid,
      address_id: this.data.addressId
    }
    deleteaddress(data).then(res => {
      if (res.code == 0) {
        this.setData({
          modalShow: false
        })
        wx.navigateBack({
          url: '/package_my/pages/myaddress/myaddress'
        });
      } else {
        wx.showToast({
          icon: 'none',
          content: res.msg
        });
      }
    })
  },
})