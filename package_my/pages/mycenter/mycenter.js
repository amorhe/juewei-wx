import {
  imageUrl,
  wxGet,
  wxSet
} from '../../../pages/common/js/baseUrl'
import {
  getRegion,
  MODAL
} from '../../../pages/common/js/utils'
import {
  UpdateAliUserInfo,
  UpdateUserInfo
} from '../../../pages/common/js/my'
import {
  getuserInfo,
  LoginOut
} from '../../../pages/common/js/login'
import {
  navigateTo,
  redirectTo,
  reLaunch
} from '../../../pages/common/js/router.js'
import {
  getNowFormatDate
} from '../../../pages/common/js/time.js'
const {
  $Toast
} = require('../../../iview-weapp/base/index');
var app = getApp();
let region = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    showTop: false,
    modalOpened: false,
    head_img: '', // 头像
    nick_name: '', // 名字
    userinfo: '', // 用户信息
    sex: 0,
    // 地址
    name: '',
    phone: '',
    address: '',
    labelList: ['学校', '家', '公司'],
    curLabel: 0,
    selectAddress: false,
    addressList: region,
    provinceList: [],
    cityList: [],
    countryList: [],
    province_i: 0,
    city_i: 0,
    region_i: 0,
    defaultAddress: [0, 0, 0],
    sex_array: ['女', '男'],
    nowDate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    if (e.img && e.name) {
      this.getInfo(e.img, e.name)
    }
    this.setData({
      nowDate: getNowFormatDate()
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
  async onShow() {
    region = await getRegion();
    this.funGetUserInfo()
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
  // 用户信息
  funGetUserInfo() {
    var that = this;
    var _sid = wxGet('_sid');

    getuserInfo(_sid).then((res) => {
      var province_i = 0,
        city_i = 0,
        region_i = 0;
      var province = region.filter((item, index) => {
        if (item.addrid == res.data.province_id) {
          province_i = index
        }
        return item.addrid == res.data.province_id
      })[0];
      if (province) {
        var city = province.sub.filter((item, index) => {
          if (item.addrid == res.data.city_id) {
            city_i = index
          }
          return item.addrid == res.data.city_id
        })[0]
        res.data.provinceName = province.name || '';
      }
      if (city) {
        var regions = city.sub.filter((item, index) => {
          if (item.addrid == res.data.region_id) {
            region_i = index
          }
          return item.addrid == res.data.region_id
        })[0]
        res.data.cityName = city.name || '';
      }
      if (regions) {
        res.data.regionName = regions.name || '';
      }
      that.setData({
        userinfo: res.data,
        province_i,
        city_i,
        region_i,
        defaultAddress: [province_i, city_i, region_i]
      }, () => {
        that.getAddressList()
      })
    })
  },
  // 选择性别
  genderFN(data) {
    const that = this;
    // var data = e.detail.value;
    var sex = data == 1 ? 0 : 1;
    UpdateUserInfo({
      sex,
      _sid: wxGet('_sid')
    }).then(res => {
      that.setData({
        'userinfo.sex': sex
      })
    })
  },
  // 保存用户信息
  saveUserInfo(data) {
    var data = {
      sex: data.sex || '',
      birthday: data.birthday || '',
      province_id: data.province_id || '',
      city_id: data.city_id || '',
      region_id: data.region_id || '',
      _sid: wxGet('_sid')
    };
    UpdateUserInfo(data).then((res) => {
      console.log(res, '用户保存')
    })
  },
  // 生日选择器
  Taptime(e) {
    var that = this;
    UpdateUserInfo({
      birthday: e.detail.value,
      _sid: wxGet('_sid')
    }).then(res => {
      if(res.code == 0){
        that.setData({
          'userinfo.birthday': e.detail.value
        })
      }else{
        $Toast({
          content: res.msg
        })
      }
    })
  },

  getAddressList() {
    let [curProvince, curCity, curCountry] = this.data.defaultAddress;
    let provinceList = region.map(({
      addrid,
      name
    }) => ({
      addrid,
      name
    }));
    let cityList = region[curProvince].sub;
    let countryList = cityList[curCity].sub;
    this.setData({
      provinceList,
      cityList,
      countryList
    })
  },
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

  showSelectAddress() {
    this.setData({
      selectAddress: true
    })
  },
  hideSelectAddress() {
    var that = this;

    var province = that.data.provinceList[that.data.defaultAddress[0]];
    var curCity = that.data.cityList[that.data.defaultAddress[1]];
    var region = that.data.countryList[that.data.defaultAddress[2]];
    var data = {
      province_id: province.addrid,
      city_id: curCity.addrid,
      region_id: region.addrid,
      _sid: wxGet('_sid')
    };

    UpdateUserInfo(data).then(res => {
      that.setData({
        'userinfo.province_id': province.addrid,
        'userinfo.city_id': curCity.addrid,
        'userinfo.region_id': region.addrid,
        'userinfo.provinceName': province.name,
        'userinfo.cityName': curCity.name,
        'userinfo.regionName': region.name,
        selectAddress: false,
      }, () => that.changeAddress())
    })
  },

  // 地址
  changeCur(e) {
    let curLabel = e.currentTarget.dataset.cur;
    if (curLabel === this.data.curLabel) curLabel = '-1';
    this.setData({
      curLabel
    })
  },

  handelChange(e) {
    let {
      key
    } = e.currentTarget.dataset;
    let {
      value
    } = e.detail;
    this.setData({
      [key]: value
    })
  },
  // 姓别选择器显示/隐藏
  onTopBtnTap() {
    this.setData({
      showTop: true,
    });
  },
  onPopupClose() {
    this.setData({
      showTop: false,
    });
  },
  // 退出登录
  outLogin() {
    MODAL({
      title: '退出登录',
      content: '是否确定退出登录',
      confirmText: '确认',
      confirm: this.onModalClick,
      cancelText: '取消',
      cancel: this.onModalClose
    })
  },
  onModalClick() { // 确认
    var _sid = wxGet('_sid');
    LoginOut(_sid).then(res => {
      console.log(res);
      if (res.code == 0) {
        wxSet('_sid', '');
        wxSet('userInfo', {});
        wx.removeStorageSync('user_id');
        app.globalData._sid = "";
        reLaunch({
          url: "/pages/my/index/index"
        })
      } else {
        $Toast({
          content: res.msg
        })
      }
    });
    this.setData({
      modalOpened: false,
    });
  },
  onModalClose() { // 取消
    this.setData({
      modalOpened: false,
    });
  },
  //页面跳转
  toUrl(e) {
    var url = e.currentTarget.dataset.url;
    navigateTo({
      url: url
    });
  },
  getInfo(avatar, nickName) {
    var that = this;
    var _sid = wxGet('_sid');
    that.setData({
      'userinfo.head_img': avatar,
      'userinfo.nick_name': nickName
    });
    var data = {
      _sid: _sid,
      head_img: avatar,
      nick_name: nickName
    };
    UpdateAliUserInfo(data).then(res => {
       //这里不必成功与否
    })
  },
  chooseSex(e) {
    this.genderFN(e.currentTarget.dataset.sex);
    this.setData({
      showTop: false
    })
  },

});