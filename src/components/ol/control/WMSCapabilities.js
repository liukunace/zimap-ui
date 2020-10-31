﻿/* 
  WMS Layer with EPSG:4326 projection.
  The tiles will be reprojected to map pojection (EPSG:3857).
  NB: reduce tileSize to minimize deformations on small scales.
*/
import ol_ext_inherits from '../util/ext'
import ol_source_TileWMS from 'ol/source/TileWMS'
import ol_layer_Tile from 'ol/layer/Tile'
import {transformExtent as ol_proj_transformExtent} from 'ol/proj'
import ol_format_WMSCapabilities from 'ol/format/WMSCapabilities'
import ol_ext_element from '../util/element'
import ol_ext_Ajax from '../util/Ajax'
import '../layer/GetPreview';
import ol_control_Button from './Button'

/** WMSCapabilities
 * @constructor
 * @param {*} options
 *  @param {string} options.proxy proxy to use when requesting Getcapabilites, default none (suppose the service use CORS)
 *  @param {string} options.placeholder input placeholder, default 'service url...'
 *  @param {string} options.title dialog title, default 'WMS'
 *  @param {string} options.searchLabel Label for search button, default 'search'
 *  @param {string} options.loadLabel Label for load button, default 'load'
 *  @param {*} options.services a key/url object of services for quick access in a menu
 *  @param {Array<string>} options.srs an array of supported srs, default map projection code or 'EPSG:3857'
 *  @param {number} options.timeout Timeout for getCapabilities request, default 1000
 *  @param {boolean} options.cors Use CORS, default false
 *  @param {boolean} options.trace Log layer info, default false
 */
var ol_control_WMSCapabilities = function (options) {
  options = Object.assign({}, options || {});
  this._proxy = options.proxy;

  this.createDialog(options);

  if (options.target===document.body) delete options.target;
  if (options.target) {
    options.className = ((options.className||'') + ' ol-wmscapabilities ol-hidden').trim();
    delete options.target;
  } else {
    options.className = ((options.className||'') + ' ol-wmscapabilities').trim();
    options.handleClick = function () {
      this.showDialog();
    }.bind(this)
  }
  ol_control_Button.call(this, options);

  // WMS options
  this.set('srs', options.srs || []);
  this.set('cors', options.cors);
  this.set('trace', options.trace);
  this.set('title', options.title);
  this.set('loadLabel', options.loadLabel);

  // Ajax request
  var parser = new ol_format_WMSCapabilities();
  this._ajax = new ol_ext_Ajax({ dataType:'text', auth: options.authentication });
  this._ajax.on('success', function (e) {
    try {
      var caps = parser.read(e.response);
      this.showCapabilitis(caps)
    } catch (e) {
      this.showError({ type: 'load', error: e });
    }
  }.bind(this));
  this._ajax.on('error', function(e) {
    this.showError({ type: 'load', error: e });
  }.bind(this));

  // Handle waiting
  this._ajax.on('loadstart', function() {
    this._elements.element.classList.add('ol-searching');
  }.bind(this));
  this._ajax.on('loadend', function() {
    this._elements.element.classList.remove('ol-searching');
  }.bind(this));
};
ol_ext_inherits(ol_control_WMSCapabilities, ol_control_Button);

/** Error list */
ol_control_WMSCapabilities.prototype.error = {
  load: 'Can\'t retrieve service capabilities, try to add it manually...',
  badUrl: 'The input value is not a valid url...',
  srs: 'The service projection looks different from that of your map, it may not display correctly...'
};

/** Form labels */
ol_control_WMSCapabilities.prototype.labels = {
  formTitle: 'Title:',
  formLayer: 'Layers:',
  formMap: 'Map:',
  formFormat: 'Format:',
  formMinZoom: 'Min zoom level:',
  formMaxZoom: 'Max zoom level:',
  formExtent: 'Extent:',
  formProjection: 'Projection:',
  formCrossOrigin: 'CrossOrigin:',
  formVersion: 'Version:'
};

/** Create dialog
 * @private
 */
