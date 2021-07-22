<template>
  <div class="container">
    <div id="map"></div>
    <div class="operator">
      <button type="button" @click="openEditMode" v-show="!isEditMode">
        编辑
      </button>
      <button type="button" @click="editConfirm" v-show="isEditMode">
        确认
      </button>
      <button type="button" @click="prevStep">prev</button>
      <button type="button" @click="nextStep">next</button>
      <button type="button" @click="toggleAddVertex">add</button>
      <button type="button" @click="deleteVertex">decrease</button>
    </div>
  </div>
</template>

<script>
import OlMap from '../utils/olMap'

export default {
  name: 'Map',
  data() {
    return {
      map: null,
      vectorLayer: null,
      tileLayer: null,
      drawedFeature: null,
      historyFeature: [], // 历史记录栈
      historyIndex: -1, // 历史记录指针
      isEditMode: false, // 是否编辑模式
      isCanAddVertex: false // 是否开启添加顶点
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      this.vectorLayer = OlMap.createVectorLayer()
      this.tileLayer = OlMap.createTileLayer()
      this.map = new OlMap({
        target: 'map',
        layers: [this.tileLayer, this.vectorLayer]
      })
      this.map.openDrawMode({
        source: this.vectorLayer.getSource(),
        drawend: (e) => {
          this.drawedFeature = e.feature
          this.map.clearDrawInteraction()
        }
      })
    },
    openEditMode() {
      this.isEditMode = true
      if (this.map.modify && this.map.select && this.map.snap) {
        console.log(111111111)
        console.log(this.drawedFeature)
        // 开启编辑，重新把几何图形赋给Select
        this.map.select.getFeatures().push(this.drawedFeature)
        this.map.setEditActive(true)
      } else {
        this.map.openEditMode({
          source: this.vectorLayer.getSource(this.drawedFeature),
          selectedFeature: this.drawedFeature,
          // 添加顶点条件
          insertVertexCondition: () => {
            if (this.isCanAddVertex) {
              return true
            } else {
              return false
            }
          },
          modifystart: (e) => {
            if (this.historyFeature.length - 1 !== this.historyIndex) {
              this.historyFeature = this.historyFeature.slice(
                0,
                this.historyIndex + 1
              )
            }
            if (this.historyFeature.length === 0) {
              this.historyFeature.push(e.features.item(0).clone())
              this.historyIndex++
            }
          },
          modifyend: (e) => {
            const features = e.features.item(0).clone()
            this.historyFeature.push(e.features.item(0).clone())
            this.historyIndex++
            this.drawedFeature = features
          }
        })
      }
    },
    // 编辑确认
    editConfirm() {
      this.isEditMode = false
      this.map.setEditActive(false)
      this.clearHistory()
      // 清空select的features
      this.map.clearSelectFeatures()
    },
    // 回撤
    prevStep() {
      this.historyIndex--
      if (this.historyIndex < 0) {
        this.historyIndex = 0
        return
      }
      this.recoverGeometry()
    },
    // 前撤
    nextStep() {
      this.historyIndex++
      if (this.historyIndex > this.historyFeature.length - 1) {
        this.historyIndex = this.historyFeature.length - 1
        return
      }
      this.recoverGeometry()
    },
    // 删除顶点
    deleteVertex() {
      this.map.deleteVertex()
    },
    recoverGeometry() {
      this.drawedFeature = this.historyFeature[this.historyIndex].clone()
      const coord = this.historyFeature[this.historyIndex]
        .getGeometry()
        .getCoordinates()
      this.map.select
        .getFeatures()
        .item(0)
        .getGeometry()
        .setCoordinates(coord)
    },
    // 切换添加顶点
    toggleAddVertex() {
      this.isCanAddVertex = !this.isCanAddVertex
    },
    clearHistory() {
      this.historyFeature = []
      this.historyIndex = -1
    }
  }
}
</script>
<style scoped>
#map {
  width: 600px;
  height: 600px;
}
.operator {
  display: flex;
}
</style>
