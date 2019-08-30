import { upAliMiniFormId } from './home'
// 比较两个日期时间相差多少天
export const datedifference = (sDate1, sDate2) => {
  var dateSpan, iDays;
  var sDate1 = sDate1.replace(/-/g, '/')
  var date1 = Date.parse(new Date(sDate1))
  var sDate2 = sDate2.replace(/-/g, '/')
  var date2 = Date.parse(new Date(sDate2))
  dateSpan = date2 - date1;
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
  return iDays
};

// 判断门店是否营业
export const cur_dateTime = (start, end) => {
  var timestamp = new Date().getTime();
  var mytime = new Date().toLocaleDateString();
  var time1 = new Date(`${mytime} ${start}`).getTime();
  var time2 = new Date(`${mytime} ${end}`).getTime();
  if (time2 - timestamp > 0 && time2 - timestamp < 1000 * 3600) {
    return 3    // 不足一小时
  } else if (time2 - timestamp > 1000 * 3600 && timestamp < time2 && timestamp > time1) {
    return 1   // 营业中
  } else {
    return 2    // 未营业
  }
}

// 比较两个数字大小,大到小
export const compare = (property) => {
  return (a, b) => {
    var value1 = a[property];
    var value2 = b[property];
    return value2 - value1;
  }
}
// 小到大
export const sortNum = (property) => {
  return (a, b) => {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}

// 时间戳转时间
export const formatTime = (number, format) => {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
//数据转化  
const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 获取当前日期时间
export const getNowDate = () => {
  var date = new Date();
  var sign1 = "-";
  var sign2 = ":";
  var year = date.getFullYear() // 年
  var month = date.getMonth() + 1; // 月
  var day = date.getDate(); // 日
  var hour = date.getHours(); // 时
  var minutes = date.getMinutes(); // 分
  var seconds = date.getSeconds() //秒
  var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
  var week = weekArr[date.getDay()];
  // 给一位数数据前面加 “0”
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  var currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds;
  return currentdate;
}


// 上传formid，模版消息
export const upformId = (formId) => {
  upAliMiniFormId(my.getStorageSync({ key: '_sid' }).data, my.getStorageSync({ key: 'ali_uid' }).data, formId).then((res) => {
    // console.log(res)
  })
}