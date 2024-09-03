function formatValue(val) {
  return typeof val === 'string' ? val : `${val}px`;
}
/**
* 创造 [CSS-font](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font) 字符串
* 由于 canvas 绘制的差异性部分属性不生效故舍弃
*/
function createCanvasFontString({ fontFamily, fontSize, fontStyle = 'normal', fontWeight = 'normal', }) {
  const _fontSize = typeof fontSize === 'string' ? fontSize : `${fontSize}px`;
  return `${fontStyle} ${fontWeight} ${_fontSize} ${fontFamily}`;
}
function calcMin(numbers) {
  return numbers.reduce((a, b) => {
      return a < b ? a : b;
  });
}
function calcMax(numbers) {
  return numbers.reduce((a, b) => {
      return a > b ? a : b;
  });
}
/**
* 计算差异
* @param numbers
*/
function calcDiff(numbers) {
  return calcMax(numbers) - calcMin(numbers);
}
/**
* 确保输入值在 min 和 max 之间，若超出边界则返回边界
* @param input
* @param min
* @param max
*/
function ensureBetween(input, min = 0, max = 1) {
  return input <= min ? min : input >= max ? max : input;
}
// export function toPoint(point: PointObject | number): PointObject {
//   let x = 0
//   let y = 0
//   if (typeof point !== 'undefined') {
//     if (typeof point === 'object') {
//       x = point.x
//       y = point.y
//     }
//     else {
//       x = y = point
//     }
//   }
//   return { x, y }
// }
// // 计算变换后的矩形实际大小
// export function getTransformedRectSize(
//   transform: [number, number, number, number, number, number],
//   bounds: Bounds,
// ) {
//   const [scaleX, skewX, skewY, scaleY, translateX, translateY] = transform
//   // const [1, 0.5, 0.5, 1, 0, 0] = transform
//   const x = bounds.start.x
//   const y = bounds.start.y
//   const width = bounds.width
//   const height = bounds.height
//   // 矩形四个角的坐标
//   const corners: IPoint[] = [
//     { x, y },
//     { x: x + width, y },
//     { x: x + width, y: y + height },
//     { x, y: y + height },
//   ]
//   // 变换后的角点坐标
//   const transformedCorners = corners.map(({ x: cx, y: cy }) => {
//     return {
//       x: scaleX * cx + skewY * cy + translateX,
//       y: skewX * cx + scaleY * cy + translateY,
//     }
//   })
//   // 计算变换后的矩形宽度和高度
//   const xValues = transformedCorners.map(corner => corner.x)
//   const yValues = transformedCorners.map(corner => corner.y)
//   const minX = Math.min(...xValues)
//   const maxX = Math.max(...xValues)
//   const minY = Math.min(...yValues)
//   const maxY = Math.max(...yValues)
//   return {
//     width: maxX - minX,
//     height: maxY - minY,
//   }
// }
// export function calculateEllipseRadii(rx: number, ry: number, a: number, b: number, c: number, d: number): { newRx: number, newRy: number } {
//   const newRx = Math.sqrt((a * rx) ** 2 + (b * ry) ** 2)
//   const newRy = Math.sqrt((c * rx) ** 2 + (d * ry) ** 2)
//   return { newRx, newRy }
// }
// const originalRadius = 50
// const transformMatrix = [1, 0.8, 0.2, 1] as const
// const { newRx, newRy } = calculateEllipseRadii(originalRadius, originalRadius, ...transformMatrix)
// console.log(`Transformed ellipse radii: Rx = ${newRx}, Ry = ${newRy}`)
function createProxy(value, cb) {
  return new Proxy(value, {
      set: (target, property, newValue) => {
          target[property] = newValue;
          cb?.(property, newValue);
          return true;
      },
  });
}

