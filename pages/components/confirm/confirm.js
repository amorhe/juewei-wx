// pages/components/confirm/confirm.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isType: String,
    mask: Boolean,
    modalShow: Boolean,
    content: String,
    title: String,
    confirmButtonText: {
      type: String,
      value: ''
    },
    cancelButtonText: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    mask: false, // 遮罩
    modalShow: false, // 提示框
    content: '',
    title: '',
    confirmButtonText: '',
    cancelButtonText: ''
  },
  attached() {
    console.log(this.properties)
    if (this.properties.confirmButtonText && this.properties.cancelButtonText) {
      this.setData({
        mask: this.properties.mask,
        modalShow: this.properties.modalShow,
        content: this.properties.content,
        title: this.properties.title,
        confirmButtonText: this.properties.confirmButtonText,
        cancelButtonText: this.properties.cancelButtonText
      })
    } else {
      this.setData({
        mask: this.properties.mask,
        modalShow: this.properties.modalShow,
        content: this.properties.content,
        title: this.properties.title,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    eveConfirmTap() {
      let modalObj = {};
      let isType = ''
      if (this.properties.isType == "clearShopcart") {
        isType = 'clearShopcart'
      }
      if (this.properties.isType == "orderConfirm") {
        isType = 'orderConfirm'
      }
      if (this.properties.isType == "noShop") {
        isType = 'noShop'
      }
      modalObj = {
        modalShow: false,
        mask: false,
        type: 1,
        isType: isType
      }
      this.triggerEvent('CounterPlusOne', modalObj)
    },
    eveCancelTap() {
      let isType = '';
      if (this.props.isType == "checkshopcart") {
        isType = 'checkshopcart'
      }
      if (this.props.isType == "orderConfirm") {
        isType = 'orderConfirm'
      }
      const modalObj = {
        modalShow: false,
        mask: false,
        type: 0,
        isType: isType
      }
      this.triggerEvent('CounterPlusOne', modalObj)
    },
    eveHiddenShopcart() {
      const modalObj = {
        modalShow: false,
        mask: false
      }
      this.triggerEvent('CounterPlusOne', modalObj)
    }
  },
})