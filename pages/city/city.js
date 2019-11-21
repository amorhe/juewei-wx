import { cities } from '../common/js/city.js';
import {
  imageUrl
} from '../common/js/baseUrl.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1, //1修改全局地址，2不修改全局地址
    cities: [],
    imageUrl,
    inputAddress:"",
    searches:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取外部传过来的值
    if (options && options.type && options.type>1){
      this.setData({
        type: options.type
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      cities: cities
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.globalData.chooseBool=false;
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
    if(this.data.type==2){
      app.globalData.choosecity2 = e.currentTarget.dataset.name;
      app.globalData.chooseBool = true;
      wx.navigateBack({
        delta: 1
      })
    }else{
      app.globalData.choosecity = e.currentTarget.dataset.name;
      app.globalData.chooseBool = true;
      wx.navigateBack({
        delta: 1
      })
    }
  } 
})