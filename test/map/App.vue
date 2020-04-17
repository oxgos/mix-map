<template>
  <div id="app">
    <div class="map__wrapper">
      <div id="map" ref="map"></div>
    </div>
  </div>
</template>

<script>
// import { BaiduMap } from '../../dist/mixMap'
import { BaiduMap } from '../../lib'

const BEIJING_BD09 = {
  lng: 116.404,
  lat: 39.915
}

export default {
  name: 'app',
  data() {
    return {
      map: null
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      this.map = new BaiduMap('map')
      this.map.centerAndZoom(BEIJING_BD09, 14)
      this.map.setMarker(BEIJING_BD09)

      BaiduMap.getAddress(BEIJING_BD09).then(res => {
        const addr = res
        console.log('地址:', addr)
      })
      const BEIJING_WGS84 = BaiduMap.tranformBD09toWgs84(BEIJING_BD09)
      console.log('BEIJING_WGS84', BEIJING_WGS84)
    }
  }
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }
  .map__wrapper {
    position: relative;
  }
  #map {
    width: 500px;
    height: 400px;
  }
</style>
