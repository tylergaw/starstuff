'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

ObjC['import']('Cocoa');

var starstuff = {};

var isFunction = function isFunction(func) {
  var getType = {};
  return func && getType.toString.call(func) === '[object Function]';
};

starstuff.setOpts = function () {
  var defaults = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return Object.assign({}, defaults, options);
};

// This is a convenience method for $.NSMakeRect. While it's not that much
// easier to type, it does allow for using the spread operator, which can't
// currently be used directly with NSMakeRect.
//
// ex:
//   var xywh = [20, 20, 200, 20];
//   startdust.makeRect(...xywh);
starstuff.makeRect = function (x, y, w, h) {
  return $.NSMakeRect(x, y, w, h);
};

starstuff.window = function (settings) {
  var opts = starstuff.setOpts({
    title: 'My Application',
    rect: [0, 0, 200, 200]
  }, settings);

  var styleMask = $.NSTitledWindowMask | $.NSClosableWindowMask | $.NSResizableWindowMask | $.NSMiniaturizableWindowMask;

  var obj = {
    // View hierarchy
    _h: [],

    append: function append(starstuffEl) {
      this._h.push(starstuffEl);

      this.el.contentView.addSubview(starstuffEl.el);
      return this;
    },

    _findById: function _findById(id) {
      var c = this.children();
      var $el = null;

      for (var i = 0; i < c.length; i += 1) {
        if (c[i].id() === id) {
          $el = c[i];
          break;
        }
      }

      return $el;
    },

    find: function find(selector) {
      var $el = null;

      if (!selector) {
        return $el;
      }

      var firstChar = selector[0];
      var isIdSelector = firstChar === '#';
      var isClassSelector = firstChar === '.';

      // Is this an ID or a class selector?
      if (isIdSelector || isClassSelector) {
        var search = selector.substr(1, selector.length);

        if (isIdSelector) {
          $el = this._findById(search);
        }
      }

      return $el;
    },

    // Return the subviews of the contentView as a JavaScript Array.
    // @return {Array}
    children: function children() {
      return this._h;
    },

    title: function title() {
      var t = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (t) {
        this.el.title = t;
        return this;
      } else {
        return this.el.title;
      }
    },

    delegate: function delegate() {
      var d = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (d) {
        this.el.delegate = d;
        return this;
      } else {
        return this.el.delegate;
      }
    },

    center: function center() {
      this.el.center;
    },

    rect: [0, 0, 400, 200],

    pos: function pos() {
      var p = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (p) {
        this.rect[0] = p.x;
        this.rect[1] = p.y;
      } else {
        return {
          x: this.rect[0],
          y: this.rect[1]
        };
      }
    },

    width: function width() {
      var w = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (w) {
        this.rect[2] = w;
        return this;
      } else {
        return this.rect[2];
      }
    },

    height: function height() {
      var h = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (h) {
        this.rect[3] = h;
        return this;
      } else {
        return this.rect[3];
      }
    },

    size: function size(w, h) {
      this.width(w);
      this.height(h);
      this.el.setFrameDisplay(starstuff.makeRect.apply(starstuff, _toConsumableArray(this.rect)), true);
      return this;
    }
  };

  obj.pos({
    x: opts.rect[0],
    y: opts.rect[1]
  });

  obj.width(opts.rect[2]);
  obj.height(opts.rect[3]);

  obj.el = $.NSWindow.alloc.initWithContentRectStyleMaskBackingDefer(starstuff.makeRect.apply(starstuff, _toConsumableArray(obj.rect)), styleMask, $.NSBackingStoreBuffered, false);

  obj.center();
  obj.el.makeKeyAndOrderFront(obj.el);

  obj.title(opts.title);

  return obj;
};

starstuff.openPanel = function (settings) {
  var opts = starstuff.setOpts({
    title: 'Open'
  }, settings);

  var obj = {
    title: function title() {
      var t = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (t) {
        this.el.title = t;
        return this;
      } else {
        return this.el.title;
      }
    },

    /**
     * @param t {Array}
     */
    allowedTypes: function allowedTypes() {
      var t = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (t) {
        // We use `$()` to convert the JS array to an NSArray
        this.el.allowedFileTypes = $(t);
        return this;
      } else {
        return this.el.allowedFileTypes;
      }
    },

    open: function open() {
      var ok = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (this.el.runModal == $.NSOKButton) {
        if (ok && isFunction(ok)) {
          // Pass back a JS Array instead of the NSArray that the openPanel
          // will return.
          ok($(this.el.URLs).js);
        }
      }
    },

    _id: null,
    id: function id() {
      var i = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (i) {
        this._id = i;
        return this;
      } else {
        return this._id;
      }
    }
  };

  obj.el = $.NSOpenPanel.openPanel;
  obj.classString = $.NSStringFromClass(obj.el['class']).js;

  obj.title(opts.title);

  if (opts.allowedTypes) {
    obj.allowedTypes(opts.allowedTypes);
  }

  if (opts.id) {
    obj.id(opts.id);
  }

  return obj;
};

