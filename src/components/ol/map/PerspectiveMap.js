/*	Copyright (c) 2019 Jean-Marc VIGLINO,
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
import ol_Map from 'ol/Map'
import {ol_ext_inherits} from '../util/ext'
import ol_ext_element from '../util/element';
import ol_Overlay from 'ol/Overlay'
import { inAndOut as ol_easing_inAndOut } from 'ol/easing'
import ol_matrix3D from '../util/matrix3D'

/** A map with a perspective
 * @constructor 
 * @extends {ol.Map}
 * @param {olx.MapOptions=} options 
 * @fires change:perspective
 */
var ol_PerspectiveMap = function(options) {

  // Map div
  var divMap = options.target instanceof Element ? options.target : document.getElementById(options.target);
  if (window.getComputedStyle(divMap).position !== 'absolute') {
    divMap.style.position = 'relative';
  }
  divMap.style.overflow = 'hidden';

  // Create map inside
  var map = ol_ext_element.create('DIV', {
    className: 'ol-perspective-map',
    parent: divMap
  });
  var opts = {};
  Object.assign(opts, options);
  opts.target = map;
  // enhance pixel ratio
  //opts.pixelRatio = 2;
  ol_Map.call (this, opts);

};
ol_ext_inherits (ol_PerspectiveMap, ol_Map);

/** Get pixel ratio for the map
 */
ol_PerspectiveMap.prototype.getPixelRatio = function(){
  return window.devicePixelRatio;
};

/** Set perspective angle
 * @param {number} angle the perspective angle 0 (vertical) - 30 (max), default 0
 * @param {*} options
 *  @param {number} options.duration The duration of the animation in milliseconds, default 500
 *  @param {function} options.easing The easing function used during the animation, defaults to ol.easing.inAndOut).
 */
ol_PerspectiveMap.prototype.setPerspective = function(angle, options) {
  options = options || {};
  // max angle
  if (angle > 30) angle = 30;
  else if (angle<0) angle = 0;
  var fromAngle = this._angle || 0;
  var toAngle = Math.round(angle);
  var style = this.getTarget().querySelector('.ol-layers').style;
  cancelAnimationFrame(this._animatedPerspective)
  requestAnimationFrame(function(t) {
    this._animatePerpective(t, t, style, fromAngle, toAngle, options.duration||500, options.easing||ol_easing_inAndOut);
  }.bind(this))
};

/** Animate the perspective
 * @param {number} t0 starting timestamp
 * @param {number} t current timestamp
 * @param {CSSStyleDeclaration} style style to modify
 * @param {number} fromAngle starting angle
 * @param {number} toAngle ending angle
 * @param {number} duration The duration of the animation in milliseconds, default 500
 * @param {function} easing The easing function used during the animation, defaults to ol.easing.inAndOut).
 * @private
 */
ol_PerspectiveMap.prototype._animatePerpective = function(t0, t, style, fromAngle, toAngle, duration, easing ) {
  var dt = (t-t0)/(duration||500);
  var end = (dt>=1);
  dt = easing(dt);
  var angle;
  if (end) {
    angle = this._angle = toAngle;
  } else {
    angle = this._angle = fromAngle + (toAngle-fromAngle)*dt;
  }
  var fac = angle/30;
  // apply transform to the style
  style.transform = 'translateY(-'+(17*fac)+'%) perspective(200px) rotateX('+angle+'deg) scaleY('+(1-fac/2)+')';
  this.getMatrix3D(true);
  this.render();
  if (!end) {
    requestAnimationFrame(function(t) {
      this._animatePerpective(t0, t, style, fromAngle, toAngle, duration||500, easing||ol_easing_inAndOut);
    }.bind(this))  
  }
  // Dispatch event
  this.dispatchEvent({
    type: 'change:perspective', 
    angle: angle,
    animating: !end
  });
};

/** Convert to pixel coord according to the perspective
 * @param {MapBrowserEvent} mapBrowserEvent The event to handle.
 */
ol_PerspectiveMap.prototype.handleMapBrowserEvent = function(e) {
  e.pixel = [
    e.originalEvent.offsetX / this.getPixelRatio(), 
    e.originalEvent.offsetY / this.getPixelRatio()
  ];
  e.coordinate = this.getCoordinateFromPixel(e.pixel);
  ol_Map.prototype.handleMapBrowserEvent.call (this, e);
};

/** Get map full teansform matrix3D
 * @return {Array<Array<number>>} 
 */
ol_PerspectiveMap.prototype.getMatrix3D = function (compute) {
  if (compute) {
    var ele = this.getTarget().querySelector('.ol-layers');
    
    // Get transform matrix3D from CSS
    var tx = ol_matrix3D.getTransform(ele);
    
    // Get the CSS transform origin from the transformed parent - default is '50% 50%'
    var txOrigin = ol_matrix3D.getTransformOrigin(ele);
    
    // Compute the full transform that is applied to the transformed parent (-origin * tx * origin)
    this._matrixTransform = ol_matrix3D.computeTransformMatrix(tx, txOrigin);
  }
  if (!this._matrixTransform) this._matrixTransform = ol_matrix3D.identity();
  return this._matrixTransform;
};

/** Get pixel at screen from coordinate.
 * The default getPixelFromCoordinate get pixel in the perspective.
 * @param {ol.coordinate} coord
 * @param {ol.pixel} 
 */
ol_PerspectiveMap.prototype.getPixelScreenFromCoordinate = function (coord) {
  // Get pixel in the transform system
  var px = this.getPixelFromCoordinate(coord);

  // Get transform matrix3D from CSS
  var fullTx = this.getMatrix3D();

  // Transform the point using full transform
  var pixel = ol_matrix3D.transformVertex(fullTx, px);
  // Perform the homogeneous divide to apply perspective to the points (divide x,y,z by the w component).
  pixel = ol_matrix3D.projectVertex(pixel);

  return [pixel[0], pixel[1]];
};

/** Not working...
 * 
 */
ol_PerspectiveMap.prototype.getPixelFromPixelScreen = function (px) {
  // Get transform matrix3D from CSS
  var fullTx = ol_matrix3D.inverse(this.getMatrix3D());

  // Transform the point using full transform
  var pixel = ol_matrix3D.transformVertex(fullTx, px);
  // Perform the homogeneous divide to apply perspective to the points (divide x,y,z by the w component).
  pixel = ol_matrix3D.projectVertex(pixel);

  return [pixel[0], pixel[1]];  
};


/* Overwrited Overlay function to handle overlay positing in a perspective map */
(function() {
var _updatePixelPosition = ol_Overlay.prototype.updatePixelPosition;

/** Update pixel projection in a perspective map (apply projection to the position)
 * @private
 */
ol_Overlay.prototype.updatePixelPosition = function () {
  var map = this.getMap();
  if (map && map instanceof ol_PerspectiveMap) {
    var position = this.getPosition();
    if (!map || !map.isRendered() || !position) {
      this.setVisible(false);
      return;
    }
    // Get pixel at screen
    var pixel = map.getPixelScreenFromCoordinate(position);
    var mapSize = map.getSize();
    // Offset according poqsitioning
    var pos = this.getPositioning();
    if (/bottom/.test(pos)) {
      pixel[1] += mapSize[1]/4
    } else {
      pixel[1] -= mapSize[1]/4
    }
    if (/right/.test(pos)) {
      pixel[0] += mapSize[0]/4
    } else {
      pixel[0] -= mapSize[0]/4
    }
    // Update
    this.updateRenderedPosition(pixel , mapSize);
  } else {
    _updatePixelPosition.call(this);
  }
};

})();

export default ol_PerspectiveMap