function getDefaultExportFromCjs (x) {
return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var eventemitter3 = {exports: {}};

(function (module) {

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
{
  module.exports = EventEmitter;
} 
} (eventemitter3));

var eventemitter3Exports = eventemitter3.exports;
var EventEmitter = /*@__PURE__*/getDefaultExportFromCjs(eventemitter3Exports);

class ObservablePoint {
  _x;
  _y;
  _observer;
  constructor(observer, x, y) {
      this._x = x || 0;
      this._y = y || 0;
      this._observer = observer;
  }
  clone(observer) {
      return new ObservablePoint(observer ?? this._observer, this._x, this._y);
  }
  set(x = 0, y = x) {
      if (this._x !== x || this._y !== y) {
          this._x = x;
          this._y = y;
          this._observer?._onUpdate(this);
      }
      return this;
  }
  copyFrom(p) {
      if (this._x !== p.x || this._y !== p.y) {
          this._x = p.x;
          this._y = p.y;
          this._observer?._onUpdate(this);
      }
      return this;
  }
  copyTo(p) {
      p.set(this._x, this._y);
      return p;
  }
  equals(p) {
      return (p.x === this._x) && (p.y === this._y);
  }
  get x() {
      return this._x;
  }
  set x(value) {
      if (this._x !== value) {
          this._x = value;
          this._observer?._onUpdate(this);
      }
  }
  get y() {
      return this._y;
  }
  set y(value) {
      if (this._y !== value) {
          this._y = value;
          this._observer?._onUpdate(this);
      }
  }
  [Symbol.iterator]() {
      let step = 0;
      const properties = [this.x, this.y];
      return {
          next: () => {
              if (step < properties.length) {
                  return { value: properties[step++], done: false };
              }
              else {
                  return { done: true, value: undefined };
              }
          },
      };
  }
}

const defaultSkew = new ObservablePoint(null);
const defaultPivot = new ObservablePoint(null);
const defaultAnchor = new ObservablePoint(null);
const defaultScale = new ObservablePoint(null, 1, 1);
class Display extends EventEmitter {
  constructor(options = {}) {
      super();
      this.visible = options.visible ?? true;
      if (options.position) {
          this.position = options.position;
      }
      else {
          this.x = options.x ?? 0;
          this.y = options.y ?? 0;
      }
      if (options.scale) {
          this.scale = options.scale;
      }
      if (options.skew) {
          this.skew = options.skew;
      }
      if (options.pivot) {
          this.pivot = options.pivot;
      }
      if (options.shadow) {
          this.shadow = options.shadow;
      }
      if (options.anchor) {
          this.anchor = options.anchor;
      }
      if (options.rotation) {
          this.rotation = options.rotation;
      }
  }
  /**
   * 更新优化
   */
  get __shouldUpdate() {
      return !(!this.visible
          || this.scale.x === 0
          || this.scale.y === 0
          || this.alpha === 0);
  }
  get shouldUpdate() {
      return this.__shouldUpdate && this._shouldUpdate;
  }
  _dirty = false;
  set dirty(value) {
      if (this._dirty === value)
          return;
      this._dirty = value;
  }
  get dirty() {
      return this._dirty;
  }
  set x(value) {
      if (this.x !== value) {
          this.position.x = value;
      }
  }
  get x() {
      return this.position.x;
  }
  set y(value) {
      if (this.y !== value) {
          this.position.y = value;
      }
  }
  get y() {
      return this.position.y;
  }
  _position = new ObservablePoint(this, 0, 0);
  set position(value) {
      if (this.position !== value) {
          this._position.copyFrom(value);
      }
  }
  get position() {
      return this._position;
  }
  _scale = defaultScale;
  set scale(value) {
      if (this._scale === defaultScale) {
          this._scale = new ObservablePoint(this, 1, 1);
      }
      if (typeof value === 'number') {
          this._scale.set(value);
      }
      else {
          this._scale.copyFrom(value);
      }
  }
  get scale() {
      if (this._scale === defaultScale) {
          this._scale = new ObservablePoint(this, 1, 1);
      }
      return this._scale;
  }
  _skew = defaultSkew;
  set skew(value) {
      if (this._skew === defaultSkew) {
          this._skew = new ObservablePoint(this);
      }
      this._skew.copyFrom(value);
  }
  get skew() {
      if (this._skew === defaultSkew) {
          this._skew = new ObservablePoint(this, 0, 0);
      }
      return this._skew;
  }
  _alpha = 1;
  set alpha(value) {
      if (this.alpha !== value) {
          this._alpha = value;
          this._onUpdate();
      }
  }
  get alpha() {
      return this._alpha;
  }
  _rotation = 0;
  set rotation(value) {
      if (this.rotation !== value) {
          this._rotation = value;
          this._onUpdate();
      }
  }
  get rotation() {
      return this._rotation;
  }
  _anchor = defaultAnchor;
  set anchor(value) {
      if (this._anchor === defaultAnchor) {
          this._anchor = new ObservablePoint(this, 0, 0);
      }
      if (typeof value === 'number') {
          this._anchor.set(value);
      }
      else {
          this._anchor.copyFrom(value);
      }
  }
  get anchor() {
      if (this._anchor === defaultAnchor) {
          this._anchor = new ObservablePoint(this);
      }
      return this._anchor;
  }
  _pivot = defaultPivot;
  set pivot(value) {
      if (this._pivot === defaultPivot) {
          this._pivot = new ObservablePoint(this, 0, 0);
      }
      if (typeof value === 'number') {
          this._pivot.set(value);
      }
      else {
          this._pivot.copyFrom(value);
      }
  }
  get pivot() {
      if (this._pivot === defaultPivot) {
          this._pivot = new ObservablePoint(this);
      }
      return this._pivot;
  }
  _shadow = { x: 0, y: 0 };
  set shadow(value) {
      if (value === this._shadow)
          return;
      if (value) {
          this._shadow = createProxy(value, () => {
              this._onUpdate();
          });
          this._onUpdate();
      }
  }
  get shadow() {
      return this._shadow;
  }
  _onUpdate(_point) {
      this.dirty = true;
  }
  _app = null;
  // abstract style: BaseStyle
  _visible = true;
  get visible() {
      return this._visible;
  }
  set visible(value) {
      this._visible = value;
      this._onUpdate();
  }
  _shouldUpdateBounds = true;
  shouldUpdateBounds() {
      this._shouldUpdateBounds = true;
  }
  _baseRender(ctx) {
      if ((this.shadow?.x || this.shadow?.y)
          && (this.shadow?.blur || this.shadow?.color)) {
          if (this.shadow.color) {
              ctx.shadowColor = this.shadow.color;
          }
          if (this.shadow.blur) {
              ctx.shadowBlur = this.shadow.blur;
          }
          if (this.shadow.x) {
              ctx.shadowOffsetX = this.shadow.x;
          }
          if (this.shadow.y) {
              ctx.shadowOffsetY = this.shadow.y;
          }
      }
  }
  render(ctx) {
      if (this._shouldUpdateBounds) {
          this.updateTransformBounds();
          this._shouldUpdateBounds = false;
      }
      if (this.alpha !== 1) {
          ctx.globalAlpha = this.alpha;
      }
      const dpr = this._app?.dpr ?? 1;
      const scaleX = this.scale.x * dpr;
      const scaleY = this.scale.y * dpr;
      const skewX = this.skew.x;
      const skewY = this.skew.y;
      const positionX = this.position.x * dpr;
      const positionY = this.position.y * dpr;
      const pivotX = this.pivot.x;
      const pivotY = this.pivot.y;
      const rotation = this.rotation;
      // Calculate rotation matrix components
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      const anchorX = ensureBetween(this.anchor.x, 0, 1);
      const anchorY = ensureBetween(this.anchor.y, 0, 1);
      const originX = this.transformWidth * anchorX;
      const originY = this.transformHeight * anchorY;
      const dx = positionX - (pivotX + originX) * cos * scaleX + (pivotY + originY) * sin * scaleY;
      const dy = positionY - (pivotX + originX) * sin * scaleX - (pivotY + originY) * cos * scaleY;
      ctx.setTransform(scaleX * cos + skewY * -sin, // a
      scaleX * sin + skewY * cos, // b
      skewX * cos + scaleY * -sin, // c
      skewX * sin + scaleY * cos, // d
      dx, // e
      dy);
      const _position = this.position.clone();
      this.position.set(0);
      this._baseRender(ctx);
      this._render(ctx);
      this.position = _position;
      ctx.resetTransform();
  }
  _renderId = 0;
  onAdd(_app) {
      this._app = _app;
      this._onUpdate();
  }
  onRemove() {
      this._app = null;
      this._onUpdate();
  }
  destroy() {
      this.removeAllListeners();
  }
}

class Shape extends Display {
  constructor(options = {}) {
      super(options);
      this.emit('ready');
      this._onUpdate();
  }
  addPath(...items) {
      this.pathInstruction.push(...items);
      this.shouldUpdateBounds();
  }
  // CanvasRenderingContext2DMethods
  beginPath() {
      this.addPath({
          action: 'beginPath',
          args: [],
      });
      return this;
  }
  closePath() {
      this.addPath({
          action: 'closePath',
          args: [],
      });
      return this;
  }
  moveTo(...args) {
      this.addPath({
          action: 'moveTo',
          args: [...args],
      });
      return this;
  }
  lineTo(...args) {
      this.addPath({
          action: 'lineTo',
          args: [...args],
      });
      return this;
  }
  rect(...args) {
      this.addPath({
          action: 'rect',
          args: [...args],
      });
      return this;
  }
  roundRect(...args) {
      this.addPath({
          action: 'roundRect',
          args: [...args],
      });
      return this;
  }
  arc(...args) {
      this.addPath({
          action: 'arc',
          args: [...args],
      });
      return this;
  }
  arcTo(...args) {
      this.addPath({
          action: 'arcTo',
          args: [...args],
      });
      return this;
  }
  bezierCurveTo(...args) {
      this.addPath({
          action: 'bezierCurveTo',
          args: [...args],
      });
      return this;
  }
  ellipse(...args) {
      this.addPath({
          action: 'ellipse',
          args: [...args],
      });
      return this;
  }
  fillRect(...args) {
      this.addPath({
          action: 'fillRect',
          args: [...args],
      });
      return this;
  }
  strokeRect(...args) {
      this.addPath({
          action: 'strokeRect',
          args: [...args],
      });
      return this;
  }
  pathInstruction = [];
  get _shouldUpdate() {
      const actions = this.pathInstruction.map(item => item.action);
      if (actions.includes('fill')
          || actions.includes('stroke')) {
          return true;
      }
      return false;
  }
  _render(_ctx) {
      if (!_ctx) {
          throw new Error('CanvasRenderingContext2D is null or undefined');
      }
      for (let index = 0; index < this.pathInstruction.length; index++) {
          const { action, args } = this.pathInstruction[index];
          if (action === 'fill') {
              if (args[0]) {
                  _ctx.fillStyle = args[0];
              }
              else if (this.fillStyle) {
                  _ctx.fillStyle = this.fillStyle;
              }
              _ctx.fill();
          }
          else if (action === 'stroke') {
              if (args[0]) {
                  const strokeInput = args[0];
                  if (typeof strokeInput === 'string'
                      || strokeInput instanceof CanvasGradient
                      || strokeInput instanceof CanvasPattern) {
                      _ctx.strokeStyle = strokeInput;
                      _ctx.lineWidth = this.strokeStyle.width ?? 1;
                  }
                  else {
                      const color = strokeInput.color ?? this.strokeStyle.color;
                      if (color)
                          _ctx.strokeStyle = color;
                      const width = strokeInput.width ?? this.strokeStyle.width;
                      if (width)
                          _ctx.lineWidth = width;
                      if (strokeInput.dash) {
                          _ctx.setLineDash(strokeInput.dash);
                      }
                      else {
                          _ctx.setLineDash([]);
                      }
                  }
              }
              else {
                  if (this.strokeStyle.color)
                      _ctx.strokeStyle = this.strokeStyle.color;
                  if (this.strokeStyle.width)
                      _ctx.lineWidth = this.strokeStyle.width;
                  if (this.strokeStyle.dash) {
                      _ctx.setLineDash(this.strokeStyle.dash);
                  }
                  else {
                      _ctx.setLineDash([]);
                  }
              }
              _ctx.stroke();
          }
          else {
              _ctx[action](...args);
          }
      }
  }
  _strokeStyle = {};
  set strokeStyle(value) {
      if (value === this._strokeStyle)
          return;
      if (typeof value === 'string'
          || value instanceof CanvasGradient
          || value instanceof CanvasPattern) {
          this._strokeStyle = createProxy({
              ...this._strokeStyle,
              color: value,
          }, () => {
              this._onUpdate();
          });
      }
      else {
          this._strokeStyle = createProxy(value, () => {
              this._onUpdate();
          });
          this._onUpdate();
      }
  }
  get strokeStyle() {
      return this._strokeStyle;
  }
  transformWidth = 0;
  transformHeight = 0;
  updateTransformBounds() {
      // 所有坐标的最大值放进来
      const allX = [];
      const allY = [];
      for (let index = 0; index < this.pathInstruction.length; index++) {
          const { action, args } = this.pathInstruction[index];
          switch (action) {
              case 'lineTo':
                  allX.push(args[0]);
                  allY.push(args[1]);
                  break;
              case 'fillRect':
              case 'strokeRect':
              case 'roundRect':
              case 'rect': {
                  let strokeWeight = 0;
                  if (action === 'strokeRect') {
                      strokeWeight = this.strokeStyle.width ?? 1;
                  }
                  allX.push(args[0] + args[2] + strokeWeight);
                  allY.push(args[1] + args[2] + strokeWeight);
                  break;
              }
              case 'arc':
                  allX.push(args[0] + args[2]);
                  allY.push(args[1] + args[2]);
                  break;
              case 'arcTo':
                  allX.push(args[0] + args[2]);
                  allY.push(args[1] + args[2]);
                  break;
              case 'bezierCurveTo':
                  allX.push(args[2] + args[4]);
                  allY.push(args[3] + args[5]);
                  break;
              case 'ellipse':
                  allX.push(args[0] + args[2]);
                  allY.push(args[1] + args[3]);
          }
      }
      this.transformWidth = calcDiff(allX);
      this.transformHeight = calcDiff(allY);
  }
  _fillStyle = null;
  set fillStyle(value) {
      this._fillStyle = value;
      this._onUpdate();
  }
  get fillStyle() {
      return this._fillStyle;
  }
  fill(color) {
      if (color) {
          this.addPath({
              action: 'fill',
              args: [color],
          });
      }
      return this;
  }
  stroke(value) {
      this.addPath({
          action: 'stroke',
          args: value ? [value] : [],
      });
      return this;
  }
  _filter = 'none';
  set filter(value) {
      this._filter = value;
      this._onUpdate();
  }
  get filter() {
      return this._filter;
  }
}

class AbstractStyle extends EventEmitter {
  // private _strokeWeight = 0
  // set strokeWeight(value) {
  //   this._strokeWeight = value
  //   this.update()
  // }
  // get strokeWeight() {
  //   return this._strokeWeight
  // }
  _fill = '#000';
  set fill(value) {
      this._fill = value;
      this.update();
  }
  get fill() {
      return this._fill;
  }
  _stroke = {};
  set stroke(value) {
      if (value === this._stroke)
          return;
      if (typeof value === 'string'
          || value instanceof CanvasGradient
          || value instanceof CanvasPattern) {
          this._stroke = createProxy({
              ...this._stroke,
              color: value,
          }, () => {
              this.update();
          });
      }
      else {
          this._stroke = createProxy(value, () => {
              this.update();
          });
          this.update();
      }
  }
  get stroke() {
      return this._stroke;
  }
  _filter = 'none';
  set filter(value) {
      this._filter = value;
      this.update();
  }
  get filter() {
      return this._filter;
  }
  update() {
      this.emit('update');
  }
  updateBounds() {
      this.emit('updateBounds');
  }
  render(ctx) {
      if (this.stroke.color && this.stroke.width) {
          ctx.lineWidth = this.stroke.width;
          ctx.strokeStyle = this.stroke.color;
      }
      if (this.fill) {
          ctx.fillStyle = this.fill;
      }
      if (this.filter) {
          ctx.filter = this.filter;
      }
      return this;
  }
  destroy() {
      this.removeAllListeners();
  }
}

class TextStyle extends AbstractStyle {
  static defaultTextStyle = {
      fill: 'black',
      stroke: {
          width: 1,
      },
      fontFamily: 'Arial',
      fontSize: 12,
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontStretch: 'condensed',
      fontVariantCaps: 'normal',
      letterSpacing: 0,
      wordSpacing: 0,
      textAlign: 'left',
      filter: 'none',
      lineHeight: 0,
      wordWrap: false,
      wordWrapWidth: 0,
  };
  _isStroke;
  constructor(style = {}) {
      super();
      this._isStroke = !!style.stroke;
      const fullStyle = Object.assign({}, TextStyle.defaultTextStyle, style);
      for (const key in fullStyle) {
          const thisKey = key;
          const data = fullStyle[key];
          if (key === 'stroke') {
              this[thisKey] = Object.assign({}, TextStyle.defaultTextStyle[key], data);
          }
          else {
              this[thisKey] = data;
          }
      }
  }
  reset() {
      const defaultStyle = TextStyle.defaultTextStyle;
      for (const key in defaultStyle) {
          this[key] = defaultStyle[key];
      }
      this.updateBounds();
      this.update();
  }
  textBaseline = 'top';
  _fontSize;
  set fontSize(value) {
      this._fontSize = value;
      this.updateBounds();
      this.update();
  }
  get fontSize() {
      return this._fontSize;
  }
  _fontFamily;
  set fontFamily(value) {
      this._fontFamily = value;
      this.updateBounds();
      this.update();
  }
  get fontFamily() {
      return this._fontFamily;
  }
  _fontStyle;
  set fontStyle(value) {
      this._fontStyle = value;
      this.updateBounds();
      this.update();
  }
  get fontStyle() {
      return this._fontStyle;
  }
  _fontWeight;
  set fontWeight(value) {
      this._fontWeight = value;
      this.updateBounds();
      this.update();
  }
  get fontWeight() {
      return this._fontWeight;
  }
  _fontStretch = TextStyle.defaultTextStyle.fontStretch;
  set fontStretch(value) {
      this._fontStretch = value;
      this.updateBounds();
      this.update();
  }
  get fontStretch() {
      return this._fontStretch;
  }
  _fontVariantCaps = TextStyle.defaultTextStyle.fontVariantCaps;
  set fontVariantCaps(value) {
      this._fontVariantCaps = value;
      this.updateBounds();
      this.update();
  }
  get fontVariantCaps() {
      return this._fontVariantCaps;
  }
  _letterSpacing = TextStyle.defaultTextStyle.letterSpacing;
  set letterSpacing(value) {
      this._letterSpacing = value;
      this.update();
      this.updateBounds();
  }
  get letterSpacing() {
      return this._letterSpacing;
  }
  _wordSpacing = TextStyle.defaultTextStyle.wordSpacing;
  set wordSpacing(value) {
      this._wordSpacing = value;
      this.update();
      this.updateBounds();
  }
  get wordSpacing() {
      return this._wordSpacing;
  }
  _textAlign = TextStyle.defaultTextStyle.textAlign;
  set textAlign(value) {
      this._textAlign = value;
      this.update();
  }
  get textAlign() {
      return this._textAlign;
  }
  _lineHeight = 0;
  set lineHeight(value) {
      if (this.lineHeight !== value) {
          this._lineHeight = value;
          this.update();
          this.updateBounds();
      }
  }
  get lineHeight() {
      if (!this._lineHeight) {
          this._lineHeight = typeof this.fontSize == 'number' ? this.fontSize : Number.parseInt(`${this.fontSize}`);
      }
      return this._lineHeight;
  }
  _wordWrap = false;
  set wordWrap(value) {
      if (this.wordWrap !== value) {
          this._wordWrap = value;
          this.update();
          this.updateBounds();
      }
  }
  get wordWrap() {
      return this._wordWrap;
  }
  _wordWrapWidth = 0;
  set wordWrapWidth(value) {
      if (this.wordWrapWidth !== value) {
          this._wordWrapWidth = value;
          this.update();
          this.updateBounds();
      }
  }
  get wordWrapWidth() {
      return this._wordWrapWidth;
  }
  clone() {
      return new TextStyle({
          fill: this.fill,
          stroke: this.stroke,
          fontFamily: this.fontFamily,
          fontSize: this.fontSize,
          fontStyle: this.fontStyle,
          fontWeight: this.fontWeight,
          fontStretch: this.fontStretch,
          fontVariantCaps: this.fontVariantCaps,
          letterSpacing: this.letterSpacing,
          wordSpacing: this.wordSpacing,
          textAlign: this.textAlign,
          filter: this.filter,
      });
  }
  render(ctx) {
      super.render(ctx);
      ctx.textBaseline = 'top';
      ctx.font = createCanvasFontString(this);
      ctx.fontStretch = this.fontStretch;
      ctx.fontVariantCaps = this.fontVariantCaps;
      ctx.letterSpacing = formatValue(this.letterSpacing);
      ctx.wordSpacing = formatValue(this.wordSpacing);
      ctx.textAlign = this.textAlign;
      return this;
  }
}

class Text extends Display {
  constructor(options) {
      super(options);
      if (options.style)
          this.style = options.style;
      this.text = options.text ?? '';
      this.emit('ready');
      this._onUpdate();
  }
  _style = new TextStyle();
  set style(style) {
      style = style || {};
      this._style?.off('update', this._onUpdate, this);
      this._style?.off('updateBounds', this.shouldUpdateBounds, this);
      if (style instanceof TextStyle) {
          this._style = style;
      }
      else {
          this._style = new TextStyle(style);
      }
      this._style.on('update', this._onUpdate, this);
      this._style?.on('updateBounds', this.shouldUpdateBounds, this);
      this._onUpdate();
  }
  get style() {
      return this._style;
  }
  _text = '';
  set text(text) {
      if (this._text === text)
          return;
      this._text = text;
      this._onUpdate();
  }
  get text() {
      return this._text;
  }
  get _shouldUpdate() {
      return !!(this.style.fill) || !!(this.style.stroke.color && this.style.stroke.width);
  }
  getSplitText(ctx) {
      const texts = this.text.split('');
      const splitText = [];
      let multilineText = [];
      for (let i = 0; i < texts.length; i++) {
          const currentStr = texts[i];
          multilineText.push(currentStr);
          const rowStr = multilineText.join('');
          if (ctx.measureText(rowStr).width > this.style.wordWrapWidth) {
              multilineText.pop();
              splitText.push(multilineText.join(''));
              multilineText = [currentStr];
              continue;
          }
          if (i === texts.length - 1) {
              splitText.push(rowStr);
          }
      }
      return splitText;
  }
  _render(ctx) {
      if (this.style.fill || (this.style.stroke?.color && this.style.stroke?.width)) {
          this.style.render(ctx);
          // 绘制单行文本
          if (!this.style.wordWrap || !this.style.wordWrapWidth) {
              if (this.style.fill) {
                  ctx.fillText(this.text, this.position.x, this.position.y);
              }
              if (this.style.stroke?.color && this.style.stroke?.width) {
                  ctx.strokeText(this.text, this.position.x, this.position.y);
              }
          }
          else {
              const splitText = this.getSplitText(ctx);
              for (let i = 0; i < splitText.length; i++) {
                  const text = splitText[i];
                  if (this.style.fill) {
                      ctx.strokeText(text, this.position.x, this.position.y + i * this.style.lineHeight);
                  }
                  if (this.style.stroke?.color && this.style.stroke?.width) {
                      ctx.strokeText(text, this.position.x, this.position.y + i * this.style.lineHeight);
                  }
              }
          }
      }
  }
  updateTransformBounds() {
      if (!this._app)
          return;
      this._app.onContext((ctx) => {
          this.style.render(ctx);
          if (!this.style.wordWrap || !this.style.wordWrapWidth) {
              const measure = ctx.measureText(this.text);
              this.transformWidth = measure.width;
              let height = Math.max(...[
                  measure.actualBoundingBoxDescent - measure.actualBoundingBoxAscent,
                  typeof this.style.fontSize == 'number' ? this.style.fontSize : Number.parseInt(`${this.style.fontSize}`),
              ]);
              if (this.style.stroke && this.style.stroke.width) {
                  height += this.style.stroke.width;
              }
              this.transformHeight = height;
          }
          else {
              const splitText = this.getSplitText(ctx);
              this.transformWidth = this.style.wordWrapWidth;
              if (!splitText.length) {
                  this.transformHeight = 0;
                  return;
              }
              const measure = ctx.measureText(this.getSplitText(ctx)[0]);
              const lineHeight = this.style.lineHeight;
              let height = Math.max(...[
                  measure.actualBoundingBoxDescent - measure.actualBoundingBoxAscent,
                  lineHeight,
              ]);
              if (this.style.stroke && this.style.stroke.width) {
                  height += this.style.stroke.width;
              }
              if (splitText.length > 1) {
                  this.transformHeight = (splitText.length - 1) * lineHeight + height;
              }
          }
      });
  }
  transformWidth = 0;
  transformHeight = 0;
}

function NOOP() { }

class App extends EventEmitter {
  canvas;
  ctx;
  dpr = 1;
  width;
  height;
  onUpdate;
  static createImage;
  constructor({ width = 600, height = 800, dpr = true, createImage = () => document.createElement('img'), onUpdate, } = {}) {
      super();
      if (dpr) {
          this.dpr = window.devicePixelRatio ?? 1;
      }
      // this.dpr = 1
      this.onUpdate = onUpdate ?? NOOP;
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.style.width = formatValue(width);
      this.canvas.style.height = formatValue(height);
      this.canvas.width = width * this.dpr;
      this.canvas.height = height * this.dpr;
      this.width = width;
      this.height = height;
      App.createImage = createImage;
      this.update();
  }
  beforeRender() {
      this.ctx.save();
  }
  afterRender() {
      this.ctx.restore();
  }
  // private debug() {
  //   this.beforeRender()
  //   const ctx = this.ctx
  //   this.ctx.strokeStyle = '#cccccc'
  //   this.ctx.fillStyle = '#cccccc'
  //   ctx.textBaseline = 'top'
  //   ctx.font = '10px 黑体'
  //   ctx.setLineDash([4, 10])
  //   for (let row = 0; row < Math.ceil((this.width + 1) / 100); row++) {
  //     for (let col = 0; col < Math.ceil((this.height + 1) / 100); col++) {
  //       ctx.beginPath()
  //       ctx.fillText(`${row * 100},${col * 100}`, row * 100 * this.dpr, col * 100 * this.dpr)
  //       if (row === 0 || col === 0) {
  //         continue
  //       }
  //       ctx.moveTo((row * 100 - 100) * this.dpr, col * 100 * this.dpr)
  //       ctx.lineTo(row * 100 * this.dpr, col * 100 * this.dpr)
  //       ctx.lineTo(row * 100 * this.dpr, (col * 100 - 100) * this.dpr)
  //       ctx.stroke()
  //     }
  //   }
  //   this.afterRender()
  // }
  children = [];
  add(object) {
      this.children.push(object);
      object.onAdd(this);
  }
  remove(object) {
      const index = this.children.indexOf(object);
      if (index !== -1) {
          object.onRemove();
          this.children.splice(index, 1);
      }
  }
  update() {
      window.requestAnimationFrame(() => {
          this.update();
      });
      if (!this.children.length) {
          return;
      }
      const isDirty = !![...this.children.filter(e => e.dirty)].length;
      const _renderIds = this.children.every(e => e._renderId > 0);
      if (_renderIds && this.children.length) {
          this.emit('render');
      }
      if (!isDirty)
          return;
      this.ctx.clearRect(-this.canvas.width, -this.canvas.height, this.canvas.width * 2, this.canvas.height * 2);
      // this.debug()
      const shouldRender = [...this.children].filter(e => e.shouldUpdate);
      while (shouldRender.length) {
          this.beforeRender();
          const child = shouldRender.shift();
          child.render(this.ctx);
          child.dirty = false;
          child._renderId++;
          this.afterRender();
      }
      this.onUpdate();
  }
  toDataURL(type, quality) {
      return this.canvas.toDataURL(type, quality);
  }
  toDataURLAsync(type, quality) {
      return new Promise((resolve) => {
          this.once('render', () => {
              resolve(this.toDataURL(type, quality));
          });
      });
  }
  onContext(fn) {
      this.beforeRender();
      fn(this.ctx);
      this.afterRender();
  }
}

class Picture extends Display {
  options;
  constructor(maybeImage, options) {
      super(options);
      this.options = options;
      if (typeof maybeImage == 'string') {
          this.image = App.createImage();
          this.image.src = maybeImage;
      }
      else {
          this.image = maybeImage;
      }
      if (this.image.complete) {
          this._onImageComplete();
      }
      else {
          this.image.addEventListener('load', () => {
              this._onImageComplete();
          });
      }
  }
  image;
  // set image(value) {
  //   if (this.image !== value) {
  //     this._image = value
  //   }
  // }
  // get image() {
  //   return this._image
  // }
  _size = new ObservablePoint(this, 0, 0);
  _imageSize = new ObservablePoint(this, 0, 0);
  set size(value) {
      if (this.size !== value) {
          this._size.copyFrom(value);
          this.shouldUpdateBounds();
      }
  }
  get size() {
      return this._size;
  }
  _slice = new ObservablePoint(this);
  set slice(value) {
      if (this.slice !== value) {
          this._slice.copyFrom(value);
          this.shouldUpdateBounds();
      }
  }
  get slice() {
      return this._slice;
  }
  _sliceSize = new ObservablePoint(this);
  set sliceSize(value) {
      if (this.sliceSize !== value) {
          this._sliceSize.copyFrom(value);
          this._onUpdate();
          this.shouldUpdateBounds();
      }
  }
  get sliceSize() {
      return this._sliceSize;
  }
  _objectFit = 'none';
  set objectFit(value) {
      if (this.objectFit !== value) {
          this._objectFit = value;
          this.shouldUpdateBounds();
          this._onUpdate();
      }
  }
  get objectFit() {
      return this._objectFit;
  }
  _rounded = 0;
  set rounded(value) {
      value = value <= 0 ? 0 : value;
      if (this.rounded !== value) {
          this._rounded = value;
          this._onUpdate();
      }
  }
  _onUpdate(_point) {
      if (this._ready)
          super._onUpdate(_point);
  }
  get rounded() {
      return this._rounded;
  }
  _ready = false;
  _onImageComplete() {
      this._imageSize = new ObservablePoint(this, this.image.width, this.image.height);
      this.size = this.options?.size ?? {
          x: this.image.width,
          y: this.image.height,
      };
      this.slice = this.options?.slice ?? this.slice;
      this.sliceSize = this.options?.sliceSize ?? {
          x: this.image.width,
          y: this.image.height,
      };
      this.objectFit = this.options?.objectFit ?? this.objectFit;
      this.rounded = this.options?.rounded ?? this.rounded;
      this.emit('ready');
      this._ready = true;
      this._onUpdate();
      this.shouldUpdateBounds();
  }
  get _shouldUpdate() {
      return true;
  }
  get _isSlice() {
      return (!!this.slice.x || !!this.slice.y) || !this.sliceSize.equals(this.size);
  }
  _render(ctx) {
      if (!this._isSlice) {
          const _size = this.size.clone();
          const _position = this.position.clone();
          const scaleDiff = _size.x / this._imageSize.x;
          const diffSize = calcDiff([this._imageSize.x, this._imageSize.y]);
          const diff = diffSize * scaleDiff;
          const slim = this._imageSize.x < this._imageSize.y;
          const fat = this._imageSize.x > this._imageSize.y;
          if ((slim || fat)) {
              switch (this.objectFit) {
                  case 'contain':
                      if (slim) {
                          this.position.set(this.position.x - diff / 2, this.position.y);
                          this.size.set(this.size.x - diff, this.size.y);
                      }
                      else {
                          this.position.set(this.position.x, this.position.y + diff / 2);
                          this.size.set(this.size.x, this.size.y - diff);
                      }
                      ctx.beginPath();
                      if (this.rounded) {
                          ctx.roundRect(this.x, this.y, this.size.x, this.size.y, this.rounded);
                      }
                      else {
                          ctx.rect(this.x, this.y, this.size.x, this.size.y);
                      }
                      ctx.clip();
                      break;
                  case 'cover':
                      if (slim) {
                          this.position.set(this.position.x + diff / 2, this.position.y);
                          this.size.set(this.size.x + diff, this.size.y);
                      }
                      else {
                          this.position.set(this.position.x - diff / 2, this.position.y);
                          this.size.set(this.size.x + diff, this.size.y);
                      }
                      ctx.beginPath();
                      if (this.rounded) {
                          ctx.roundRect(_position.x, _position.y, _size.x, _size.y, this.rounded);
                      }
                      else {
                          ctx.rect(_position.x, _position.y, _size.x, _size.y);
                      }
                      ctx.clip();
                      break;
              }
          }
          ctx.drawImage(this.image, this.position.x, this.position.y, this.size.x, this.size.y);
          this.position = _position;
          this.size = _size;
      }
      else {
          const args = [
              this.image,
              this.slice.x,
              this.slice.y,
              this.sliceSize.x,
              this.sliceSize.y,
              this.x,
              this.y,
              this.size.x,
              this.size.y,
          ];
          ctx.beginPath();
          if (this.rounded) {
              ctx.roundRect(this.x, this.y, this.size.x, this.size.y, this.rounded);
          }
          else {
              ctx.rect(this.x, this.y, this.size.x, this.size.y);
          }
          ctx.clip();
          ctx.drawImage(...args);
      }
  }
  transformWidth = 0;
  transformHeight = 0;
  updateTransformBounds() {
      this.transformHeight = this.size.x;
      this.transformWidth = this.size.y;
  }
}

export { App, Display, ObservablePoint, Picture, Shape, Text };