ol_control_WMSCapabilities.prototype.createDialog = function (options) {
  var target = options.target;
  if (!target || target===document.body) {
    this._dialog = new ol_control_Dialog({
      className: 'ol-wmscapabilities',
      closeBox: true,
      closeOnSubmit: false,
      target: options.target
    });
    this._dialog.on('button', function(e) {
      if (e.button==='submit') {
        this.getCapabilities(e.inputs.url.value);
      }
    }.bind(this));
    target = null;
  }
  var element = ol_ext_element.create('DIV', {
    className: ('ol-wmscapabilities '+(options.className||'')).trim(),
    parent: target
  });
  this._elements = {
    element: element
  };
  var inputdiv = ol_ext_element.create('DIV', {
    className: 'ol-url',
    parent: element
  });
  var input = this._elements.input = ol_ext_element.create('INPUT', {
    className: 'url',
    placeholder: options.placeholder || 'service url...',
    parent: inputdiv
  });
  if (options.services) {
    var qaccess = ol_ext_element.create('SELECT', {
      className: 'url',
      on: {
        change: function(e) {
          console.log(e)
          var url = e.target.options[e.target.selectedIndex].value;
          this.getCapabilities(url, options);
          e.target.selectedIndex = 0;
        }.bind(this)
      },
      parent: inputdiv
    });
    ol_ext_element.create('OPTION', {
      html: ' ',
      parent: qaccess
    });
    for (var k in options.services) {
      ol_ext_element.create('OPTION', {
        html: k,
        value: options.services[k],
        parent: qaccess
      });
    }
  }
  ol_ext_element.create('BUTTON', {
    click: function() {
      this.getCapabilities(input.value, options);
    }.bind(this),
    html: options.searchLabel || 'search',
    parent: inputdiv
  });
  // Errors
  this._elements.error = ol_ext_element.create('DIV', {
    className: 'ol-error',
    parent: inputdiv
  });
  // Result div
  var rdiv = this._elements.result = ol_ext_element.create('DIV', {
    className: 'ol-result',
    parent: element
  });
  // Preview
  var preview = ol_ext_element.create('DIV', {
    className: 'ol-preview',
    html: options.previewLabel || 'preview',
    parent: rdiv
  });
  this._elements.preview = ol_ext_element.create('IMG', {
    parent: preview
  });
  // Check tainted canvas
  this._img = new Image;
  this._img.crossOrigin = 'Anonymous';
  this._img.addEventListener('error', function() {
    preview.className = 'ol-preview tainted';
  }.bind(this));
  this._img.addEventListener('load', function() {
    preview.className = 'ol-preview ok';
  }.bind(this));
  // Select list
  var select = this._elements.select = ol_ext_element.create('SELECT', {
    className: 'ol-select-list',
    size: 10,
    on: {
      change: function (e) {
        select.options[select.selectedIndex].click();
      }.bind(this)
    },
    parent: rdiv
  });
  // Info data
  this._elements.data = ol_ext_element.create('DIV', {
    className: 'ol-data',
    parent: rdiv
  });
  this._elements.buttons = ol_ext_element.create('DIV', {
    className: 'ol-buttons',
    parent: rdiv
  });
  this._elements.legend = ol_ext_element.create('IMG', {
    className: 'ol-legend',
    parent: rdiv
  });
  // WMS form
  var form = this._elements.form = ol_ext_element.create('UL', {
    className: 'ol-wmsform',
    parent: element
  });
  var addLine = function(label, val, pholder) {
    var li = ol_ext_element.create('li', {
      parent: form
    });
    ol_ext_element.create('LABEL', {
      html: this.labels[label],
      parent: li
    });
    if (typeof(val) === 'boolean') {
      this._elements[label] = ol_ext_element.create('INPUT', {
        type: 'checkbox',
        checked: val,
        parent: li
      });
    } else if (val instanceof Array) {
      var sel = this._elements[label] = ol_ext_element.create('SELECT', {
        parent: li
      });
      val.forEach(function(v) {
        ol_ext_element.create('OPTION', {
          html: v,
          value: v,
          parent: sel
        });
      }.bind(this));
    } else {
      this._elements[label] = ol_ext_element.create('INPUT', {
        value: (val===undefined ? '' : val),
        placeholder: pholder || '',
        type: typeof(val),
        parent: li
      });
    }
  }.bind(this);
  addLine('formTitle');
  addLine('formLayer', '', 'layer1,layer2,...');
  addLine('formMap');
  addLine('formFormat', ['image/png', 'image/jpeg']);
  addLine('formMinZoom', 0);
  addLine('formMaxZoom', 20);
  addLine('formExtent', '', 'xmin,ymin,xmax,ymax');
  addLine('formProjection', '');
  addLine('formCrossOrigin', false);
  addLine('formVersion', '1.3.0');

  ol_ext_element.create('BUTTON', {
    html: this.get('loadLabel') || 'Load',
    click: function() {
      var minZoom = parseInt(this._elements.formMinZoom.value);
      var maxZoom = parseInt(this._elements.formMaxZoom.value);
      var view = new ol_View({
        projection: this.getMap().getView().getProjection()
      })
      view.setZoom(minZoom);
      var maxResolution = view.getResolution();
      view.setZoom(maxZoom);
      var minResolution = view.getResolution();
      var ext;
      if (this._elements.formExtent.value) {
        this._elements.formExtent.value.split(',').forEach(function(b) {
          ext.push(parseFloat(b));
        })
        if (ext.length !== 4) ext = undefined;
      }
      var options = {
        layer: {
          title: this._elements.formTitle.value,
          extent: ext,
          maxResolution: maxResolution,
          minResolution: minResolution
        },
        source: {
          url: this._elements.input.value,
          crossOrigin: this._elements.formCrossOrigin.checked ? 'anonymous' : null,
          projection: this._elements.formProjection.value,
          params: {
            FORMAT: this._elements.formFormat.options[this._elements.formFormat.selectedIndex].value,
            LAYERS: this._elements.formLayer.value,
            VERSION: this._elements.formVersion.value
          }
        },
        data: {
          title: this._elements.formTitle.value
        }
      }
      if (this._elements.formMap.value) options.source.param.MAP = this._elements.formMap.value;
      var layer = this.getLayerFromOptions(options);
      this.dispatchEvent({ type: 'load', layer: layer, options: options });
    }.bind(this),
    parent: form
  });

  return element;
};

