#### 小程序app初始化时候的登录流程

> 自动登录接口只传code

1. wx.login  获取 code  

2. 调起自动登录接口 `LoginByAuth` 获取 sessionkey unionid，老用户有 userinfo (绝味数据中的用户信息) ，新用户没有 userinfo 信息。

3. 按钮获取用户信息的，要暂存到缓存中

4. 初次登录用户没有授权信息的情况，在我的，商城首页去结算按钮等按钮触发授权调起 `wx.getUserInfo` 获取用户信息，并存储
5. 如果用户没有登录就存储，等到用户登录，调起登录接口，把所有信息传给后台，包括 iv，signature 等敏感信息信息。
6. 如果用户登录了，就是没有授权用户信息，情况这是用户授权了用户信息，就存储起来