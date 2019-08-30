/*地球半径*/
var EARTHRADIUS = 6370996.81;
/**
* 将度转化为弧度
* @param {degree} Number 度
* @returns {Number} 弧度
*/
function degreeToRad(degree) {
  return Math.PI * degree / 180;
}
/*
* 将v值限定在a,b之间，纬度使用
*/
function _getRange(v, a, b) {
  if (a != null) {
    v = Math.max(v, a);
  }
  if (b != null) {
    v = Math.min(v, b);
  }
  return v;
}
/**
* 将v值限定在a,b之间，经度使用
*/
function _getLoop(v, a, b) {
  while (v > b) {
    v -= b - a
  }
  while (v < a) {
    v += b - a
  }
  return v;
}
/**
* 计算两点之间的距离,两点坐标必须为经纬度
* @param {lng1} Number 点对象
* @param {lat1} Number 点对象
* @param {lng2} Number 点对象
* @param {lat2} Number 点对象
* @returns {Number} 两点之间距离，单位为米
*/
export default function getDistance(lng1, lat1, lng2, lat2) {
  var point1 = {
    lng: parseFloat(lng1),
    lat: parseFloat(lat1)
  }

  var point2 = {
    lng: parseFloat(lng2),
    lat: parseFloat(lat2)
  }

  point1.lng = _getLoop(point1.lng, -180, 180);
  point1.lat = _getRange(point1.lat, -74, 74);
  point2.lng = _getLoop(point2.lng, -180, 180);
  point2.lat = _getRange(point2.lat, -74, 74);
  let x1, x2, y1, y2;
  x1 = degreeToRad(point1.lng);
  y1 = degreeToRad(point1.lat);
  x2 = degreeToRad(point2.lng);
  y2 = degreeToRad(point2.lat);
  return EARTHRADIUS * Math.acos((Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1)));
}