starstuff.button = function (settings) {
  var opts = starstuff.setOpts({
    title: 'Button',
    rect: [25, 25, 150, 24],
    bezelStyle: $.NSRoundedBezelStyle,
    buttonType: $.NSMomentaryLightButton,
    target: null,
    action: null
  }, settings);

  var obj = {
    title: function title() {
      var t = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (t) {
        this.el.title = t;
        return this;
      } else {
        return this.el.title;
      }
    },

    bezelStyle: function bezelStyle() {
      var b = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (b) {
        this.el.bezelStyle = b;
        return this;
      } else {
        return this.el.bezelStyle;
      }
    },

    buttonType: function buttonType() {
      var b = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (b) {
        this.el.buttonType = b;
        return this;
      } else {
        return this.el.buttonType;
      }
    },

    target: function target() {
      var t = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (t) {
        this.el.target = t;
        return this;
      } else {
        return this.el.target;
      }
    },

    action: function action() {
      var a = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (a) {
        this.el.action = a;
        return this;
      } else {
        return this.el.action;
      }
    },

    _id: null,
    id: function id() {
      var i = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (i) {
        this._id = i;
        return this;
      } else {
        return this._id;
      }
    }
  };

  obj.el = $.NSButton.alloc.initWithFrame(starstuff.makeRect.apply(starstuff, _toConsumableArray(opts.rect)));
  obj.classString = $.NSStringFromClass(obj.el['class']).js;

  obj.title(opts.title);
  obj.bezelStyle(opts.bezelStyle);

  if (opts.target) {
    obj.target(opts.target);
  }

  if (opts.action) {
    obj.action(opts.action);
  }

  if (opts.id) {
    obj.id(opts.id);
  }

  return obj;
};

starstuff.textField = function (settings) {
  var opts = starstuff.setOpts({
    editable: true,
    rect: [25, 25, 200, 24]
  }, settings);

  var obj = {
    editable: function editable() {
      var b = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (b !== null) {
        this.el.editable = b;
        return this;
      } else {
        return this.el.editable;
      }
    },

    _id: null,
    id: function id() {
      var i = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (i) {
        this._id = i;
        return this;
      } else {
        return this._id;
      }
    },

    val: function val() {
      var v = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (v) {
        this.el.stringValue = v;
        return this;
      } else {
        return this.el.stringValue;
      }
    }
  };

  obj.el = $.NSTextField.alloc.initWithFrame(starstuff.makeRect.apply(starstuff, _toConsumableArray(opts.rect)));
  obj.classString = $.NSStringFromClass(obj.el['class']).js;

  if (opts.id) {
    obj.id(opts.id);
  }

  obj.editable(opts.editable);

  return obj;
};

starstuff.fieldLabel = function (settings) {
  var opts = starstuff.setOpts({
    value: 'Field label',
    rect: [25, 25, 200, 24],
    drawsBackground: false,
    bezeled: false,
    selectable: true
  }, settings);

  var obj = {
    val: function val() {
      var v = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (v) {
        this.el.stringValue = v;
        return this;
      } else {
        return this.el.stringValue;
      }
    },

    drawsBackground: function drawsBackground() {
      var b = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (b !== null) {
        this.el.drawsBackground = b;
        return this;
      } else {
        return this.el.drawsBackground;
      }
    },

    bezeled: function bezeled() {
      var b = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (b !== null) {
        this.el.bezeled = b;
        return this;
      } else {
        return this.el.bezeled;
      }
    },

    selectable: function selectable() {
      var s = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (s !== null) {
        this.el.selectable = s;
        return this;
      } else {
        return this.el.selectable;
      }
    },

    _id: null,
    id: function id() {
      var i = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (i) {
        this._id = i;
        return this;
      } else {
        return this._id;
      }
    }
  };

  obj.el = $.NSTextField.alloc.initWithFrame(starstuff.makeRect.apply(starstuff, _toConsumableArray(opts.rect)));
  obj.classString = $.NSStringFromClass(obj.el['class']).js;

  obj.val(opts.value);
  obj.drawsBackground(opts.drawsBackground);
  obj.bezeled(opts.bezeled);
  obj.selectable(opts.selectable);

  if (opts.id) {
    obj.id(opts.id);
  }

  // Since this is a fieldLabel, don't allow `editable` to be set.
  obj.el.editable = false;

  return obj;
};

starstuff.image = function (settings) {
  var opts = starstuff.setOpts({
    src: null
  }, settings);

  var obj = {
    rect: [0, 0, 0, 0],

    src: function src() {
      var s = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (s) {
        var img = s;

        // If we received a string, we need to convert it to an NSImage
        if (s.isKindOfClass($.NSString)) {
          img = $.NSImage.alloc.initByReferencingFile(s);
        }

        this.el.setImage(img);

        this.width(img.size.width).height(img.size.height).size();

        return this;
      } else {
        return this.el.image;
      }
    },

    pos: function pos() {
      var p = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (p) {
        this.rect[0] = p.x;
        this.rect[1] = p.y;
      } else {
        return {
          x: this.rect[0],
          y: this.rect[1]
        };
      }
    },

    width: function width() {
      var w = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (w) {
        this.rect[2] = w;
        return this;
      } else {
        return this.rect[2];
      }
    },

    height: function height() {
      var h = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (h) {
        this.rect[3] = h;
        return this;
      } else {
        return this.rect[3];
      }
    },

    size: function size(w, h) {
      this.el.setFrameSize({
        width: this.width(),
        height: this.height()
      });

      return this;
    },

    _id: null,
    id: function id() {
      var i = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (i) {
        this._id = i;
        return this;
      } else {
        return this._id;
      }
    }
  };

  obj.pos({
    x: opts.rect[0],
    y: opts.rect[1]
  });

  obj.el = $.NSImageView.alloc.initWithFrame(starstuff.makeRect.apply(starstuff, _toConsumableArray(obj.rect)));
  obj.classString = $.NSStringFromClass(obj.el['class']).js;

  if (opts.src) {
    obj.src(opts.src);
  }

  // If a width and/or height has been provided, those should always take
  // precedence over the width/height of any src image.
  if (opts.rect[2]) {
    obj.width(opts.rect[2]);
  }

  if (opts.rect[3]) {
    obj.height(opts.rect[3]);
  }

  if (opts.id) {
    obj.id(opts.id);
  }

  obj.size();

  return obj;
};

exports['default'] = starstuff;
module.exports = exports['default'];
