import debounce from 'lodash.debounce'
import prettifyCoordinates from './prettifyCoordinates'
import prettifyProjection from './prettifyProjection'
import EarthGravityModel1996 from './EarthGravityModel1996'
class MouseCoords {
  constructor (options = {}) {
    const { Cartographic, knockout } = Cesium
    const gridFileUrl = options.gridFileUrl
    gridFileUrl && (this.geoidModel = new EarthGravityModel1996(gridFileUrl))

    this.proj4Projection = '+proj=utm +ellps=GRS80 +units=m +no_defs'
    this.projectionUnits = 'm'
    this.proj4longlat = '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees +no_defs'

    this.lastHeightSamplePosition = new Cartographic()
    this.accurateSamplingDebounceTime = 250
    this.tileRequestInFlight = undefined

    this.elevation = undefined
    this.utmZone = undefined
    this.latitude = undefined
    this.longitude = undefined
    this.north = undefined
    this.east = undefined
    this.useProjection = false
    this.debounceSampleAccurateHeight = debounce(this.sampleAccurateHeight, this.accurateSamplingDebounceTime)

    knockout.track(this, ['elevation', 'utmZone', 'latitude', 'longitude', 'north', 'east', 'useProjection'])
  }

  toggleUseProjection () {
    this.useProjection = !this.useProjection
  }

  updateCoordinatesFromCesium (viewer, position) {
    const { Cartographic, defined, EllipsoidTerrainProvider, Intersections2D } = Cesium
    const scene = viewer.scene
    const camera = scene.camera
    const pickRay = camera.getPickRay(position)
    const globe = scene.globe
    const pickedTriangle = pickTriangleOnGlobe.call(globe, pickRay, scene)
    if (defined(pickedTriangle)) {
      // Get a fast, accurate-ish height every time the mouse moves.
      const ellipsoid = globe.ellipsoid

      const v0 = ellipsoid.cartesianToCartographic(pickedTriangle.v0)
      const v1 = ellipsoid.cartesianToCartographic(pickedTriangle.v1)
      const v2 = ellipsoid.cartesianToCartographic(pickedTriangle.v2)
      const intersection = ellipsoid.cartesianToCartographic(pickedTriangle.intersection)
      let errorBar

      if (globe.terrainProvider instanceof EllipsoidTerrainProvider) {
        intersection.height = undefined
      } else {
        const barycentric = Intersections2D.computeBarycentricCoordinates(
          intersection.longitude,
          intersection.latitude,
          v0.longitude,
          v0.latitude,
          v1.longitude,
          v1.latitude,
          v2.longitude,
          v2.latitude
        )

        if (barycentric.x >= -1e-15 && barycentric.y >= -1e-15 && barycentric.z >= -1e-15) {
          const height = barycentric.x * v0.height + barycentric.y * v1.height + barycentric.z * v2.height
          intersection.height = height
        }
        const geometricError = globe.terrainProvider.getLevelMaximumGeometricError(pickedTriangle.tile.level)
        const approximateHeight = intersection.height
        const minHeight = Math.max(pickedTriangle.tile.data.tileBoundingRegion.minimumHeight, approximateHeight - geometricError)
        const maxHeight = Math.min(pickedTriangle.tile.data.tileBoundingRegion.maximumHeight, approximateHeight + geometricError)
        const minHeightGeoid = minHeight - (this.geoidModel ? this.geoidModel.minimumHeight : 0.0)
        const maxHeightGeoid = maxHeight + (this.geoidModel ? this.geoidModel.maximumHeight : 0.0)
        errorBar = Math.max(Math.abs(approximateHeight - minHeightGeoid), Math.abs(maxHeightGeoid - approximateHeight))
      }
      Cartographic.clone(intersection, this.lastHeightSamplePosition)
      const terrainProvider = globe.terrainProvider

      this.cartographicToFields(intersection, errorBar)
      if (!(terrainProvider instanceof EllipsoidTerrainProvider)) {
        this.debounceSampleAccurateHeight(terrainProvider, intersection)
      }
    } else {
      this.elevation = undefined
      this.utmZone = undefined
      this.latitude = undefined
      this.longitude = undefined
      this.north = undefined
      this.east = undefined
    }
  }

  cartographicToFields (coordinates, errorBar) {
    const { Math: CesiumMath } = Cesium
    const latitude = CesiumMath.toDegrees(coordinates.latitude)
    const longitude = CesiumMath.toDegrees(coordinates.longitude)

    if (this.useProjection) {
      var prettyProjection = prettifyProjection(
        longitude,
        latitude,
        this.proj4Projection,
        this.proj4longlat,
        this.projectionUnits
      )
      this.utmZone = prettyProjection.utmZone
      this.north = prettyProjection.north
      this.east = prettyProjection.east
    }

    var prettyCoordinate = prettifyCoordinates(longitude, latitude, {
      height: coordinates.height,
      errorBar: errorBar
    })
    this.latitude = prettyCoordinate.latitude
    this.longitude = prettyCoordinate.longitude
    this.elevation = prettyCoordinate.elevation
  }