/** Create a new layer using options received by getOptionsFromCap method
 * @param {*} options
 */
ol_control_WMSCapabilities.prototype.getLayerFromOptions = function (options) {
  options.layer.source = new ol_source_TileWMS(options.source);
  var layer = new ol_layer_Tile(options.layer);
  delete options.layer.source;
  return layer;
};

/**
 * Set the map instance the control is associated with
 * and add its controls associated to this map.
 * @param {_ol_Map_} map The map instance.
 */
ol_control_WMSCapabilities.prototype.setMap = function (map) {
  ol_control_Button.prototype.setMap.call(this, map);
  if (this._dialog) this._dialog.setMap(map);
};

/** Show dialog for url */
ol_control_WMSCapabilities.prototype.showDialog = function(url, options) {
  if (url) this.showError();
  if (!this._elements.formProjection.value) {
    this._elements.formProjection.value = this.getMap().getView().getProjection().getCode();
  }
  this._dialog.show({
    title: this.get('title')===undefined ? 'WMS' : this.get('title'),
    content: this._elements.element
  });
  this.getCapabilities(url, options);
};

/** Get WMS capabilities for a server
 * @param {string} url service url
 * @param {*} options 
 *  @param {string} options.version WMS version, default 1.3.0
 *  @param {Number} options.timeout
 *  @param {string} options.map WMS map or get map in url?map=xxx
 *  @param {string} options.version WMS version
 */
