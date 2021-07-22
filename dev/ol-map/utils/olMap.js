import 'ol/ol.css'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import Overlay from 'ol/Overlay'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature.js'
import { Fill, Icon, Stroke, Style, Circle as CircleStyle } from 'ol/style.js'
import MultiPoint from 'ol/geom/MultiPoint'
import { defaults as defaultControls } from 'ol/control.js'
import { Vector as VectorLayer } from 'ol/layer.js'
import { Vector as VectorSource } from 'ol/source.js'
import { never, always } from 'ol/events/condition'
import {
  defaults as defaultInteractions,
  Draw,
  Modify,
  Select,
  Snap
} from 'ol/interaction.js'

import View from 'ol/View'

const GZ_COOR = [113.2759, 23.117]

class olMap {
  constructor(opts) {
    this.mapIns = null
    this.draw = null
    this.select = null
    this.modify = null
    this.snap = null
    this.selectedModifyPoint = null
    this.init(opts)
  }
  get view() {
    return this.mapIns.getView()
  }
  /**
   * 创建VectorLayer
   * @param {object} opts 配置
   * @returns VectorLayer
   */
  static createVectorLayer(opts = {}) {
    let _default = {
      source: new VectorSource()
    }
    opts = Object.assign({}, _default, opts)
    return new VectorLayer(opts)
  }
  /**
   * 创建tileLayer
   * @param {object} opts 配置
   * @returns TileLayer
   */
  static createTileLayer(opts = {}) {
    let _default = {
      source: new OSM()
    }
    opts = Object.assign({}, _default, opts)
    return new TileLayer(opts)
  }
  /**
   * 初始化地图
   * @param {string} el 元素id
   * @param {array<object>} layers 图层
   * @param {array<number>} centerPoint 中心点
   * @param {number} initialZoom 初始zoom
   */
  init({ target, layers, centerPoint, initialZoom, maxZoom, minZoom }) {
    this.mapIns = new Map({
      target,
      layers,
      controls: defaultControls({
        zoom: true,
        attribution: false,
        rotate: false
      }),
      interactions: defaultInteractions({
        keyboard: false,
        doubleClickZoom: false,
        dragRotate: false,
        pinchRotate: false
      }),
      view: new View({
        projection: 'EPSG:4326',
        center: centerPoint || GZ_COOR,
        zoom: initialZoom || 9,
        maxZoom: maxZoom || 19,
        minZoom: minZoom || 6
      })
    })
  }
  /**
   * 创建style
   * @param {object} opts 选项
   * @returns Style
   */
  createStyle(opts) {
    const { fill, stroke, image, geometry } = opts
    const style = new Style()
    if (fill) {
      style.setFill(
        new Fill({
          color: fill.color || 'origin'
        })
      )
    }
    if (stroke) {
      style.setStroke(
        new Stroke({
          color: stroke.color || 'origin',
          width: stroke.width || 1
        })
      )
    }
    if (image) {
      style.setImage(
        new CircleStyle({
          radius: image.radius,
          fill: new Fill({
            color: image.color
          })
        })
      )
    }
    if (geometry) {
      style.setGeometry(geometry)
    }
    return style
  }
  /**
   * 创建feature
   * @param {array<number>} point 经纬度
   * @param {Style} style Style对象
   * @param {string} name 名称
   * @returns
   */
  createFeature(point, style, name) {
    const feature = new Feature({
      geometry: new Point(point),
      name
    })
    feature.setStyle(style)
    return feature
  }
  /**
   * 添加feature到图层
   * @param {object} layer 图层对象
   * @param {object} feature Feature对象
   */
  addFeature(layer, feature) {
    layer.getSource().addFeature(feature)
  }
  /**
   * 图层清除feature
   * @param {object} layer 图层对象
   */
  clearFeature(layer) {
    layer.getSource().clear()
  }
  /**
   * 创建overlay
   * @param {string} el 元素id
   * @param {string} position 方位
   * @returns
   */
  createOverlay(el, position = 'center-center') {
    return new Overlay({
      element: document.getElementById(el),
      positioning: position
    })
  }
  /**
   * 添加overlay到地图
   * @param {Overlay} overlay Overlay对象
   * @param {array} point 经纬度
   * @param {number} toZoom 地图缩放
   */
  addOverlay(overlay, point, toZoom) {
    overlay.setPosition(point)
    this.view.setZoom(toZoom)
    this.view.animate({
      center: point,
      duration: 0
    })
    this.mapIns.addOverlay(overlay)
  }
  /**
   * 清除地图overlay
   * @param {Overlay} overlay  Overlay对象
   */
  clearOverlay(overlay) {
    this.mapIns.removeOverlayer(overlay)
  }
  /**
   * 监听地图中心点变化事件
   * @param {function} cb 回调
   */
  addCenterListener(cb) {
    this.view.on('change:center', cb)
  }
  /**
   * 选择feature的单击事件
   * @param {function} cb 回调
   */
  addSingleClickListener(cb) {
    this.mapIns.on('singleclick', (e) => {
      e.stopPropagation()
      const pixel = this.mapIns.getEventPixel(e.originalEvent)
      const feature = this.mapIns.forEachFeatureAtPixel(
        pixel,
        (feature, layer) => {
          return feature
        }
      )
      if (feature) {
        cb(feature)
      }
    })
  }
  openDrawMode({ source, drawstart, drawend }) {
    this.draw = new Draw({
      source: source,
      type: 'Polygon'
    })
    this.mapIns.addInteraction(this.draw)
    if (drawstart) {
      this.draw.on('drawstart', drawstart)
    }
    if (drawend) {
      this.draw.on('drawend', drawend)
    }
  }
  openEditMode(opts) {
    this.createSelectInteraction(opts)
    this.createModifyInteraction(opts)
    this.createSnapInteraction(opts)
  }
  createModifyInteraction({ insertVertexCondition, modifystart, modifyend }) {
    if (this.select) {
      this.modify = new Modify({
        features: this.select.getFeatures(),
        insertVertexCondition: insertVertexCondition || always,
        condition: function(e) {
          // Check if there is a feature to select
          var f = this.getMap().getFeaturesAtPixel(e.pixel, {
            hitTolerance: 5
          })
          console.log('condition', f)
          if (f.length) {
            var p0 = e.pixel
            var p1 = f[0].getGeometry().getClosestPoint(e.coordinate)
            p1 = this.getMap().getPixelFromCoordinate(p1)
            var dx = p0[0] - p1[0]
            var dy = p0[1] - p1[1]
            if (Math.sqrt(dx * dx + dy * dy) > 8) {
              f = null
            }
            this.selectedModifyPoint = f
          }
          return true
        }
      })
      this.mapIns.addInteraction(this.modify)
    }
    if (modifystart) {
      this.modify.on('modifystart', modifystart)
    }
    if (modifyend) {
      this.modify.on('modifyend', modifyend)
    }
  }
  createSelectInteraction({ toggleCondition, selectedFeature }) {
    const lineStyle = this.createStyle({
      fill: {
        color: 'rgba(0, 0, 255, 0.1)'
      },
      stroke: {
        color: 'blue',
        width: 3
      }
    })
    const unselectedVertexStyle = this.createStyle({
      image: {
        radius: 5,
        color: 'orange'
      },
      geometry: (feature) => {
        const coordinates = feature.getGeometry().getCoordinates()[0]
        return new MultiPoint(coordinates)
      }
    })
    const selectedVertexStyle = this.createStyle({
      image: {
        radius: 5,
        color: 'blue'
      },
      geometry: () => {
        if (this.selectedModifyPoint) {
          const coordinates = this.selectedModifyPoint
            .getGeometry()
            .getCoordinates()[0]
          return new Point(coordinates)
        }
      }
    })
    this.select = new Select({
      style: [lineStyle, unselectedVertexStyle, selectedVertexStyle],
      toggleCondition: false
    })
    this.mapIns.addInteraction(this.select)
    // 主动选中feature
    if (selectedFeature) {
      this.select.getFeatures().push(selectedFeature)
    }
  }
  createSnapInteraction({ source }) {
    this.snap = new Snap({
      source
    })
    this.mapIns.addInteraction(this.snap)
  }
  // 删除顶点
  deleteVertex() {
    this.modify.removePoint()
  }
  setEditActive(bool) {
    this.modify.setActive(bool)
    this.select.setActive(bool)
    this.snap.setActive(bool)
  }
  /**
   * 修复到地区中心区域，并最大化
   * @param {object} layer 图层对象
   */
  mapFit(layer) {
    const extent = layer.getSource().getExtent()
    this.mapIns.getView().fit(extent)
  }
  clearSelectFeatures() {
    this.select.getFeatures().clear()
  }
  clearDrawInteraction() {
    this.mapIns.removeInteraction(this.draw)
  }
}

export default olMap
