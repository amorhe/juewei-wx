// pages/components/tab-bar.js
import { redirectTo } from "../../common/js/router";

import { wxGet, wxSet } from "../../common/js/baseUrl";

import { getCurUrl } from "../../common/js/utils";

const app = getApp();
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    cur: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    "tabBar": {
      "color": "#7F8389",
      "selectedColor": "#E60012",
      "backgroundColor": "#ffffff",
      "list": [{
        "pagePath": "/pages/home/goodslist/goodslist",
        "iconPath": "/pages/common/img/menu_home1.png",
        "selectedIconPath": "/pages/common/img/menu_home2.png",
        "text": "首页",
        "openType": "",
      },
        {
          "pagePath": "/pages/vip/index/index",
          "iconPath": "/pages/common/img/menu_vip1.png",
          "selectedIconPath": "/pages/common/img/menu_vip2.png",
          "text": "会员专享",
          "openType": "",
        },
        {
          "pagePath": "/pages/order/list/list",
          "iconPath": "/pages/common/img/menu_order1.png",
          "selectedIconPath": "/pages/common/img/menu_order2.png",
          "text": "订单",
          "openType": "",
        },
        {
          "pagePath": "/pages/my/index/index",
          "iconPath": "/pages/common/img/menu_my1.png",
          "selectedIconPath": "/pages/common/img/menu_my2.png",
          "text": "我",
          "openType": "getUserInfo",
        }
      ]
    },
    btuBottom:0
  },
  attached(){
    let isPhone = app.globalData.isIphoneX;
    if (isPhone) {
      this.setData({
        btuBottom: "48rpx",
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    buttonClick(e) {
      const {
        url
      } = e.currentTarget.dataset;
      if ('/' + getCurUrl() === url) {
        return;
      }
      redirectTo({
        url
      })
    }
  }
});
