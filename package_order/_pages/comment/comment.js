import { imageUrl, baseUrl, imageUrl2 } from '../../../pages/common/js/baseUrl'
import { ajax, log } from '../../../pages/common/js/li-ajax'

Page({
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
    plate: 1,

    d: {},

    currentShopSelect: []
  },
  async onLoad(e) {
    const { order_no } = e;
    await this.getCommentTag()
    await this.getOrderDetail(order_no)
    this.setData({
      order_no
    })

  },

  /**
   * @function 展开产品
   */
  openList(e) {
    const { d } = this.data;
    const { i } = e.currentTarget.dataset;
    d.goods_list[i].open = true
    this.setData({
      d
    })
  },

  /**
   * @function 获取评价数据
   */

  async getCommentTag() {
    let res = await ajax('/juewei-api/comment/CommentTag', {}, 'POST')
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
    const { com } = this.data;
    let res = await ajax('/juewei-api/order/detail', { order_no })

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
    }))
    goods_list[0].open = true
    res.data.goods_list = goods_list
    if (res.code === 0) {
      this.setData({ d: res.data })
    }
  },


  /**
   * @function 修改商店评分
   */
  changeShopStar(e) {
    const { index } = e.currentTarget.dataset
    let { shopStars, com } = this.data
    let stars = index + 1
    // 修改星星
    shopStars.fill(true, 0, stars)
    shopStars.fill(false, stars, 5)

    // 修改标签
    let shopTabs
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
    let { d, com } = this.data
    let { goods_list } = d
    const { index, i } = e.currentTarget.dataset
    let { goodStar, level } = goods_list[i].goods_comment
    let stars = index + 1
    /* 修改星星 */
    goodStar.fill(true, 0, stars)
    goodStar.fill(false, stars, 5)
    goods_list[i].goods_comment.level = stars

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

    goods_list[i].goods_comment.tags = []

    d.goods_list = goods_list
    this.setData({
      d,
    })
  },



  /**
   * @function 修改商店标签
   */
  selectShopTag(e) {
    let { currentShopSelect } = this.data;
    const { item } = e.currentTarget.dataset;

    if (currentShopSelect.includes(item)) {
      currentShopSelect.splice(currentShopSelect.findIndex(key => key === item), 1)
    } else {
      currentShopSelect.push(item)
    }

    this.setData({
      currentShopSelect
    })
  },


  /**
    * @function 修改商品标签
    */
  selectGoodTag(e) {

    let { d } = this.data
    let { goods_list } = d
    const { item, i } = e.currentTarget.dataset
    let { tags } = goods_list[i].goods_comment


    if (tags.includes(item)) {
      tags.splice(tags.findIndex(key => key === item), 1)
    } else {
      tags.push(item)
    }


    d.goods_list = goods_list
    this.setData({
      d
    })

  },



  /**
   * @function 上传图片
   */
  upLoad(e) {
    const { i } = e.currentTarget.dataset
    my.chooseImage({
      sourceType: ['camera', 'album'],
      count: 1,
      success: (res) => {
        my.showLoading({
          content: '图片上传中...',
        });
        my.uploadFile({
          url: baseUrl + '/juewei-api/comment/UploadCommentImg',
          fileType: 'image',
          fileName: 'imgFile',
          filePath: res.apFilePaths[0],
          success: (result) => {
            my.hideLoading()
            let { d } = this.data
            let { goods_list } = d
            let { pics } = goods_list[i].goods_comment
            
            let r = JSON.parse(result.data)
            if (r.code != 0) {
              return my.showToast({ content: r.msg })
            }
            // let p = /\"path\"\:\"(\S*)\"\}\,/
            // log(result.data.match(p))
            // pics = [...pics, result.data.match(p)[1]]
            pics = [...pics, r.data.path]
            d.goods_list[i].goods_comment.pics = pics
            this.setData({
              d
            })
          },
          fail: (error) => {
            my.hideLoading()
            my.showToast({
              content: '图片上传失败',
            });
          }
        });
      },
      fail: (err) => {
        log(err)
        my.showToast({
          content: 'fail',
        });
      }
    })
  },

  /**
   * @function 删除评论图片
   */

  delDisPic(e) {
    const { i, pic_index } = e.currentTarget.dataset
    let { d } = this.data
    let { goods_list } = d
    let { pics } = goods_list[i].goods_comment

    // d.goods_list[i].goods_comment.pics = 

    pics.splice(pic_index, 1)

    this.setData({
      d
    })
  },

  /**
   * @function 获取店铺评价详情
   */

  getDisContent(e) {
    const { value } = e.detail
    this.setData({
      dis_content: value
    })
  },

  /**
   * @function 获取上坪评价详情
   */
  getGoodContent(e) {
    const { i } = e.currentTarget.dataset;
    const { d } = this.data;
    const { value } = e.detail;

    d.goods_list[i].goods_comment.content = value
    this.setData({
      d
    })
  },

  /**
   * @function 订单评价
   */

  async doCommemt() {
    const { order_no, dis_level, currentShopSelect, dis_content, d } = this.data;
    let goods_comment = d.goods_list.map(({ goods_code, goods_comment }) => (
      {
        goods_code,
        level: goods_comment.level,
        tag: goods_comment.tags.join(','),
        img: goods_comment.pics.join(','),
        content: goods_comment.content
      }
    ))
    log(goods_comment)
    let data = {
      order_no,
      dis_tag: currentShopSelect.join(','),
      dis_level,
      dis_content,
      goods_comment:  JSON.stringify(goods_comment),
      plate: 1
    }
    let res = await ajax('/juewei-api/comment/Create', data, 'POST')
    if (res.code === 0) {
      my.redirectTo({
        url: './comment-success/comment-success', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
      });
    }
  }
});
