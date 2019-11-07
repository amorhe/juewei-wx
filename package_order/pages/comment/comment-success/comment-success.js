// package_order/pages/comment/comment-success/comment-success.js

import { imageUrl } from "../../../../pages/common/js/baseUrl";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  sw() {
    wx.reLaunch({
      url: "/pages/home/goodslist/goodslist" // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
    });
  }
});
