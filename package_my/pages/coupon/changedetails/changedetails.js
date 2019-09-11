import {
  exchangedetail
} from '../../../../pages/common/js/home'
import {
  imageUrl2,
  wxGet
} from '../../../../pages/common/js/baseUrl'
import {
  parseData
} from '../../../../pages/common/js/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exchangeObj: {},
    imageUrl2,
    source: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    const {
      gift_code_id,
      gift_id,
      order_id,
      source
    } = e
    const _sid = wxGet('_sid');
    this.funGetDetail({
      _sid,
      gift_code_id,
      gift_id,
      order_id
    });
    this.setData({
      source
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
  funGetDetail({
    _sid,
    gift_code_id,
    gift_id,
    order_id
  }) {
    exchangedetail(_sid, gift_code_id, gift_id, order_id).then(async(res) => {
      if (res.CODE == 'A100') {
        res.DATA.gift_application_store = await parseData(res.DATA.gift_application_store);
        res.DATA.gift_desciption = await parseData(res.DATA.gift_desciption);
        res.DATA.gift_exchange_process = await parseData(res.DATA.gift_exchange_process)
        res.DATA.gift_service_telephone = await parseData(res.DATA.gift_service_telephone)

        this.setData({
          exchangeObj: res.DATA
        })
      }
    })
  },
  // 复制
  eveHandleCopy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.code,
      success() {
        wx.showToast({
          icon: 'success',
          content: '操作成功'
        });
      }
    });
  },
})