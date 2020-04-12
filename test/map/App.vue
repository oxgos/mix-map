<template>
  <div id="app">
    {{ msg }}
  </div>
</template>

<script>
import { BaiduMap } from '../../dist/mixMap'

export default {
  name: 'app',
  data() {
    return {
      msg: 'hello world'
    }
  },
  created() {
    let pt = BaiduMap.getPoint()
    console.log('BaiduMap ' + pt)
  }
}
</script>

<style>
</style>