ol_control_WMSCapabilities.prototype.getCapabilities = function(url, options) {
  if (!url) return;

  if (!/(https?:\/\/)?([\da-z\.-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/g.test(url)) {
    this.showError({
      type: 'badUrl'
    })
    return;
  }

  options = options || {};

  // Extract map attributes
  url = url.split('?');
  var search = url[1];
  url = url[0];
  var map = options.map || '';
  if (search) {
    search = search.replace(/^\?/,'').split('&');
    search.forEach(function(s) {
      console.log(s)
      s = s.split('=');
      if (/^map$/i.test(s[0])) {
        map = s[1];
        this._elements.formMap.value = map;
      }
      if (/^layers$/i.test(s[0])) {
        this._elements.formLayer.value = s[1];
      }
    }.bind(this))
  }

  // Fill form
  this._elements.input.value = (url || '') + (map ? '?map='+map : '');
  this.clearForm();

  var request = {
    SERVICE: 'WMS',
    REQUEST: 'GetCapabilities',
    VERSION: options.version || '1.3.0'
  }
  if (map) request.MAP = map;

  if (this._proxy) {
    var q = '';
    for (var r in request) q += (q?'&':'')+r+'='+request[r];
    this._ajax.send(this._proxy, {
      url: q
    }, {
      timeout: options.timeout || 10000
    });
  } else {
    this._ajax.send(url, request, {
      timeout: options.timeout || 10000
    });
  }
};

/** Display error
 * @param {*} error event
 */
ol_control_WMSCapabilities.prototype.showError = function(e) {
  if (!e) this._elements.error.innerHTML = '';
  else this._elements.error.innerHTML = this.error[e.type] || ('ERROR ('+e.type+')');
  if (e && e.type === 'load') {
    this._elements.form.classList.add('visible');
  } else {
    this._elements.form.classList.remove('visible');
  }
};

/** Clear form
 */
ol_control_WMSCapabilities.prototype.clearForm = function() {
  this._elements.result.classList.remove('ol-visible')
  this.showError();
  this._elements.select.innerHTML = '';
  this._elements.data.innerHTML = '';
  this._elements.preview.src = '';
  this._elements.legend.src = '';
};

/** Display capabilities in the dialog
 * @param {*} caps JSON capabilities
 */
ol_control_WMSCapabilities.prototype.showCapabilitis = function(caps) {
  this._elements.result.classList.add('ol-visible')
//  console.log(caps)
  var list = [];
  var addLayers = function(parent, level) {
    level = level || 0;
    parent.Layer.forEach(function(l) {
      if (!l.Attribution) l.Attribution = parent.Attribution;
      if (!l.EX_GeographicBoundingBox) l.EX_GeographicBoundingBox = parent.EX_GeographicBoundingBox;
      var li = ol_ext_element.create('OPTION', {
        className: (l.Layer ? 'ol-title ' : '') + 'level-'+level,
        html: l.Name || l.Title,
        click: function(e) {
          if (e.isTrusted) return;
          // Load layer
          var options = this.getOptionsFromCap(l, caps);
          var layer = this.getLayerFromOptions(options);
          //
          list.forEach(function(i) {
            i.classList.remove('selected');
          })
          li.classList.add('selected');
          this._elements.buttons.innerHTML = '';
          ol_ext_element.create('BUTTON', {
            html: this.get('loadLabel') || 'Load',
            click: function() {
              this.dispatchEvent({type: 'load', layer: layer, options: options });
              if (this._dialog) this._dialog.hide();
            }.bind(this),
            parent: this._elements.buttons
          });
          // Show preview
          var reso = this.getMap().getView().getResolution();
          var center = this.getMap().getView().getCenter();
          this._elements.preview.src = layer.getPreview(center, reso, this.getMap().getView().getProjection());
          this._img.src = this._elements.preview.src;
          // ShowInfo
          this._elements.data.innerHTML = '';
          ol_ext_element.create('p', {
            className: 'ol-title',
            html: options.data.title,
            parent: this._elements.data
          });
          ol_ext_element.create('p', {
            html: options.data.abstract,
            parent: this._elements.data
          });
          if (options.data.legend.length) {
            this._elements.legend.src = options.data.legend[0];
          } else {
            this._elements.legend.src = '';
          }
        }.bind(this),
        parent: this._elements.select
      });
      list.push(li);
      if (l.Layer) {
        addLayers(l, level+1);
      }
    }.bind(this));
  }.bind(this);
  this._elements.select.innerHTML = '';
  addLayers(caps.Capability.Layer);
};

/** Get resolution for a layer
 * @param {string} 'min' or 'max'
 * @param {*} layer
 * @param {number} val
 * @return {number}
 * @private
 */
ol_control_WMSCapabilities.prototype.getLayerResolution = function(m, layer, val) {
  var att = m==='min' ? 'MinScaleDenominator' : 'MaxScaleDenominator';

  if (layer[att] !== undefined) return layer[att]/(72/2.54*100);

  if (!layer.Layer) return (m==='min' ? 0 : 156543.03392804097);

  // Get min / max of contained layers
  val = (m==='min' ? 156543.03392804097 : 0);
  for (var i=0; i<layer.Layer.length; i++) {
    var res = this.getLayerResolution(m, layer.Layer[i], val);
    if (res !== undefined) val = Math[m](val, res);
  }
  return val;
};

/** Return a WMS ol.layer.Tile for the given capabilities
 * @param {*} caps layer capabilities (read from the capabilities)
 * @param {*} parent capabilities
 * @return {*} options
 */
ol_control_WMSCapabilities.prototype.getOptionsFromCap = function(caps, parent) {
  var formats = parent.Capability.Request.GetMap.Format;
  // Look for prefered format first
  var pref = [/png/,/jpeg/,/gif/];
  for (i=0; i<3; i++) {
    for (var f=0; f<formats.length; f++) {
      if (pref[i].test(formats[f])) {
        format = formats[f];
        break;
      }
    }
    if (format) break;
  }
  if (!format) format = formats[0];  

  // Check srs
  var srs = this.getMap().getView().getProjection().getCode();
  this.showError();
  var crs = false;
  if (!caps.CRS) {
    crs = false;
  } else if (caps.CRS.indexOf(srs)>=0) {
    crs = true;
  } else if (caps.CRS.indexOf('EPSG:4326')>=0) {
    // try to set EPSG:4326 instead
    srs = 'EPSG:4326';
    crs = true;
  } else {
    this.get('srs').forEach(function(s) {
      if (caps.CRS.indexOf(s)>=0) {
        srs = s;
        crs = true;
      }
    })
  }
  if (!crs) {
    this.showError({ type:'srs' });
    if (this.get('trace')) console.log('BAD srs: ', caps.CRS);
  };

  var bbox = caps.EX_GeographicBoundingBox;
  //bbox = ol_proj_transformExtent(bbox, 'EPSG:4326', srs);
  bbox = ol_proj_transformExtent(bbox, 'EPSG:4326', this.getMap().getView().getProjection());

  var attributions = [];
  if (caps.Attribution) {
    attributions.push('<a href="'+encodeURI(caps.Attribution.OnlineResource)+'">&copy; '+caps.Attribution.Title.replace(/</g,'&lt;')+'</a>');
  }

  var layer_opt = {
    title: caps.Title,
    extent: bbox,
    queryable: caps.queryable,
    abstract: caps.Abstract,
    minResolution: this.getLayerResolution('min', caps),
    maxResolution: this.getLayerResolution('max', caps) || 156543.03392804097
  };

  var source_opt = {
    url: parent.Capability.Request.GetMap.DCPType[0].HTTP.Get.OnlineResource, //parent.Service.OnlineResource,
    projection: srs,
    attributions: attributions,
    crossOrigin: this.get('cors') ? 'anonymous' : null,
    params: {
      'LAYERS': caps.Name,
      'FORMAT': format,
      'VERSION': parent.version || '1.3.0'
    }
  }

  // Trace
  if (this.get('trace')) {
    var tso = JSON.stringify([ source_opt ], null, "\t").replace(/\\"/g,'"');
    layer_opt.source = "new ol.source.TileWMS("+tso+")";
    var t = "new ol.layer.Tile (" +JSON.stringify(layer_opt, null, "\t")+ ")" 
    t = t.replace(/\\"/g,'"')
      .replace(/"new/g,'new')
      .replace(/\)"/g,')')
      .replace(/\\t/g,"\t").replace(/\\n/g,"\n")
      .replace("([\n\t","(")
      .replace("}\n])","})");
    console.log(t);
    delete layer_opt.source;
  }

  // Legend ?
  var legend = [];
    if (caps.Style) {
    caps.Style.forEach(function(s) {
      if (s.LegendURL) {
        legend.push(s.LegendURL[0].OnlineResource);
      }
    });
  }

  return ({ 
    layer: layer_opt, 
    source: source_opt,
    data: {
      title: caps.Title,
      abstract: caps.Abstract,
      logo: caps.Attribution && caps.Attribution.LogoURL ? caps.Attribution.LogoURL.OnlineResource : undefined,
      keyword: caps.KeywordList,
      legend: legend,
      opaque: caps.opaque,
      queryable: caps.queryable
    } 
  });
};

export default ol_control_WMSCapabilities
