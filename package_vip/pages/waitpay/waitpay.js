// package_vip/pages/waitpay/waitpay.js
import { imageUrl, imageUrl2, wxGet } from '../../../pages/common/js/baseUrl'
import { ajax } from '../../../pages/common/js/li-ajax'
import Request from "../../../pages/common/js/li-ajax";
import { getRegion, log } from "../../../pages/common/js/utils";
import getDistance from '../../../pages/common/js/getdistance'
import { redirectTo } from "../../../pages/common/js/router";

let region = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    a: 0,
    imageUrl,
    imageUrl2,

    // 地址
    user_address_name: '',

    sex: 0,

    user_address_phone: '',

    address: '',

    shop_id: '',

    shop_name: '',

    selectShop: false,

    selectAddress: false,

    user_address_map_addr: '',

    addressList: region,
    provinceList: [],
    cityList: [],
    countryList: [],
    defaultAddress: [0, 0, 0],

    shopList: [],
    user_address_id: '',
    user_address_detail_address: '',
    user_address_address: '',
    province: '',
    city: '',
    district: '',

    _shopList: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(e) {
    console.log(e);
    let { order_sn, shop_id, shop_name, user_address_map_addr, user_address_id, user_address_name, user_address_phone, province, city, district, user_address_detail_address, user_address_address }
      = e;
    this.setData({
      shop_id,
      shop_name: shop_name === 'null' ? "" : shop_name,
      order_sn,
      user_address_map_addr,
      user_address_name,
      user_address_phone,
      user_address_detail_address,
      user_address_address,
      province, city, district,
      user_address_id
    });
    region = await getRegion();
    this.getAddressList();
    this.eventReduceTime()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    const { order_sn } = this.data;
    await this.getOrderInfo(order_sn)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.a);
    this.setData({ a: -1 })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.a);
    this.setData({ a: -1 });
    this.setData = () => {
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * @function 添加地址
   */
  toAddAddress() {
    const { order_sn } = this.data;
    wx.navigateTo({
      url: '/package_my/pages/myaddress/myaddress?order_sn=' + order_sn
    });
  },

  /**
   * @function 获取公众号支付前订单详情
   */
  async getOrderInfo(order_sn) {
    let { showSelectAddress, a } = this.data;
    let {
      code, data: {
        order_sn: _order_sn, limit_pay_minute, limit_pay_second, province, city, user_address_id, district, ...rest
      }
    } = await Request.reqOrderInfo({ order_sn });
    if (code === 100) {
      this.setData({
        d: { _order_sn, limit_pay_minute, limit_pay_second, ...rest },
        province: province || this.data.province,
        city: city || this.data.city,
        district: district || this.data.district,
        address: (province || '') + ' ' + (city || '') + ' ' + (district || ''),
        user_address_id: user_address_id || this.data.user_address_id
      });
    }
  },

  /**
   * @function 递归时间
   */

  eventReduceTime() {
    let { d } = this.data;
    let { limit_pay_second, limit_pay_minute } = d || {};
    --limit_pay_second;
    if (limit_pay_minute === 0 && limit_pay_second == 0) {
      return wx.navigateBack({
        delta: 1
      });
    }
    if (limit_pay_second <= 0) {
      --limit_pay_minute;
      limit_pay_second = 59
    }

    this.setData({
      'd.limit_pay_minute': limit_pay_minute,
      'd.limit_pay_second': limit_pay_second
    });

    setTimeout(() => {
      this.eventReduceTime();
    }, 1000)
  },

  /**
   * @function 获取当前省市区列表
   */
  getAddressList() {
    let [curProvince, curCity, curCountry] = this.data.defaultAddress;
    let provinceList = region.map(({ addrid, name }) => ({ addrid, name }));
    let cityList = region[curProvince].sub;
    let countryList = cityList[curCity].sub;

    this.setData({
      provinceList,
      cityList,
      countryList
    })
  },

  /**
   * @function 修改地址
   */
  changeAddress(e) {
    let [curProvince, curCity, curCountry] = this.data.defaultAddress;
    let cur;
    if (e) {
      cur = e.detail.value
    } else {
      cur = this.data.defaultAddress
    }
    if (cur[0] != curProvince) {
      cur = [cur[0], 0, 0]
    }

    if (cur[1] != curCity) {
      cur = [cur[0], cur[1], 0]
    }

    let province = region[cur[0]].name;
    let city = region[cur[0]].sub[cur[1]].name;
    let district = (region[cur[0]].sub[cur[1]].sub[cur[2]] && region[cur[0]].sub[cur[1]].sub[cur[2]].name) || '';

    this.setData({
        defaultAddress: cur,
        address: province + ' ' + city + ' ' + district,
        province,
        city,
        district
      },
      () => this.getAddressList()
    )
  },

  /**
   * @function 展示地址选择列表
   */
  showSelectAddress() {
    this.setData({ selectAddress: true })
  },

  /**
   * @function 隐藏地址选择列表，并确认改变
   */
  hideSelectAddress() {
    this.changeAddress();
    this.setData({ selectAddress: false })
  },

  /**
   * @function input表单收集数据
   */
  handelChange(e) {
    let { key } = e.currentTarget.dataset;
    let { value } = e.detail;
    this.setData({ [key]: value })
  },

  /**
   * @function 搜索
   */

  search(e) {
    const { _shopList } = this.data;
    const { value } = e.detail;
    let shopList = _shopList.filter(({ shop_name }) => shop_name.includes(value));
    this.setData({
      shopList
    })
  },
  /**
   * @function 获取当前的商店列表，排序并展示
   */
  async doSelectShop() {
    let { address } = this.data;
    if (!address) {
      return wx.showToast({
        icon: "none",
        title: '请先选择领取城市'
      });
    }
    let [curProvince, curCity, curCountry] = this.data.defaultAddress;
    let province = region[curProvince].addrid;
    let city = region[curProvince].sub[curCity].addrid;
    let district = (region[curProvince].sub[curCity].sub[curCountry] && region[curProvince].sub[curCity].sub[curCountry].addrid) || 0;
    let parentid = province + ',' + city + ',' + district;
    log(parentid);
    let res = await Request.reqGameShop({ parentid });
    let lat = wxGet('lat');
    let lng = wxGet('lng');
    console.log(lat, lng);
    if (res.CODE == 'A100') {
      let shopList = res.DATA
        .map(({ shop_gd_latitude, shop_gd_longitude, ...rest }) => {
          let distance = getDistance(lng, lat, shop_gd_longitude, shop_gd_latitude).toFixed(0);
          return {
            _distance: distance,
            distance: distance > 1000 ? (distance / 1000).toFixed(1) + '千' : distance,
            ...rest
          }
        })
        .sort((a, b) => a._distance - b._distance);
      this.setData({
        selectShop: true,
        shopList,
        _shopList: shopList
      })
    }
  },

  /**
   * @function 选择商店并返回
   */
  sureSelectShop(e) {
    let { shop_id, shop_name } = e.currentTarget.dataset;

    this.setData({
      shop_id,
      shop_name,
      selectShop: false
    })
  },


  /**
   * @function 确认订单
   */
  async confirmOrder() {
    let { d, order_sn, user_address_id, province, city, district, user_address_phone, shop_id, shop_name, user_address_name } = this.data;

    // 如果商品是实物并且发货方式到店领取

    if (d.receive_type == 1) {
      let params = {
        order_sn,
        user_address_name,
        user_address_phone,
        province, city, district,
        shop_id,
        shop_name,
      };
      let { code, msg } = await Request.reqConfirmOrder(params);
      if (code !== 100) {
        wx.showToast({
          icon: "none",
          title: msg
        });
      }
      return code === 100
    }

    // 邮递

    if (d.receive_type == 2) {
      let params = {
        order_sn,
        user_address_name,
        user_address_phone,
        user_address_id,
        province, city, district,
      };
      let { code, msg } = await Request.reqConfirmOrder(params);
      if (code !== 100) {
        wx.showToast({
          icon: "none",
          title: msg
        });
      }
      return code === 100
    }


  },

  /**
   * @function 支付订单
   */
  async pay() {
    let { order_sn } = this.data;
    return await Request.reqPay({ order_no: order_sn })
  },

  /**
   * @function 马上支付
   */
  async payNow() {
    let { d, order_sn, user_address_id, province, city, district, user_address_phone, shop_id, shop_name, user_address_name } = this.data;

    if (d.receive_type == 1) {
      if (!order_sn ||
        !user_address_name ||
        !user_address_phone ||
        !province ||
        !city ||
        !district ||
        !shop_id ||
        !shop_name
      ) {
        return
      }
    }


    if (d.receive_type == 2) {
      if (!order_sn ||
        !user_address_name ||
        !user_address_phone ||
        !province ||
        !city ||
        !district
      ) {
        return
      }
    }


    let confirm = await this.confirmOrder();
    log(confirm);
    if (!confirm) {
      return
    }


    if (d.order_total_amount == 0) {
      return wx.redirectTo({
        url: '../finish/finish?id=' + d.id + '&fail=' + false
      });
    }

    let r = await this.pay();
    log(r.data.tradeNo);
    if (r.code === 0) {
      wx.requestPayment({
        ...r.data,
        success: res => {
          return wx.redirectTo({
            url: '../finish/finish?id=' + d.id + '&fail=' + false
          });
        },
        fail: conf => {
          log('fail');
          if (conf.errMsg.indexOf('cancel') != -1) {
            // 取消支付
            return wx.redirectTo({
              url: '../exchangelist/exchangedetail/exchangedetail?id=' + d.id
            });
          } else {
            return wx.redirectTo({
              url: '../finish/finish?id=' + d.id + '&fail=' + true
            });
          }

        }
      });
    }
  },

  /**
   * @function 键盘失去焦点
   */
  blur(e) {
    log(e, this)
  }

});
