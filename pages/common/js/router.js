/**
 * @Description: 路由跳转
 * @author bev
 * @date 2019/9/4
 * @time 16:56
*/

/**
 * @function 切换 TabBar
 * @description 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
 * @param {String} url
 * @param {Function} success
 * @param {Function} fail
 * @param {Function} complete
 * @return {Function}
 */
export const switchTab = ({
  url,
  success = () => {},
  fail = () => {},
  complete = () => {}
}) => wx.switchTab({
  url,
  success,
  fail,
  complete
 });


/**
 * @function 重启路由
 * @description 关闭所有页面，打开到应用内的某个页面
 * @param {String} url
 * @param {Function} success
 * @param {Function} fail
 * @param {Function} complete
 * @return {Function}
 */
export const reLaunch = ({
 url,
 success = () => {},
 fail = () => {},
 complete = () => {}
}) => wx.reLaunch({
  url,
  success,
  fail,
  complete
});


/**
 * @function 重定向
 * @description 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabBar 页面
 * @param {String} url
 * @param {Function} success
 * @param {Function} fail
 * @param {Function} complete
 * @return {Function}
 */
export const redirectTo = ({
 url,
 success = () => {},
 fail = () => {},
 complete = () => {}
}) => wx.redirectTo({
  url,
  success,
  fail,
  complete
});

/**
 * @function 页面跳转
 * @description 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabBar 页面
 * @param {String} url
 * @param {Object} query
 * @param {Function} success
 * @param {Function} fail
 * @param {Function} complete
 * @return {Function}
 */
export const navigateTo = ({
 url,
 query,
 success = () => {},
 fail = () => {},
 complete = () => {}
}) => {
  if (query) {
    let queryArr = Object.entries(query);
    url = url + '?';
    queryArr.forEach(([key, value]) => {
      url += `${ key }=${ value }&`
    });
    url = url.slice(0, -1);
  }
  return wx.navigateTo({
  url,
  success,
  fail,
  complete,
})};