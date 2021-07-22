import Map from './map'

export default class GoogleMap extends Map {
  constructor(el, opts) {
    super()
    this.init(el, opts)
  }
  static getPoint(point) {
    return new google.maps.LatLng(point.lat, point.lng)
  }
  init(el, opts) {
    let _default = {
      zoom: 14,
      center: {lat: 0, lng: 0},
      // mapTypeControl: false,
      // zoomControl: false,
      // scaleControl: true,
      // streetViewControl: false,
      // fullscreenControl: true,
      disableDefaultUI: false // 是否显示默认控件
    }
    if (opts) {
      opts = Object.assign({}, _default, opts)
    } else {
      opts = _default
    }
    this.markers = []
    this.map = new google.maps.Map(el, opts)
  }
  /**
   * 设置地图中心点
   * @param {Object} centerPoint 
   * @param {Number} zoom 
   */
  centerAndZoom(centerPoint, zoom) {
    this.map.setZoom(zoom)
    this.map.setCenter(centerPoint)
  }
  setMarker(point) {
    const marker = new google.maps.Marker({position: point, map: this.map})
    this.markers.push(marker)
  }
  clearOverlays() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = []
  }
  getPosition() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          resolve(pos)
        }, function() {
          reject(`Browser doesn't support Geolocation`)
        });
      } else {
        reject(`Browser doesn't support Geolocation`)
      }
    })
  }
}
