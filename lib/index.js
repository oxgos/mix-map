import BaiduMap from './baiduMap'
import GoogleMap from './googleMap'

function createMap(el, type = 'baidu', opts = {}) {
  let map
  switch(type) {
    default:
    case 'baidu':
      map = new BaiduMap(el, opts)
      break
    case 'google':
      map = new GoogleMap(el, opts)
      break
  }
  return map
}

export {
  createMap,
  BaiduMap,
  GoogleMap
}
