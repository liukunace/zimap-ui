import cmp from '../virtualCmp'
import { makeColor } from '../../utils/util'
const props = {
  mode: {
    type: Number,
    default: 1
  },
  pointColor: {
    type: String | Object | Array,
    default: 'rgb(255,229,0)'
  },
  pointPixelSize: {
    type: Number,
    default: 8
  }
}
const watch = {
  drawing (val) {
    const { polylines, startNew, drawType } = this
    const polyline = polylines[polylines.length - 1]
    if (!val && polyline && !polyline.positions.length) {
      this.polylines.pop()
    } else if (val) {
      const drawCmpNames = []
      switch (drawType) {
        case 'pointDrawing':
          drawCmpNames.push('vc-handler-draw-polyline')
          drawCmpNames.push('vc-handler-draw-polygon')
          break
        case 'polylineDrawing':
          drawCmpNames.push('vc-handler-draw-point')
          drawCmpNames.push('vc-handler-draw-polygon')
          break
        case 'polygonDrawing':
          drawCmpNames.push('vc-handler-draw-polyline')
          drawCmpNames.push('vc-handler-draw-point')
          break
      }
      for (let $node of this.$parent.$slots.default || []) {
        if ($node.componentOptions && drawCmpNames.indexOf($node.componentOptions.tag) !== -1) {
          $node.child.drawing = false
        }
      }
      startNew()
    }
    this.viewer.canvas.setAttribute('style', val ? 'cursor: crosshair' : 'cursor: auto')
    const listener = this.$listeners['activeEvt']
    listener && this.$emit('activeEvt', { type: drawType, isActive: val })
  }
}

const computed = {}
const methods = {
  async createCesiumObject () {
    const { viewer } = this
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
    handler.setInputAction(this.LEFT_CLICK, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    handler.setInputAction(this.MOUSE_MOVE, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    handler.setInputAction(this.RIGHT_CLICK, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    this.handler = handler
    return this.polylines
  },
  async mount () {
    return true
  },
  async unload () {
    return true
  },
  LEFT_CLICK (movement) {
    if (!this.drawing) {
      return
    }
    const { Cesium, viewer, polylines } = this
    let cartesian = viewer.scene.pickPosition(movement.position)
    if (!Cesium.defined(cartesian)) {
      return
    }
    const polyline = polylines[polylines.length - 1]
    polyline.positions.push(cartesian)
  },
  async MOUSE_MOVE (movement) {
    if (!this.drawing) {
      return
    }
    const { Cesium, viewer, polylines, onDrawingEvt, drawType } = this
    if (!polylines.length) {
      return
    }
    const nIndex = polylines.length - 1
    const polyline = polylines[nIndex]
    if (!polyline.positions.length) {
      return
    }
    let cartesian = viewer.scene.pickPosition(movement.endPosition)
    if (!Cesium.defined(cartesian)) {
      return
    }
    if (polyline.positions.length >= 2) {
      polyline.positions.pop()
    }
    polyline.positions.push(cartesian)
    const listener = this.$listeners['movingEvt']
    listener && this.$emit('movingEvt', movement.endPosition, drawType)
    onDrawingEvt(polyline, nIndex)
  },
  async RIGHT_CLICK (movement) {
    if (!this.drawing) {
      return
    }
    const { viewer, polylines, mode, startNew, onDrawingEvt } = this
    if (!polylines.length) {
      return
    }
    const nIndex = polylines.length - 1
    const polyline = polylines[nIndex]
    if (polyline.positions.length === 0) {
      return
    }
    let cartesian = viewer.scene.pickPosition(movement.position)
    if (!Cesium.defined(cartesian)) {
      return
    }
    polyline.positions.pop()
    if (mode === 0) {
      startNew()
    } else {
      this.drawing = false
    }
    await this.$nextTick()
    onDrawingEvt(polyline, nIndex, true)
  },
  startNew () {
    const { polylines, drawType } = this
    const poyline = {
      positions: []
    }
    const drawLine = drawType === 'polylineDrawing' || drawType === 'polygonDrawing'
    drawLine && Object.assign(poyline, {
      materialLine: new Cesium.Material({
        fabric: {
          type: 'Color',
          uniforms: {
            color: makeColor(this.polylineColor)
          }
        }
      })
    })
    Cesium.defined(polylines) && polylines.push(poyline)
  },
  clear () {
    this.polylines = []
    this.drawing = false
  },
  onDrawingEvt (polyline, index, flag = false) {
    this.index = index
    if (!this.depthTest) {
      this.$refs.polylineCollection.cesiumObject._opaqueRS.depthTest.enabled = false
    }
    const listener = this.$listeners['drawEvt']
    listener &&
      this.$emit('drawEvt', {
        polyline: polyline,
        type: this.drawType,
        finished: flag
      })
  }
}

export default {
  mixins: [cmp],
  props,
  watch,
  computed,
  methods,
  destroyed () {
    const { handler } = this
    if (handler) {
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    }
  }
}
