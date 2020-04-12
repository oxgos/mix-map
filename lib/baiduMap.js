import Map from './map'
import gcoord from 'gcoord'

export default class BaiduMap extends Map {
  constructor(el, opts) {
    super()
    this.init(el, opts)
  }
  static getPoint({lng, lat}) {
    return new BMap.Point(lng, lat)
  }
  static tranformBD09toWgs84(lng, lat) {
    [lng, lat] = gcoord.transform(
      [lng, lat], // 经纬度坐标
      gcoord.BD09, // 当前坐标系
      gcoord.WGS84 // 目标坐标系
    )
    return {
      lng,
      lat
    }
  }
  static tranformWGS84toBD09(lng, lat) {
    [lng, lat] = gcoord.transform(
      [lng, lat], // 经纬度坐标
      gcoord.WGS84, // 当前坐标系
      gcoord.BD09 // 目标坐标系
    )
    return {
      lng,
      lat
    }
  }
  /**
   * 根据经纬度获取具体地址
   * @param {Point} point 
   */
  static getAddress(point) {
    return new Promise((resolve, reject) => {
      const geoc = new BMap.Geocoder()
      geoc.getLocation(point, function(rs) {
        const addComp = rs.addressComponents
        resolve(`${addComp.province}${addComp.city}${addComp.district}${addComp.street}${addComp.streetNumber}`)
      })
    })
  }
  /**
   * 初始化地图
   * @param {HTMLElement} el 
   * @param {Object} opts 
   */
  init(el, opts) {
    let _default = {
      minZoom: 1,
      maxZoom: 18,
      enableHighResolution: true
    }
    if (opts) {
      opts = Object.assign({}, _default, opts)
    }
    this.map = new BMap.Map(el, opts)
    this.map.enableScrollWheelZoom(true)
  }
  /**
   * 设置地图中心点
   * @param {Ponit} centerPoint 
   * @param {Number} zoom 
   */
  centerAndZoom(centerPoint, zoom) {
    this.map.centerAndZoom(centerPoint, zoom)
  }
  /**
   * 设置marker
   * @param {Object}  
   */
  setMarker({lng, lat}) {
    const marker = new BMap.Marker(BaiduMap.getPoint({lng, lat}))
    this.map.addOverlay(marker)
  }
  /**
   * 确保所有点在地图视野里
   * @param {Array} points
   */
  setViewport(points) {
    this.map.setViewport(points)
  }
  /**
   * 清除所有覆盖物
   */
  clearOverlays() {
    this.map.clearOverlays()
  }
  getPosition() {
    return new Promise((resolve, reject) => {
      const geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          resolve(r.point)
        } else {
          // 关于状态码
          // BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
          // BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
          // BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
          // BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
          // BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
          // BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
          // BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
          // BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
          // BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)
          let ret
          switch(this.getStatus()) {
            case BMAP_STATUS_CITY_LIST:
              ret = {
                code: BMAP_STATUS_CITY_LIST,
                msg: '城市列表'
              }
              break
            case BMAP_STATUS_UNKNOWN_LOCATION:
              ret = {
                code: BMAP_STATUS_UNKNOWN_LOCATION,
                msg: '位置结果未知'
              }
              break
            case BMAP_STATUS_UNKNOWN_ROUTE:
              ret = {
                code: BMAP_STATUS_UNKNOWN_LOCATION,
                msg: '导航结果未知'
              }
              break
            case BMAP_STATUS_INVALID_KEY:
              ret = {
                code: BMAP_STATUS_INVALID_KEY,
                msg: '非法密钥'
              }
              break
            case BMAP_STATUS_INVALID_REQUEST:
              ret = {
                code: BMAP_STATUS_INVALID_REQUEST,
                msg: '非法请求'
              }
              break
            case BMAP_STATUS_PERMISSION_DENIED:
              ret = {
                code: BMAP_STATUS_PERMISSION_DENIED,
                msg: '没有权限'
              }
              break
            case BMAP_STATUS_SERVICE_UNAVAILABLE:
              ret = {
                code: BMAP_STATUS_SERVICE_UNAVAILABLE,
                msg: '服务不可用'
              }
              break
            case BMAP_STATUS_TIMEOUT:
              ret = {
                code: BMAP_STATUS_TIMEOUT,
                msg: '超时'
              }
              break
          }
          reject(ret)
        }        
      }, { enableHighAccuracy: true })
    })
  }
}