  sampleAccurateHeight (terrainProvider, position) {
    const { Cartographic, sampleTerrainMostDetailed, when } = Cesium
    if (this.tileRequestInFlight) {
      // A tile request is already in flight, so reschedule for later.
      this.debounceSampleAccurateHeight.cancel()
      this.debounceSampleAccurateHeight(terrainProvider, position)
      return
    }

    const positionWithHeight = Cartographic.clone(position)

    const geoidHeightPromise = this.geoidModel ? this.geoidModel.getHeight(position.longitude, position.latitude) : undefined
    const terrainPromise = sampleTerrainMostDetailed(terrainProvider, [positionWithHeight])
    this.tileRequestInFlight = when.all(
      [geoidHeightPromise, terrainPromise],
      (result) => {
        const geoidHeight = result[0] || 0.0
        this.tileRequestInFlight = undefined
        if (Cartographic.equals(position, this.lastHeightSamplePosition)) {
          position.height = positionWithHeight.height - geoidHeight
          this.cartographicToFields(position)
        } else {
          // Mouse moved since we started this request, so the result isn't useful.  Try again next time.
        }
      },
      () => {
        this.tileRequestInFlight = undefined
      }
    )
  }
}
var scratchArray = []
var scratchSphereIntersectionResult = {
  start: 0.0,
  stop: 0.0
}
function pickTriangleOnGlobe (ray, scene, result) {
  const { BoundingSphere, Cartesian3, defined, DeveloperError, IntersectionTests, SceneMode } = Cesium
  // >>includeStart('debug', pragmas.debug);
  if (!defined(ray)) {
    throw new DeveloperError('ray is required')
  }
  if (!defined(scene)) {
    throw new DeveloperError('scene is required')
  }
  // >>includeEnd('debug');

  var mode = scene.mode
  var projection = scene.mapProjection

  var sphereIntersections = scratchArray
  sphereIntersections.length = 0

  var tilesToRender = this._surface._tilesToRender
  var length = tilesToRender.length

  var tile
  var i

  for (i = 0; i < length; ++i) {
    tile = tilesToRender[i]
    var surfaceTile = tile.data

    if (!defined(surfaceTile)) {
      continue
    }

    var boundingVolume = surfaceTile.pickBoundingSphere
    if (mode !== SceneMode.SCENE3D) {
      BoundingSphere.fromRectangleWithHeights2D(tile.rectangle, projection, surfaceTile.minimumHeight, surfaceTile.maximumHeight, boundingVolume)
      Cartesian3.fromElements(boundingVolume.center.z, boundingVolume.center.x, boundingVolume.center.y, boundingVolume.center)
    } else {
      BoundingSphere.clone(surfaceTile.boundingSphere3D, boundingVolume)
    }

    var boundingSphereIntersection = IntersectionTests.raySphere(ray, boundingVolume, scratchSphereIntersectionResult)
    if (defined(boundingSphereIntersection)) {
      sphereIntersections.push(tile)
    }
  }

  sphereIntersections.sort(createComparePickTileFunction(ray.origin))

  var intersection
  length = sphereIntersections.length
  for (i = 0; i < length; ++i) {
    intersection = pickTriangleOnGlobeSurface.call(sphereIntersections[i].data, ray, scene.mode, scene.mapProjection, true, result)
    if (defined(intersection)) {
      intersection.tile = sphereIntersections[i]
      break
    }
  }

  return intersection
}

function createComparePickTileFunction (rayOrigin) {
  const { BoundingSphere } = Cesium
  return function (a, b) {
    var aDist = BoundingSphere.distanceSquaredTo(a.data.pickBoundingSphere, rayOrigin)
    var bDist = BoundingSphere.distanceSquaredTo(b.data.pickBoundingSphere, rayOrigin)

    return aDist - bDist
  }
}

var scratchV0 = {}
var scratchV1 = {}
var scratchV2 = {}
var scratchResult = {}

function pickTriangleOnGlobeSurface (ray, mode, projection, cullBackFaces) {
  const { defined, IntersectionTests } = Cesium
  var mesh = this.renderedMesh
  if (!defined(mesh)) {
    return undefined
  }

  var vertices = mesh.vertices
  var indices = mesh.indices
  var encoding = mesh.encoding

  var length = indices.length
  for (var i = 0; i < length; i += 3) {
    var i0 = indices[i]
    var i1 = indices[i + 1]
    var i2 = indices[i + 2]

    var v0 = getPosition(encoding, mode, projection, vertices, i0, scratchV0)
    var v1 = getPosition(encoding, mode, projection, vertices, i1, scratchV1)
    var v2 = getPosition(encoding, mode, projection, vertices, i2, scratchV2)

    var intersection = IntersectionTests.rayTriangle(ray, v0, v1, v2, cullBackFaces, scratchResult)
    if (defined(intersection)) {
      return {
        intersection: intersection,
        v0: v0,
        v1: v1,
        v2: v2
      }
    }
  }

  return undefined
};

function getPosition (encoding, mode, projection, vertices, index, result) {
  encoding.decodePosition(vertices, index, result)
  const { Cartesian3, defined, SceneMode } = Cesium
  if (defined(mode) && mode !== SceneMode.SCENE3D) {
    var ellipsoid = projection.ellipsoid
    var positionCart = ellipsoid.cartesianToCartographic(result)
    projection.project(positionCart, result)
    Cartesian3.fromElements(result.z, result.x, result.y, result)
  }

  return result
}

export default MouseCoords
