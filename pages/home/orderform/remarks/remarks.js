var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remarks: '',
    noteNowLen: 0,
    noteMaxLen: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.remarks) {
      this.setData({
        remarks: app.globalData.remarks
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
  inputRemarks(e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    this.setData({
      remarks: e.detail.value,
      noteNowLen: len
    })
  },
  eveRemarksBtn() {
    app.globalData.remarks = this.data.remarks;
    wx.navigateBack({
      url: '/pages/home/orderform/orderform'
    });
  }
})