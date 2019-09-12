// package_vip/pages/detail/detail.js

import { isloginFn, log } from '../../../pages/common/js/utils'
import { imageUrl2 } from '../../../pages/common/js/baseUrl'
import { upformId } from '../../../pages/common/js/time'
import Request from "../../../pages/common/js/li-ajax";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalOpened: false,
    imageUrl2,
    openPoint: false,
    loginOpened: false,
    content: '',
    detail: {},
    isClick: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(e) {
    const { id } = e;
    this.setData({ id })
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
    const { id } = this.data;
    await this.getDetail(id)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.onModalClose()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
  //fixme
  parseData(e){
    console.log(1);
  },
  /**
   * @function 获取当商品面详情
   */
  async getDetail(id) {
    let { code, data: { goods_name, exchange_intro, intro, ...Data } } = await Request.reqDetail(id);
    if (code === 100) {
      let _exchange_intro = await this.parseData(exchange_intro);
      let _intro = await this.parseData(intro);
      my.setNavigationBar({
        title: '商品详情',
      });
      this.setData({
        detail: {
          intro,
          _intro,
          exchange_intro,
          _exchange_intro,
          goods_name,
          ...Data
        }
      })
    }
  },

  /**
   * @function 创建订单
   */
  async createOrder() {
    let { id, exchange_type, point, amount } = this.data.detail;

    let params = {
      'goods[goods_id]': id,
      'goods[exchange_type]': exchange_type,
      'goods[point]': point,
      'goods[amount]': amount,
      'pay_type': 11
    };
    let { code, data, msg } = await reqCreateOrder(params);
    if (code === 100) {
      return data
    }
    if (code !== 100) {
      my.alert({ title: msg });
      return {}
    }
  },

  /**
   * @function 确认订单
   */

  async confirmOrder(order_sn) {
    let params = { order_sn };
    let { code, data } = await reqConfirmOrder(params);
    return code === 100
  },

  /**
   * @function 支付订单
   */
  async pay(order_sn) {
    let { code, data } = await reqPay(order_sn);
    return { code, data }
  },

  /**
   *@function 确认兑换
   */

  async onModalClick() {
    let that = this;
    // goods_type	是	int	订单类型 1 虚拟订单 2 实物订单
    // receive_type	是	int	发货方式 0 无需发货 1 到店领取 2公司邮寄
    // goods_detail_type	是	int	物品详细类型 1 优惠券 2兑换码 3官方商品 4非官方商品
    const { goods_detail_type, receive_type, goods_type, amount } = this.data.detail;
    let fail = false;
    // 虚拟商品，点击兑换按钮，调用创建订单接口，
    // 有钱的订单或者有运费的订单才调起支付
    // 调用确认订单接口，然后调起支付
    // id = -1 兑换失败
    // 虚拟物品
    if (!this.data.isClick) {
      return
    }
    this.setData({
      isClick: false
    });
    //虚拟商品
    if (goods_type == 1) {
      let { order_id = '', order_sn } = await this.createOrder();
      if (!order_id) {
        this.setData({
          isClick: true
        });
        return
      }
      let res = await this.confirmOrder(order_sn);
      if (amount != 0) {

        let res = await this.pay(order_sn);
        console.log('amount', res);
        if (res.code == 0) {
          my.tradePay({
            tradeNO: res.data.tradeNo, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
            success: res => {
              // 用户支付成功
              if (res.resultCode == 9000) {
                return my.redirectTo({
                  url: '../finish/finish?id=' + order_id + '&fail=' + false
                });
              }
              // 用户取消支付
              if (res.resultCode == 6001) {
                return my.redirectTo({
                  url: '../exchangelist/exchangedetail/exchangedetail?id=' + order_id
                });
              }
              return my.redirectTo({
                url: '../finish/finish?id=' + order_id + '&fail=' + true
              });

            },
            fail: res => {
              log('fail');
              return my.redirectTo({
                url: '../finish/finish?id=' + order_id + '&fail=' + true
              });
            }
          });
        } else {
          that.setData({
            isClick: true
          });
          return my.showToast({ content: res.msg });
        }
        return
      }

      if (!res) {
        fail = true
      }
      this.setData({
        isClick: true
      });
      // 虚拟订单 + 兑换码 => 无需发货
      //
      if (goods_detail_type == 2 && receive_type == 0) {
        my.navigateTo({
          url: '../finish/finish?id=' + order_id + '&fail=' + fail
        });
      }
      // 虚拟订单 + 优惠卷 => 无需发货
      // 跑通
      if (goods_detail_type == 1 && receive_type == 0) {
        my.navigateTo({
          url: '../finish/finish?id=' + order_id + '&fail=' + fail
        });
      }
    }

    // 实物商品，
    // 点击兑换按钮，
    // 调用创建订单接口，
    // 填写页面表单信息，
    // 然后点击支付按钮，
    // 调用确认订单接口，
    // 然后调起支付
    if (goods_type == 2) {
      let res = await this.createOrder();
      this.setData({
        isClick: true
      });
      if (!res.order_sn) {
        return
      }
      // 实物订单  公司邮寄

      if (receive_type == 2) {
        my.navigateTo({
          url: '../waitpay/waitpay?order_sn=' + res.order_sn
        });
      }
      // 实物订单  到店领取
      if (receive_type == 1) {
        my.navigateTo({
          url: '../waitpay/waitpay?order_sn=' + res.order_sn
        });
      }
    }
  },

  /**
   * @function 显示modal，立即兑换
   */

  async showConfirm() {
    let _sid = await getSid();
    if (!_sid) {
      // return this.setData({
      //   loginOpened: true
      // });
      return isloginFn()
    }

    let { goods_name, point } = this.data.detail;

    // 获取 用户 积分
    let points = await this.getUserPoint();

    if (points >= point) {
      this.setData({
        content: `是否兑换“${ goods_name }”将消耗你的${ point }积分`,
        modalOpened: true
      })
    } else {
      this.setData({
        openPoint: true
      })
    }
  },


  /**
   * @function 关闭modal
   */
  onModalClose() {
    this.setData({
      openPoint: false,
      modalOpened: false,
      loginOpened: false
    })
  },

  /**
   * @function 赚积分
   */
  async getMorePoint() {
    this.onModalClose();
    my.switchTab({
      url: '/pages/home/goodslist/goodslist'
    });
  },


  /**
   * @function 获取用户积分
   */
  async getUserPoint() {
    let res = await reqUserPoint();
    if (res.CODE === 'A100') {
      return res.DATA.points
    }
  },
  onSubmit(e) {
    upformId(e.detail.formId);
  },

  isloginFn

});

// <!--未登录提示 -->
// <modal show="{{loginOpened}}" showClose="{{ false }}">
//   <view class="modalInfo">
//   用户未登录
//   </view>
//   <view slot="footer" class="footerButton">
//   <view class="modalButton confirm " onTap="onModalClose">取消</view>
//   <view class="modalButton cancel " onTap="isloginFn">登录</view>
//   </view>
//   </modal>
//   <!-- 消耗积分提示 -->
//   <modal show="{{modalOpened}}" showClose="{{ false }}">
//   <view class="modalInfo">
//   {{content}}
// </view>
// <view slot="footer" class="footerButton">
//   <view class="modalButton confirm " onTap="onModalClose">取消</view>
//   <view class="modalButton cancel " onTap="onModalClick">确定</view>
//   </view>
//   </modal>
//   <!-- 当前积分不足 -->
//   <modal show="{{openPoint}}" showClose="{{ false }}">
//   <view class="modalInfo">
//   您的当前积分不足
//   </view>
//   <view slot="footer" class="footerButton">
//   <view class="modalButton confirm " onTap="onModalClose">取消</view>
//   <view class="modalButton cancel " onTap="getMorePoint">赚积分</view>
//   </view>
//   </modal>