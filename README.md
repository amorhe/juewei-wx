#微信小程序开发说明

##后台接口url域名
见开发文档
####https://gitbook.juewei.com/README


##图片cdn地址链接url域名
####https://developers.weixin.qq.com/miniprogram/dev/api/

####测试环境
    AppID(小程序ID)：wx088d6a494c5827ed  
    AppSecret(小程序密钥)：e62408f621f0f1df7f873d553a4062ad
    接口：             https://test-wap.juewei.com/api/
    小图标cdn路径：     https://test-wap.juewei.com/m/wx-mini/image/
    商品图片和json文件：https://imgcdnjwd.juewei.com/static/check/
    百度测试ak         ak = 'Xp8lScY0eQ50WN9dSyCmC3x058fU98O7'; geotable_id='134917';
    腾讯地图：         JWBBZ-4EX6F-6CRJR-JLNTC-WQFSS-FTBTD

 
####正式环境
    AppID(小程序ID)：   wx48d6e365fcea9989
    AppSecret(小程序密钥)：6b3ab82314018eb7fc9252e367f1bb30
    接口：              https://wap.juewei.com/api/
    小图标cdn路径：      https://wap.juewei.com/m/wx-mini/image/
    商品图片和json文件： https://imgcdnjwd.juewei.com/static/product/
    百度测试ak          ak = 'Xp8lScY0eQ50WN9dSyCmC3x058fU98O7'; geotable_id='134917';
    腾讯地图：          

##文件结构说明
├─ pages    主包
|   ├─ city    城市切换
|   ├─ common    公共引用页面（越少越好）
|   |     ├─ img     内部图片位置
|   |     ├─ js      公共js文件夹
|   |     |   ├─ AddShopCar.js  购物车小球方法
|   |     |   ├─ address.js   地址部分接口  
|   |     |   ├─ ajax.js   封装request
|   |     |   ├─ baseUrl.js  公共url域名
|   |     |   ├─ city.js   全国所有城市 
|   |     |   ├─ getdistance.js  经纬度距离计算
|   |     |   ├─ home.js  主要接口
|   |     |   ├─ li-ajax.js 封装request   
|   |     |   ├─ login.js 登录部分接口
|   |     |   ├─ map.js 百度腾讯坐标转换
|   |     |   ├─ my.js 个人中心接口
|   |     |   ├─ order.js 订单部分接口
|   |     |   ├─ router.js 导航切换封装
|   |     |   ├─ time.js 时间日期转换
|   |     |   ├─ utils.js 公共方法
|   |     |   └─ vip.js  vip部分接口
|   |     |    
|   |     └─ style   公共css文件夹
|   |          └─  common.acss  公共的css样式
|   |              
|   ├─ components  自定义组件库
|   |     ├─ confirm  自定义弹窗组件
|   |     ├─ goodsModal  商品选择规格弹窗自定义组件
|   |     ├─ shopcartModel 购物车自定义组件
|   |     └─ tab-bar 底部tabbar自定义组件
|   |
|   ├─ home 商城文件夹
|   |    ├─ goodslist  商城首页列表页(外卖和自提是一个)
|   |    |       └─ goodsdetail 商品详情页面
|   |    ├─ orderfinish 订单完成页(外卖和自提是一个)
|   |    ├─ orderform  确认订单(外卖和自提是一个)
|   |    ├─ selecttarget 手动选择定位地址
|   |    ├─ switchshop  切换门店功能
|   |    └─ selfshop 去自提页面
|   |
|   ├─ login   登录文件夹
|   |    ├─ auth 授权登录和手机号填写页，登录首页
|   |    ├─ protocol 用户协议，静态页
|   |    └─ verifycode 手机号验证码页
|   |
|   ├─ position 定位欢迎页
|   |
|   ├─ noposition 无自动定位页面
|   |
|   ├─ my     我的文件夹
|   |   └─ index  我的首页
|   |
|   ├─ order    订单文件夹
|   |    └─ list 订单列表首页
|   |
|   ├─ vip   vip文件夹
|   |   └─ index vip专享首页
|   |
|   └─ noNet 无网络提示页面
|
├─ package_my   我的包
|  └─pages
|      ├─ coupon 卡券列表页(优惠券和兑换码列表首页)
|      |    ├─ couponRecord 历史优惠券页面
|      |    ├─ changedetails 兑换详情页
|      |    ├─ redeemCodeRecord 历史兑换码页面
|      |    ├─ explain  优惠券使用说明
|      |    └─ exchange 兑换页面
|      |
|      ├─ membercard 会员卡
|      |
|      ├─ myaddress 我的收获地址管理
|      |     ├─ addaddress 新增我的收获地址
|      |     └─ selectaddress 选择地图上的地址
|      |
|      ├─ mycenter 个人中心设置
|      |     ├─ bindphone 从新绑定手机号页面
|      |     └─ newphone  输入新手机号页面
|      |
|      ├─ nearshop 附近门店
|      |
|      ├─ onlineservice 在线客服页
|      |
|      └─ entitlement 会员专享权益
|
├─ package_order  订单分包
|     └─ pages
|          ├─ comment  用户评价系统（外卖和自提）
|          |    └─comment-success  用户评价成功反馈页
|          |
|          └─ orderdetail  订单详情页（外卖和自提）
|
├─ package_vip 会员专享分包
|    └─ pages
|         ├─ detail  会员详情页
|         |
|         ├─ exchangelist  兑换产品记录页面
|         |      └─ exchangedetail  兑换详情页
|         |
|         ├─ finish 兑换完成页（成功和失败）
|         |
|         ├─ pointlist 积分消耗列表
|         |      └─ rules  积分规则，静态页
|         |
|         └─ waitpay 待支付页面
|
├─ iview-weapp 小程序应用自定三方组件，全局组件
|
└─ utils 小程序公共js库

## 约定
1. 事件用 `EVENT` 开头
2. 自定义组件嵌套最多 ** 一层 **
3. JSON 数据 onLoad 里面
4. setTimeOut 取代 setInterval
5. 全局变量在 APPID 里声明
6. 注释完善一下
