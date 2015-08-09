ObjC.import('Cocoa');

var starstuff = {};

let isFunction = function(func) {
  var getType = {};
  return func && getType.toString.call(func) === '[object Function]';
}

starstuff.setOpts = function(defaults = {}, options = {}) {
  return Object.assign({}, defaults, options);
};

// This is a convenience method for $.NSMakeRect. While it's not that much
// easier to type, it does allow for using the spread operator, which can't
// currently be used directly with NSMakeRect.
//
// ex:
//   var xywh = [20, 20, 200, 20];
//   startdust.makeRect(...xywh);
starstuff.makeRect = function(x, y, w, h) {
  return $.NSMakeRect(x, y, w, h);
};

starstuff.window = function(settings) {
  let opts = starstuff.setOpts({
    title: 'My Application',
    rect: [0, 0, 200, 200]
  }, settings);

  let styleMask = $.NSTitledWindowMask | $.NSClosableWindowMask |
    $.NSResizableWindowMask | $.NSMiniaturizableWindowMask;

  let obj = {
    // View hierarchy
    _h: [],

    append(starstuffEl) {
      this._h.push(starstuffEl);

      this.el.contentView.addSubview(starstuffEl.el);
      return this;
    },

    _findById(id) {
      let c = this.children();
      let $el = null;

      for (let i = 0; i < c.length; i += 1) {
        if (c[i].id() === id) {
          $el = c[i];
          break;
        }
      }

      return $el;
    },

    find(selector) {
      let $el = null;

      if (!selector) {
        return $el;
      }

      let firstChar = selector[0];
      let isIdSelector = (firstChar === '#');
      let isClassSelector = (firstChar === '.');

      // Is this an ID or a class selector?
      if (isIdSelector || isClassSelector) {
        let search = selector.substr(1, selector.length);

        if (isIdSelector) {
          $el = this._findById(search);
        }
      }

      return $el;
    },

    // Return the subviews of the contentView as a JavaScript Array.
    // @return {Array}
    children() {
      return this._h;
    },

    title(t = null) {
      if (t) {
        this.el.title = t;
        return this;
      } else {
        return this.el.title;
      }
    },

    delegate(d = null) {
      if (d) {
        this.el.delegate = d;
        return this;
      } else {
        return this.el.delegate;
      }
    },

    center() {
      this.el.center;
    },

    rect: [0, 0, 400, 200],

    pos(p = null) {
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

    width(w = null) {
      if (w) {
        this.rect[2] = w;
        return this;
      } else {
        return this.rect[2];
      }
    },

    height(h = null) {
      if (h) {
        this.rect[3] = h;
        return this;
      } else {
        return this.rect[3];
      }
    },

    size(w, h) {
      this.width(w);
      this.height(h);
      this.el.setFrameDisplay(
        starstuff.makeRect(...this.rect),
        true
      );
      return this;
    }
  };

  obj.pos({
    x: opts.rect[0],
    y: opts.rect[1]
  });

  obj.width(opts.rect[2]);
  obj.height(opts.rect[3]);

  obj.el = $.NSWindow.alloc.initWithContentRectStyleMaskBackingDefer(
    starstuff.makeRect(...obj.rect),
    styleMask,
    $.NSBackingStoreBuffered,
    false
  );

  obj.center();
  obj.el.makeKeyAndOrderFront(obj.el);

  obj.title(opts.title);

  return obj;
};

starstuff.openPanel = function(settings) {
  let opts = starstuff.setOpts({
    title: 'Open'
  }, settings);

  let obj = {
    title (t = null) {
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
    allowedTypes (t = null) {
      if (t) {
        // We use `$()` to convert the JS array to an NSArray
        this.el.allowedFileTypes = $(t);
        return this;
      } else {
        return this.el.allowedFileTypes;
      }
    },

    open (ok = null) {
      if (this.el.runModal == $.NSOKButton) {
        if (ok && isFunction(ok)) {
          // Pass back a JS Array instead of the NSArray that the openPanel
          // will return.
          ok($(this.el.URLs).js);
        }
      }
    },

    _id: null,
    id(i = null) {
      if (i) {
        this._id = i;
        return this;
      } else {
        return this._id;
      }
    }
  };

  obj.el = $.NSOpenPanel.openPanel;
  obj.classString = $.NSStringFromClass(obj.el.class).js;

  obj.title(opts.title);

  if (opts.allowedTypes) {
    obj.allowedTypes(opts.allowedTypes);
  }

  if (opts.id) {
    obj.id(opts.id);
  }

  return obj;
};

starstuff.button = function(settings) {
  let opts = starstuff.setOpts({
    title: 'Button',
    rect: [25, 25, 150, 24],
    bezelStyle: $.NSRoundedBezelStyle,
    buttonType: $.NSMomentaryLightButton,
    target: null,
    action: null
  }, settings);

  let obj = {
    title(t = null) {
      if (t) {
        this.el.title = t;
        return this;
      } else {
        return this.el.title;
      }
    },

    bezelStyle(b = null) {
      if (b) {
        this.el.bezelStyle = b;
        return this;
      } else {
        return this.el.bezelStyle;
      }
    },

    buttonType(b = null) {
      if (b) {
        this.el.buttonType = b;
        return this;
      } else {
        return this.el.buttonType;
      }
    },

    target(t = null) {
      if (t) {
        this.el.target = t;
        return this;
      } else {
        return this.el.target;
      }
    },

    action(a = null) {
      if (a) {
        this.el.action = a;
        return this;
      } else {
        return this.el.action;
      }
    },

    _id: null,
    id(i = null) {
      if (i) {
        this._id = i;
        return this;
      } else {
        return this._id;
      }
    }
  };

  obj.el = $.NSButton.alloc.initWithFrame(starstuff.makeRect(...opts.rect));
  obj.classString = $.NSStringFromClass(obj.el.class).js;

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

starstuff.textField = function(settings) {
  let opts = starstuff.setOpts({
    editable: true,
    rect: [25, 25, 200, 24]
  }, settings);

  let obj = {
    editable (b = null) {
      if (b !== null) {
        this.el.editable = b;
        return this;
      } else {
        return this.el.editable;
      }
    },

    _id: null,
    id(i = null) {
      if (i) {
        this._id = i;
        return this;
      } else {
        return this._id;
      }
    },

    val (v = null) {
      if (v) {
        this.el.stringValue = v;
        return this;
      } else {
        return this.el.stringValue;
      }
    },
  };

  obj.el = $.NSTextField.alloc.initWithFrame(starstuff.makeRect(...opts.rect));
  obj.classString = $.NSStringFromClass(obj.el.class).js;

  if (opts.id) {
    obj.id(opts.id);
  }

  obj.editable(opts.editable);

  return obj;
};

starstuff.fieldLabel = function(settings) {
  let opts = starstuff.setOpts({
    value: 'Field label',
    rect: [25, 25, 200, 24],
    drawsBackground: false,
    bezeled: false,
    selectable: true
  }, settings);

  let obj = {
    val (v = null) {
      if (v) {
        this.el.stringValue = v;
        return this;
      } else {
        return this.el.stringValue;
      }
    },

    drawsBackground (b = null) {
      if (b !== null) {
        this.el.drawsBackground = b;
        return this;
      } else {
        return this.el.drawsBackground;
      }
    },

    bezeled (b = null) {
      if (b !== null) {
        this.el.bezeled = b;
        return this;
      } else {
        return this.el.bezeled;
      }
    },

    selectable (s = null) {
      if (s !== null) {
        this.el.selectable = s;
        return this;
      } else {
        return this.el.selectable;
      }
    },

    _id: null,
    id(i = null) {
      if (i) {
        this._id = i;
        return this;
      } else {
        return this._id;
      }
    }
  };

  obj.el = $.NSTextField.alloc.initWithFrame(starstuff.makeRect(...opts.rect));
  obj.classString = $.NSStringFromClass(obj.el.class).js;

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

starstuff.image = function(settings) {
  let opts = starstuff.setOpts({
    src: null
  }, settings);

  let obj = {
    rect: [0, 0, 0, 0],

    src(s = null) {
      if (s) {
        let img = s;

        // If we received a string, we need to convert it to an NSImage
        if (s.isKindOfClass($.NSString)) {
          img = $.NSImage.alloc.initByReferencingFile(s);
        }

        this.el.setImage(img);

        this.width(img.size.width)
          .height(img.size.height)
          .size();

        return this;
      } else {
        return this.el.image;
      }
    },

    pos(p = null) {
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

    width(w = null) {
      if (w) {
        this.rect[2] = w;
        return this;
      } else {
        return this.rect[2];
      }
    },

    height(h = null) {
      if (h) {
        this.rect[3] = h;
        return this;
      } else {
        return this.rect[3];
      }
    },

    size(w, h) {
      this.el.setFrameSize({
        width: this.width(),
        height: this.height()
      })

      return this;
    },

    _id: null,
    id(i = null) {
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

  obj.el = $.NSImageView.alloc.initWithFrame(starstuff.makeRect(...obj.rect));
  obj.classString = $.NSStringFromClass(obj.el.class).js;

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

export default starstuff;
