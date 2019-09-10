import {
  cities
} from '../common/js/city.js';
import {
  imageUrl
} from '../common/js/baseUrl.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cities: [],
    imageUrl,
    inputAddress:"",
    searches:[]
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
    let storeCity = new Array(26);
    const words = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    words.forEach((item, index) => {
      storeCity[index] = {
        key: item,
        list: []
      }
    })
    cities.forEach((item) => {
      let firstName = item.pinyin.substring(0, 1);
      let index = words.indexOf(firstName);
      storeCity[index].list.push({
        name: item.name,
        key: firstName
      });
    })
    this.data.cities = storeCity;
    this.setData({
      cities: this.data.cities
    })
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
  funHandleSearch(e){
    if(e.detail.value == ''){
      this.setData({
        searches:[]
      })
      return
    }
    let arr = cities.filter(item => item.name.indexOf(`${e.detail.value}`) != -1);
    this.setData({
      searches:arr
    })
  },
  eveChoosecity(e){
    app.globalData.city = e.currentTarget.dataset.name + '市';
    app.globalData.chooseBool = true;
    wx.navigateBack({
      delta:1
    })
  } 
})