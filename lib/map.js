import gcoord from 'gcoord'

export default class Map {
  static tranformBD09toWgs84({lng, lat}) {
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
  static tranformWGS84toBD09({lng, lat}) {
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
  static tranformWgs84toGCJ02({lng, lat}) {
    [lng, lat] = gcoord.transform(
      [lng, lat], // 经纬度坐标
      gcoord.WGS84, // 当前坐标系
      gcoord.GCJ02 // 目标坐标系
    )
    return {
      lng,
      lat
    }
  }
  static tranformGCJ02toWgs84({lng, lat}) {
    [lng, lat] = gcoord.transform(
      [lng, lat], // 经纬度坐标
      gcoord.GCJ02, // 当前坐标系
      gcoord.WGS84 // 目标坐标系
    )
    return {
      lng,
      lat
    }
  }
  static getPoint() {
    throw new Error('定义创建点的方法')
  }
  static getAddress() {
    throw new Error('根据经纬度获取具体地址')
  }
  init() {
    throw new Error('定义地图初始化方法')
  }
  centerAndZoom() {
    throw new Error('设置地图中心点')
  }
  setMarker() {
    throw new Error('设置marker')
  }
  getPosition() {
    throw new Error('获取当前位置')
  }
}
