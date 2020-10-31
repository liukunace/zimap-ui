import ol_ext_inherits from '../util/ext'
import ol_control_Control from 'ol/control/Control'
import ol_ext_element from '../util/element'
import {fromLonLat as ol_proj_fromLonLat} from 'ol/proj'

/** A control with scroll-driven navigation to create narrative maps
 *
 * @constructor
 * @extends {ol.control.Control}
 * @fires scrollto
 * @fires clickimage
 * @param {Object=} options Control options.
 *	@param {String} options.className class of the control
 *	@param {Element | string | undefined} options.html The storymap content
 *	@param {Element | string | undefined} options.target The target element to place the story. If no html is provided the content of the target will be used.
 */
var ol_control_Storymap = function(options) {
  // Remove or get target content 
  if (options.target) {
    if (!options.html) {
      options.html = options.target.innerHTML;
    } else if (options.html instanceof Element) {
      options.html = options.html.innerHTML;
    }
    options.target.innerHTML = '';
  }

  // New element
  var element = ol_ext_element.create('DIV', {
    className: (options.className || '') + ' ol-storymap'
      + (options.target ? '': ' ol-unselectable ol-control')
      + ('ontouchstart' in window ? ' ol-touch' : ''),
    html: options.html
  });
  element.querySelectorAll('.chapter').forEach(function(c) {
    c.addEventListener('click', function(e) {
      // Not moving
      if (!this.element.classList.contains('ol-move')) {
        if (!c.classList.contains('ol-select')) {
          this.element.scrollTop = c.offsetTop - 30;
          e.preventDefault();
        } else {
          if (e.target.tagName==='IMG' && e.target.dataset.title) {
            this.dispatchEvent({ 
              coordinate: this.getMap() ? this.getMap().getCoordinateFromPixel([e.layerX,e.layerY]) : null,
              type: 'clickimage', 
              img: e.target, 
              title: e.target.dataset.title, 
              element: c, 
              name: c.getAttribute('name'),
              originalEvent: e
            });
          }
        }
      }
    }.bind(this));
  }.bind(this));

  // Initialize
  ol_control_Control.call(this, {
    element: element,
    target: options.target
  });

  // Make a scroll div
  ol_ext_element.scrollDiv (this.element, {
    vertical: true,
    mousewheel: true
  });

  // Scroll to the next chapter
  var sc = this.element.querySelectorAll('.ol-scroll-next');
  sc.forEach(function(s) {
    s.addEventListener('click', function(e) { 
      if (s.parentElement.classList.contains('ol-select')) {
        var chapter = this.element.querySelectorAll('.chapter');
        var scrollto = s.offsetTop;
        for (var i=0, c; c=chapter[i]; i++) {
          if (c.offsetTop > scrollto) {
            scrollto = c.offsetTop;
            break;
          }
        }
        this.element.scrollTop = scrollto - 30;
        e.stopPropagation();
        e.preventDefault();
      }
    }.bind(this));
  }.bind(this));

  // Scroll top 
  sc = this.element.querySelectorAll('.ol-scroll-top');
  sc.forEach(function(i) {
    i.addEventListener('click', function(e){ 
      this.element.scrollTop = 0;
      e.stopPropagation();
      e.preventDefault();
    }.bind(this));
  }.bind(this));

  var getEvent = function(currentDiv) {
    var lonlat = [ parseFloat(currentDiv.getAttribute('data-lon')),
      parseFloat(currentDiv.getAttribute('data-lat'))];
    var coord = ol_proj_fromLonLat(lonlat, this.getMap().getView().getProjection());
    var zoom = parseFloat(currentDiv.getAttribute('data-zoom'));
    return { 
      type: 'scrollto', 
      element: currentDiv, 
      name: currentDiv.getAttribute('name'),
      coordinate: coord,
      lon: lonlat,
      zoom: zoom
    };
  }.bind(this);

  // Handle scrolling
  var currentDiv = this.element.querySelectorAll('.chapter')[0];
  setTimeout (function (){
    currentDiv.classList.add('ol-select');
    this.dispatchEvent(getEvent(currentDiv));
  }.bind(this));

  // Trigger change event on scroll
  this.element.addEventListener('scroll', function() {
    var current, chapter = this.element.querySelectorAll('.chapter');
    var height = ol_ext_element.getStyle(this.element, 'height');
    if (!this.element.scrollTop) {
      current = chapter[0];
    } else {
      for (var i=0, s; s=chapter[i]; i++) {
        var p = s.offsetTop - this.element.scrollTop;
        if (p > height/3) break;
        current = s;
      }
    }
    if (current && current!==currentDiv) {
      if (currentDiv) currentDiv.classList.remove('ol-select');
      currentDiv = current;
      currentDiv.classList.add('ol-select');
      var e = getEvent(currentDiv);
      var view = this.getMap().getView();
      view.cancelAnimations();
      switch (currentDiv.getAttribute('data-animation')) {
        case 'flyto': {
          // Fly to destination
          var duration = 2000;
          view.animate ({
            center: e.coordinate,
            duration: duration
          });
          view.animate ({
            zoom: Math.min(view.getZoom(), e.zoom)-1,
            duration: duration/2
          },{
            zoom: e.zoom,
            duration: duration/2
          });
          break;
        }
        default: break;
      }
      this.dispatchEvent(e);
    }
  }.bind(this));

  
};
ol_ext_inherits(ol_control_Storymap, ol_control_Control);

/** Scroll to a chapter
 * @param {string} name Name of the chapter to scroll to
 */
ol_control_Storymap.prototype.setChapter = function (name) {
  var chapter = this.element.querySelectorAll('.chapter');
  for (var i=0, s; s=chapter[i]; i++) {
    if (s.getAttribute('name')===name) {
      this.element.scrollTop = s.offsetTop - 30;
    }
  }
};

export default ol_control_Storymap