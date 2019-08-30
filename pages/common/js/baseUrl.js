// 测试环境
export const baseUrl = 'https://test-wap.juewei.com/api';
// 图片测试cdn
export const imageUrl = 'https://test-wap.juewei.com/m/ali-mini/image/';
export const imageUrl2 = 'https://imgcdnjwd.juewei.com';
export const imageUrl3 = 'https://images.juewei.com';
//jsonUrl
export const jsonUrl='https://imgcdnjwd.juewei.com/static/check';
//百度测试ak
export const ak = 'pRtqXqnajTytAzWDL3HOnPRK';
export const geotable_id='134917';




// // 生产环境
// export const baseUrl = 'https://wap.juewei.com/api';
// // 图片测试cdn
// export const imageUrl = 'https://wap.juewei.com/m/ali-mini/image/';
// export const imageUrl2 = 'https://imgcdnjwd.juewei.com';
// export const imageUrl3 = 'https://images.juewei.com';
// //jsonUrl
// export const jsonUrl='https://imgcdnjwd.juewei.com/static/product';
// // 百度生产ak
// export const ak = 'pRtqXqnajTytAzWDL3HOnPRK';
// export const geotable_id='134917';




// 判断是否测试环境
const isTestUrl = baseUrl.includes('test');
// 套餐图片路径
export const img_url = isTestUrl?imageUrl2:imageUrl3;

