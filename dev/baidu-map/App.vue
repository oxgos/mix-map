<template>
  <div id="app">
    <div class="map__wrapper">
      <div id="map" ref="map"></div>
      <div class="map__pos" @click="getPosition">
        <img src="./position.png" alt="icon">
      </div>
    </div>
  </div>
</template>

<script>
// import { BaiduMap } from '../../dist/mixMap'
import { createMap, BaiduMap } from '../../lib'

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
      this.map = createMap('map', 'baidu')
      this.map.centerAndZoom(BEIJING_BD09, 14)
      this.map.setMarker(BEIJING_BD09)

      BaiduMap.getAddress(BEIJING_BD09).then(res => {
        const addr = res
        console.log('地址:', addr)
      })
      const BEIJING_WGS84 = BaiduMap.tranformBD09toWgs84(BEIJING_BD09)
      console.log('BEIJING_WGS84', BEIJING_WGS84)
    },
    getPosition() {
      this.map && this.map.getPosition().then(point => {
        console.log(point)
        this.map.setMarker(point)
        this.map.centerAndZoom(point, 14)
      }).catch(e => {
        console.log(e)
      })
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
  .map__pos {
    position: absolute;
    right: 20px;
    bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background-color: #fff;
  }
  .map__pos > img {
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }
  #map {
    width: 100%;
    height: 400px;
  }
</style>
