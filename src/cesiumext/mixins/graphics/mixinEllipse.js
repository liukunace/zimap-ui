import { semiMajorAxis, semiMinorAxis, height, extrudedHeight, rotation, granularity } from '../mixinProps'

/**
 * vc-graphics-ellipse base props mixins
 */
export default {
  mixins: [semiMajorAxis, semiMinorAxis, height, extrudedHeight, rotation, granularity]
}
