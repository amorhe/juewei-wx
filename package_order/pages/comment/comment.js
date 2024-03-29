// package_order/pages/comment/comment.js

import {
  baseUrl,
  imageUrl,
  imageUrl2
} from '../../../pages/common/js/baseUrl'
import Request from "../../../pages/common/js/li-ajax";
import {
  log
} from "../../../pages/common/js/utils";
const {
  $Toast
} = require('../../../iview-weapp/base/index');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    imageUrl2,
    shopStars: [true, false, false, false, false],

    com: {},

    shopTabs: [],

    order_on: '',
    dis_tag: 1,
    dis_level: '',
    dis_content: '',
    goods_comment: [],
    plate: 0,

    d: {},

    currentShopSelect: []
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(e) {
    const {
      order_no
    } = e;
    await this.getCommentTag();
    await this.getOrderDetail(order_no);
    this.setData({
      order_no
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

  /**
   * @function 展开产品
   */
  openList(e) {
    const {
      d
    } = this.data;
    const {
      i
    } = e.currentTarget.dataset;
    d.goods_list[i].open = true;
    this.setData({
      d
    })
  },

  /**
   * @function 获取评价数据
   */

  async getCommentTag() {
    let res = await Request.commentTag();
    if (res.code === 0) {
      this.setData({
        com: res.data,
        shopTabs: res.data.dis.low
      })
    }
  },

  /**
   * @function 获取订单详情
   */
  async getOrderDetail(order_no) {
    const {
      com
    } = this.data;
    let res = await Request.orderDetail({
      order_no
    });
    if (res.code) {
      return
    }

    let goods_list = res.data.goods_list.map(item => ({
      ...item,
      open: false,
      goods_comment: {
        goods_code: "A1QLT26",
        level: 1,
        goodStar: [true, false, false, false, false],
        tag: "2",
        tags: [],
        _tags: com.goods.low,
        content: "",
        img: "",
        pics: [],
      },
    }));
    goods_list[0].open = true;
    res.data.goods_list = goods_list;
    if (res.code === 0) {
      this.setData({
        d: res.data
      })
    }
  },


  /**
   * @function 修改商店评分
   */
  changeShopStar(e) {
    const {
      index
    } = e.currentTarget.dataset;
    let {
      shopStars,
      com
    } = this.data;
    let stars = index + 1;
    // 修改星星
    shopStars.fill(true, 0, stars);
    shopStars.fill(false, stars, 5);

    // 修改标签
    let shopTabs;
    switch (stars) {
      case 1:
      case 2:
        shopTabs = com.dis.low;
        break;
      case 3:
        shopTabs = com.dis.mid;
        break;
      case 4:
      case 5:
        shopTabs = com.dis.good;
        break
    }

    this.setData({
      shopStars,
      shopTabs,
      dis_level: stars,
      currentShopSelect: []
    })
  },

  /**
   * @function 修改菜品评分
   */
  changeGoodsComment(e) {
    let {
      d,
      com
    } = this.data;
    let {
      goods_list
    } = d;
    const {
      index,
      i
    } = e.currentTarget.dataset;
    let {
      goodStar,
      level
    } = goods_list[i].goods_comment;
    let stars = index + 1;
    /* 修改星星 */
    goodStar.fill(true, 0, stars);
    goodStar.fill(false, stars, 5);
    goods_list[i].goods_comment.level = stars;

    // 修改标签
    switch (stars) {
      case 1:
      case 2:
        goods_list[i].goods_comment._tags = com.goods.low;
        break;
      case 3:
        goods_list[i].goods_comment._tags = com.goods.mid;
        break;
      case 4:
      case 5:
        goods_list[i].goods_comment._tags = com.goods.good;
        break
    }

    goods_list[i].goods_comment.tags = [];

    d.goods_list = goods_list;
    this.setData({
      d,
    })
  },


  /**
   * @function 修改商店标签
   */
  selectShopTag(e) {
    let {
      currentShopSelect
    } = this.data;
    const {
      item,
      index
    } = e.currentTarget.dataset;
    console.log(index);

    if (currentShopSelect.includes(item)) {
      currentShopSelect[index] = '';
    } else {
      currentShopSelect[index] = item;
    }

    console.log(currentShopSelect);
    this.setData({
      currentShopSelect
    })
  },


  /**
   * @function 修改商品标签
   */
  selectGoodTag(e) {

    let {
      d
    } = this.data;
    let {
      goods_list
    } = d;
    const {
      item,
      i,
      index
    } = e.currentTarget.dataset;
    let {
      tags
    } = goods_list[i].goods_comment;

    // fixMe: index 问题
    if (tags.includes(item)) {
      tags[index] = '';
    } else {
      tags[index] = item;
    }

    console.log(d);


    d.goods_list = goods_list;
    this.setData({
      d
    })

  },


  /**
   * @function 上传图片
   */
  upLoad(e) {
    const {
      i
    } = e.currentTarget.dataset;
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      count: 1,
      success: (res) => {
        wx.showLoading({
          content: '图片上传中...',
        });
        console.log(res);
        wx.uploadFile({
          url: baseUrl + '/juewei-api/comment/UploadCommentImg',
          fileType: 'image',
          name: 'imgFile',
          filePath: res.tempFilePaths[0],
          success: (result) => {
            wx.hideLoading();
            let {
              d
            } = this.data;
            let {
              goods_list
            } = d;
            let {
              pics
            } = goods_list[i].goods_comment;

            let r = JSON.parse(result.data);
            if (r.code != 0) {
              return $Toast({
                content: r.msg
              })
            }
            // let p = /\"path\"\:\"(\S*)\"\}\,/
            // log(result.data.match(p))
            // pics = [...pics, result.data.match(p)[1]]
            pics = [...pics, r.data.path];
            d.goods_list[i].goods_comment.pics = pics;
            this.setData({
              d
            })
          },
          fail: (error) => {
            wx.hideLoading();
            $Toast({
              content: '图片上传失败'
            })
          }
        });
      },
      fail: (err) => {
        log(err);
        $Toast({
          content: 'fail'
        })
      }
    })
  },

  /**
   * @function 删除评论图片
   */

  delDisPic(e) {
    const {
      i,
      pic_index
    } = e.currentTarget.dataset;
    let {
      d
    } = this.data;
    let {
      goods_list
    } = d;
    let {
      pics
    } = goods_list[i].goods_comment;

    // d.goods_list[i].goods_comment.pics =

    pics.splice(pic_index, 1);

    this.setData({
      d
    })
  },

  /**
   * @function 获取店铺评价详情
   */

  getDisContent(e) {
    const {
      value
    } = e.detail;
    this.setData({
      dis_content: value
    })
  },

  /**
   * @function 获取上坪评价详情
   */
  getGoodContent(e) {
    const {
      i
    } = e.currentTarget.dataset;
    const {
      d
    } = this.data;
    const {
      value
    } = e.detail;

    d.goods_list[i].goods_comment.content = value;
    this.setData({
      d
    })
  },

  /**
   * @function 订单评价
   */

  async doCommemt() {
    const {
      order_no,
      dis_level,
      currentShopSelect,
      dis_content,
      d
    } = this.data;
    let goods_comment = d.goods_list.map(({
      goods_code,
      goods_comment
    }) => ({
      goods_code,
      level: goods_comment.level,
      tag: goods_comment.tags.join(','),
      img: goods_comment.pics.join(','),
      content: goods_comment.content
    }));
    log(goods_comment);
    let data = {
      order_no,
      dis_tag: currentShopSelect.join(','),
      dis_level,
      dis_content,
      goods_comment: JSON.stringify(goods_comment),
      plate: 0
    };
    let res = await Request.Create(data);
    if (res.code === 0) {
      wx.redirectTo({
        url: './comment-success/comment-success', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
      });
    }
  }
});