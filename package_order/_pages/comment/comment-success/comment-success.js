import { ajax, log } from '../../../../pages/common/js/li-ajax'
import { imageUrl } from '../../../../pages/common/js/baseUrl'

Page({
  data: {
    imageUrl
  },
  onLoad() {

  },

  sw(){
    my.switchTab({
      url: '/pages/home/goodslist/goodslist', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
    });
  }
});
