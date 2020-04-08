/*
/// <reference path="../../node_modules/typescript/lib/lib.dom.d.ts" />
/// <reference path="../../node_modules/typescript/lib/lib.es2020.d.ts" />
*/

/**
 * This file only purpose is to provide some DOM types inside the worker context.
 * We only need a few types; importing the whole DOM library will generate conflict
 * with the definitions in the worker library.
 * I could not find any other sane way of doing this...
 */

 type TouchType = "direct" | "stylus";
 type RenderingContext = CanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | WebGL2RenderingContext;

/** An event which takes place in the DOM. */
interface Event {
  /**
   * Returns true or false depending on how event was initialized. True if event goes through its target's ancestors in reverse tree order, and false otherwise.
   */
  readonly bubbles: boolean;
  cancelBubble: boolean;
  /**
   * Returns true or false depending on how event was initialized. Its return value does not always carry meaning, but true can indicate that part of the operation during which event was dispatched, can be canceled by invoking the preventDefault() method.
   */
  readonly cancelable: boolean;
  /**
   * Returns true or false depending on how event was initialized. True if event invokes listeners past a ShadowRoot node that is the root of its target, and false otherwise.
   */
  readonly composed: boolean;
  /**
   * Returns the object whose event listener's callback is currently being invoked.
   */
  readonly currentTarget: EventTarget | null;
  /**
   * Returns true if preventDefault() was invoked successfully to indicate cancelation, and false otherwise.
   */
  readonly defaultPrevented: boolean;
  /**
   * Returns the event's phase, which is one of NONE, CAPTURING_PHASE, AT_TARGET, and BUBBLING_PHASE.
   */
  readonly eventPhase: number;
  /**
   * Returns true if event was dispatched by the user agent, and false otherwise.
   */
  readonly isTrusted: boolean;
  returnValue: boolean;
  /** @deprecated */
  readonly srcElement: EventTarget | null;
  /**
   * Returns the object to which event is dispatched (its target).
   */
  readonly target: EventTarget | null;
  /**
   * Returns the event's timestamp as the number of milliseconds measured relative to the time origin.
   */
  readonly timeStamp: number;
  /**
   * Returns the type of event, e.g. "click", "hashchange", or "submit".
   */
  readonly type: string;
  /**
   * Returns the invocation target objects of event's path (objects on which listeners will be invoked), except for any nodes in shadow trees of which the shadow root's mode is "closed" that are not reachable from event's currentTarget.
   */
  composedPath(): EventTarget[];
  initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
  /**
   * If invoked when the cancelable attribute value is true, and while executing a listener for the event with passive set to false, signals to the operation that caused event to be dispatched that it needs to be canceled.
   */
  preventDefault(): void;
  /**
   * Invoking this method prevents event from reaching any registered event listeners after the current one finishes running and, when dispatched in a tree, also prevents event from reaching any other objects.
   */
  stopImmediatePropagation(): void;
  /**
   * When dispatched in a tree, invoking this method prevents event from reaching any objects other than the current object.
   */
  stopPropagation(): void;
  readonly AT_TARGET: number;
  readonly BUBBLING_PHASE: number;
  readonly CAPTURING_PHASE: number;
  readonly NONE: number;
}

declare var Event: {
  prototype: Event;
  new(type: string, eventInitDict?: EventInit): Event;
  readonly AT_TARGET: number;
  readonly BUBBLING_PHASE: number;
  readonly CAPTURING_PHASE: number;
  readonly NONE: number;
};

/** Simple user interface events. */
interface UIEvent extends Event {
  readonly detail: number;
  // readonly view: Window | null;
  /** @deprecated */
  readonly which: number;
}

/** Events providing information related to animations. */
interface AnimationEvent extends Event {
  readonly animationName: string;
  readonly elapsedTime: number;
  readonly pseudoElement: string;
}

/** Events that occur due to the user interacting with a pointing device (such as a mouse). Common events using this interface include click, dblclick, mouseup, mousedown. */
interface MouseEvent extends UIEvent {
  readonly altKey: boolean;
  readonly button: number;
  readonly buttons: number;
  readonly clientX: number;
  readonly clientY: number;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly movementX: number;
  readonly movementY: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly pageX: number;
  readonly pageY: number;
  readonly relatedTarget: EventTarget | null;
  readonly screenX: number;
  readonly screenY: number;
  readonly shiftKey: boolean;
  readonly x: number;
  readonly y: number;
  getModifierState(keyArg: string): boolean;
  initMouseEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, /* viewArg: Window, */ detailArg: number, screenXArg: number, screenYArg: number, clientXArg: number, clientYArg: number, ctrlKeyArg: boolean, altKeyArg: boolean, shiftKeyArg: boolean, metaKeyArg: boolean, buttonArg: number, relatedTargetArg: EventTarget | null): void;
}

declare var MouseEvent: {
  prototype: MouseEvent;
  new(type: string, eventInitDict?: MouseEventInit): MouseEvent;
};

/** Focus-related events like focus, blur, focusin, or focusout. */
interface FocusEvent extends UIEvent {
  readonly relatedTarget: EventTarget | null;
}

/** A DOM event that represents a drag and drop interaction. The user initiates a drag by placing a pointer device (such as a mouse) on the touch surface and then dragging the pointer to a new location (such as another DOM element). Applications are free to interpret a drag and drop interaction in an application-specific way. */
// interface DragEvent extends MouseEvent {
//   /**
//    * Returns the DataTransfer object for the event.
//    */
//   readonly dataTransfer: DataTransfer | null;
// }

// declare var DragEvent: {
//   prototype: DragEvent;
//   new(type: string, eventInitDict?: DragEventInit): DragEvent;
// };

/** Events providing information related to errors in scripts or in files. */
interface ErrorEvent extends Event {
  readonly colno: number;
  readonly error: any;
  readonly filename: string;
  readonly lineno: number;
  readonly message: string;
}

/** The state of a DOM event produced by a pointer such as the geometry of the contact point, the device type that generated the event, the amount of pressure that was applied on the contact surface, etc. */
interface PointerEvent extends MouseEvent {
  readonly height: number;
  readonly isPrimary: boolean;
  readonly pointerId: number;
  readonly pointerType: string;
  readonly pressure: number;
  readonly tangentialPressure: number;
  readonly tiltX: number;
  readonly tiltY: number;
  readonly twist: number;
  readonly width: number;
}

declare var PointerEvent: {
  prototype: PointerEvent;
  new(type: string, eventInitDict?: PointerEventInit): PointerEvent;
};

interface PointerEventInit extends MouseEventInit {
  height?: number;
  isPrimary?: boolean;
  pointerId?: number;
  pointerType?: string;
  pressure?: number;
  tangentialPressure?: number;
  tiltX?: number;
  tiltY?: number;
  twist?: number;
  width?: number;
}

interface MouseEventInit extends EventModifierInit {
  button?: number;
  buttons?: number;
  clientX?: number;
  clientY?: number;
  movementX?: number;
  movementY?: number;
  relatedTarget?: EventTarget | null;
  screenX?: number;
  screenY?: number;
}

/** KeyboardEvent objects describe a user interaction with the keyboard; each event describes a single interaction between the user and a key (or combination of a key with modifier keys) on the keyboard. */
// interface KeyboardEvent extends UIEvent {
//   readonly altKey: boolean;
//   /** @deprecated */
//   char: string;
//   /** @deprecated */
//   readonly charCode: number;
//   readonly code: string;
//   readonly ctrlKey: boolean;
//   readonly isComposing: boolean;
//   readonly key: string;
//   /** @deprecated */
//   readonly keyCode: number;
//   readonly location: number;
//   readonly metaKey: boolean;
//   readonly repeat: boolean;
//   readonly shiftKey: boolean;
//   getModifierState(keyArg: string): boolean;
//   readonly DOM_KEY_LOCATION_LEFT: number;
//   readonly DOM_KEY_LOCATION_NUMPAD: number;
//   readonly DOM_KEY_LOCATION_RIGHT: number;
//   readonly DOM_KEY_LOCATION_STANDARD: number;
// }

// declare var KeyboardEvent: {
//   prototype: KeyboardEvent;
//   new(type: string, eventInitDict?: KeyboardEventInit): KeyboardEvent;
//   readonly DOM_KEY_LOCATION_LEFT: number;
//   readonly DOM_KEY_LOCATION_NUMPAD: number;
//   readonly DOM_KEY_LOCATION_RIGHT: number;
//   readonly DOM_KEY_LOCATION_STANDARD: number;
// };

/** Events measuring progress of an underlying process, like an HTTP request (for an XMLHttpRequest, or the loading of the underlying resource of an <img>, <audio>, <video>, <style> or <link>). */
interface ProgressEvent<T extends EventTarget = EventTarget> extends Event {
  readonly lengthComputable: boolean;
  readonly loaded: number;
  readonly target: T | null;
  readonly total: number;
}

declare var ProgressEvent: {
  prototype: ProgressEvent;
  new(type: string, eventInitDict?: ProgressEventInit): ProgressEvent;
};

/** Inherits from Event, and represents the event object of an event sent on a document or worker when its content security policy is violated. */
// interface SecurityPolicyViolationEvent extends Event {
//   readonly blockedURI: string;
//   readonly columnNumber: number;
//   readonly documentURI: string;
//   readonly effectiveDirective: string;
//   readonly lineNumber: number;
//   readonly originalPolicy: string;
//   readonly referrer: string;
//   readonly sourceFile: string;
//   readonly statusCode: number;
//   readonly violatedDirective: string;
// }

// declare var SecurityPolicyViolationEvent: {
//   prototype: SecurityPolicyViolationEvent;
//   new(type: string, eventInitDict?: SecurityPolicyViolationEventInit): SecurityPolicyViolationEvent;
// };

interface UIEventInit extends EventInit {
  detail?: number;
  // view?: Window | null;
}


interface EventModifierInit extends UIEventInit {
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  modifierAltGraph?: boolean;
  modifierCapsLock?: boolean;
  modifierFn?: boolean;
  modifierFnLock?: boolean;
  modifierHyper?: boolean;
  modifierNumLock?: boolean;
  modifierScrollLock?: boolean;
  modifierSuper?: boolean;
  modifierSymbol?: boolean;
  modifierSymbolLock?: boolean;
  shiftKey?: boolean;
}

interface TouchEventInit extends EventModifierInit {
  changedTouches?: Touch[];
  targetTouches?: Touch[];
  touches?: Touch[];
}

interface TouchInit {
  altitudeAngle?: number;
  azimuthAngle?: number;
  clientX?: number;
  clientY?: number;
  force?: number;
  identifier: number;
  pageX?: number;
  pageY?: number;
  radiusX?: number;
  radiusY?: number;
  rotationAngle?: number;
  screenX?: number;
  screenY?: number;
  target: EventTarget;
  touchType?: TouchType;
}

/** A single contact point on a touch-sensitive device. The contact point is commonly a finger or stylus and the device may be a touchscreen or trackpad. */
interface Touch {
  readonly altitudeAngle: number;
  readonly azimuthAngle: number;
  readonly clientX: number;
  readonly clientY: number;
  readonly force: number;
  readonly identifier: number;
  readonly pageX: number;
  readonly pageY: number;
  readonly radiusX: number;
  readonly radiusY: number;
  readonly rotationAngle: number;
  readonly screenX: number;
  readonly screenY: number;
  readonly target: EventTarget;
  readonly touchType: TouchType;
}

declare var Touch: {
  prototype: Touch;
  new(touchInitDict: TouchInit): Touch;
};

/** An event sent when the state of contacts with a touch-sensitive surface changes. This surface can be a touch screen or trackpad, for example. The event can describe one or more points of contact with the screen and includes support for detecting movement, addition and removal of contact points, and so forth. */
interface TouchEvent extends UIEvent {
  readonly altKey: boolean;
  readonly changedTouches: TouchList;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly shiftKey: boolean;
  readonly targetTouches: TouchList;
  readonly touches: TouchList;
}

declare var TouchEvent: {
  prototype: TouchEvent;
  new(type: string, eventInitDict?: TouchEventInit): TouchEvent;
};

/** A list of contact points on a touch surface. For example, if the user has three fingers on the touch surface (such as a screen or trackpad), the corresponding TouchList object would have one Touch object for each finger, for a total of three entries. */
interface TouchList {
  readonly length: number;
  item(index: number): Touch | null;
  [index: number]: Touch;
}

declare var TouchList: {
  prototype: TouchList;
  new(): TouchList;
};


/** Events providing information related to transitions. */
// interface TransitionEvent extends Event {
//   readonly elapsedTime: number;
//   readonly propertyName: string;
//   readonly pseudoElement: string;
// }

// declare var TransitionEvent: {
//   prototype: TransitionEvent;
//   new(type: string, transitionEventInitDict?: TransitionEventInit): TransitionEvent;
// };

/** Events that occur due to the user moving a mouse wheel or similar input device. */
// interface WheelEvent extends MouseEvent {
//   readonly deltaMode: number;
//   readonly deltaX: number;
//   readonly deltaY: number;
//   readonly deltaZ: number;
//   readonly DOM_DELTA_LINE: number;
//   readonly DOM_DELTA_PAGE: number;
//   readonly DOM_DELTA_PIXEL: number;
// }

// declare var WheelEvent: {
//   prototype: WheelEvent;
//   new(type: string, eventInitDict?: WheelEventInit): WheelEvent;
//   readonly DOM_DELTA_LINE: number;
//   readonly DOM_DELTA_PAGE: number;
//   readonly DOM_DELTA_PIXEL: number;
// };

/** Events providing information related to modification of the clipboard, that is cut, copy, and paste events. */
// interface ClipboardEvent extends Event {
//   readonly clipboardData: DataTransfer | null;
// }

// declare var ClipboardEvent: {
//   prototype: ClipboardEvent;
//   new(type: string, eventInitDict?: ClipboardEventInit): ClipboardEvent;
// };

interface DeviceMotionEventAcceleration {
  readonly x: number | null;
  readonly y: number | null;
  readonly z: number | null;
}

interface EventListenerOptions {
  capture?: boolean;
}

interface AddEventListenerOptions extends EventListenerOptions {
  once?: boolean;
  passive?: boolean;
}

interface EventListener {
  (evt: Event): void;
}

interface EventListenerObject {
  handleEvent(evt: Event): void;
}

// declare type EventListenerOrEventListenerObject = EventListener | EventListenerObject;

interface ElementEventMap {
  "fullscreenchange": Event;
  "fullscreenerror": Event;
}

interface GlobalEventHandlersEventMap {
  "abort": UIEvent;
  "animationcancel": AnimationEvent;
  "animationend": AnimationEvent;
  "animationiteration": AnimationEvent;
  "animationstart": AnimationEvent;
  "auxclick": MouseEvent;
  "blur": FocusEvent;
  "cancel": Event;
  "canplay": Event;
  "canplaythrough": Event;
  "change": Event;
  "click": MouseEvent;
  "close": Event;
  "contextmenu": MouseEvent;
  "cuechange": Event;
  "dblclick": MouseEvent;
  // "drag": DragEvent;
  // "dragend": DragEvent;
  // "dragenter": DragEvent;
  // "dragexit": Event;
  // "dragleave": DragEvent;
  // "dragover": DragEvent;
  // "dragstart": DragEvent;
  // "drop": DragEvent;
  "durationchange": Event;
  "emptied": Event;
  "ended": Event;
  "error": ErrorEvent;
  "focus": FocusEvent;
  "focusin": FocusEvent;
  "focusout": FocusEvent;
  "gotpointercapture": PointerEvent;
  "input": Event;
  "invalid": Event;
  // "keydown": KeyboardEvent;
  // "keypress": KeyboardEvent;
  // "keyup": KeyboardEvent;
  "load": Event;
  "loadeddata": Event;
  "loadedmetadata": Event;
  "loadstart": Event;
  "lostpointercapture": PointerEvent;
  "mousedown": MouseEvent;
  "mouseenter": MouseEvent;
  "mouseleave": MouseEvent;
  "mousemove": MouseEvent;
  "mouseout": MouseEvent;
  "mouseover": MouseEvent;
  "mouseup": MouseEvent;
  "pause": Event;
  "play": Event;
  "playing": Event;
  "pointercancel": PointerEvent;
  "pointerdown": PointerEvent;
  "pointerenter": PointerEvent;
  "pointerleave": PointerEvent;
  "pointermove": PointerEvent;
  "pointerout": PointerEvent;
  "pointerover": PointerEvent;
  "pointerup": PointerEvent;
  "progress": ProgressEvent;
  "ratechange": Event;
  "reset": Event;
  "resize": UIEvent;
  "scroll": Event;
  // "securitypolicyviolation": SecurityPolicyViolationEvent;
  "seeked": Event;
  "seeking": Event;
  "select": Event;
  "selectionchange": Event;
  "selectstart": Event;
  "stalled": Event;
  "submit": Event;
  "suspend": Event;
  "timeupdate": Event;
  "toggle": Event;
  "touchcancel": TouchEvent;
  "touchend": TouchEvent;
  "touchmove": TouchEvent;
  "touchstart": TouchEvent;
  // "transitioncancel": TransitionEvent;
  // "transitionend": TransitionEvent;
  // "transitionrun": TransitionEvent;
  // "transitionstart": TransitionEvent;
  "volumechange": Event;
  "waiting": Event;
  // "wheel": WheelEvent;
}

// interface DocumentAndElementEventHandlersEventMap {
//   "copy": ClipboardEvent;
//   "cut": ClipboardEvent;
//   "paste": ClipboardEvent;
// }

interface DocumentAndElementEventHandlers {
  // oncopy: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
  // oncut: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
  // onpaste: ((this: DocumentAndElementEventHandlers, ev: ClipboardEvent) => any) | null;
  // addEventListener<K extends keyof DocumentAndElementEventHandlersEventMap>(type: K, listener: (this: DocumentAndElementEventHandlers, ev: DocumentAndElementEventHandlersEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  // removeEventListener<K extends keyof DocumentAndElementEventHandlersEventMap>(type: K, listener: (this: DocumentAndElementEventHandlers, ev: DocumentAndElementEventHandlersEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

interface HTMLElementEventMap extends ElementEventMap, GlobalEventHandlersEventMap /*, DocumentAndElementEventHandlersEventMap */ {}

interface DOMRectReadOnly {
  readonly bottom: number;
  readonly height: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
  toJSON(): any;
}

declare var DOMRectReadOnly: {
  prototype: DOMRectReadOnly;
  new(x?: number, y?: number, width?: number, height?: number): DOMRectReadOnly;
  fromRect(other?: DOMRectInit): DOMRectReadOnly;
};

interface DOMRect extends DOMRectReadOnly {
  height: number;
  width: number;
  x: number;
  y: number;
}

declare var DOMRect: {
  prototype: DOMRect;
  new(x?: number, y?: number, width?: number, height?: number): DOMRect;
  fromRect(other?: DOMRectInit): DOMRect;
};

/** Element is the most general base class from which all objects in a Document inherit. It only has methods and properties common to all kinds of elements. More specific classes inherit from Element. */
interface Element {
  // readonly assignedSlot: HTMLSlotElement | null;
  // readonly attributes: NamedNodeMap;
  /**
   * Allows for manipulation of element's class content attribute as a set of whitespace-separated tokens through a DOMTokenList object.
   */
  // readonly classList: DOMTokenList;
  /**
   * Returns the value of element's class content attribute. Can be set to change it.
   */
  className: string;
  readonly clientHeight: number;
  readonly clientLeft: number;
  readonly clientTop: number;
  readonly clientWidth: number;
  /**
   * Returns the value of element's id content attribute. Can be set to change it.
   */
  id: string;
  /**
   * Returns the local name.
   */
  readonly localName: string;
  /**
   * Returns the namespace.
   */
  readonly namespaceURI: string | null;
  onfullscreenchange: ((this: Element, ev: Event) => any) | null;
  onfullscreenerror: ((this: Element, ev: Event) => any) | null;
  outerHTML: string;
  /**
   * Returns the namespace prefix.
   */
  readonly prefix: string | null;
  readonly scrollHeight: number;
  scrollLeft: number;
  scrollTop: number;
  readonly scrollWidth: number;
  /**
   * Returns element's shadow root, if any, and if shadow root's mode is "open", and null otherwise.
   */
  // readonly shadowRoot: ShadowRoot | null;
  /**
   * Returns the value of element's slot content attribute. Can be set to change it.
   */
  slot: string;
  /**
   * Returns the HTML-uppercased qualified name.
   */
  readonly tagName: string;
  /**
   * Creates a shadow root for element and returns it.
   */
  // attachShadow(init: ShadowRootInit): ShadowRoot;
  /**
   * Returns the first (starting at element) inclusive ancestor that matches selectors, and null otherwise.
   */
  // closest<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
  // closest<K extends keyof SVGElementTagNameMap>(selector: K): SVGElementTagNameMap[K] | null;
  // closest<E extends Element = Element>(selector: string): E | null;
  /**
   * Returns element's first attribute whose qualified name is qualifiedName, and null if there is no such attribute otherwise.
   */
  getAttribute(qualifiedName: string): string | null;
  /**
   * Returns element's attribute whose namespace is namespace and local name is localName, and null if there is no such attribute otherwise.
   */
  getAttributeNS(namespace: string | null, localName: string): string | null;
  /**
   * Returns the qualified names of all element's attributes. Can contain duplicates.
   */
  // getAttributeNames(): string[];
  // getAttributeNode(name: string): Attr | null;
  // getAttributeNodeNS(namespaceURI: string, localName: string): Attr | null;
  getBoundingClientRect(): DOMRect;
  // getClientRects(): DOMRectList;
  /**
   * Returns a HTMLCollection of the elements in the object on which the method was invoked (a document or an element) that have all the classes given by classNames. The classNames argument is interpreted as a space-separated list of classes.
   */
  // getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
  // getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
  // getElementsByTagName<K extends keyof SVGElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<SVGElementTagNameMap[K]>;
  // getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
  // getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
  // getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
  // getElementsByTagNameNS(namespaceURI: string, localName: string): HTMLCollectionOf<Element>;
  /**
   * Returns true if element has an attribute whose qualified name is qualifiedName, and false otherwise.
   */
  hasAttribute(qualifiedName: string): boolean;
  /**
   * Returns true if element has an attribute whose namespace is namespace and local name is localName.
   */
  hasAttributeNS(namespace: string | null, localName: string): boolean;
  /**
   * Returns true if element has attributes, and false otherwise.
   */
  hasAttributes(): boolean;
  hasPointerCapture(pointerId: number): boolean;
  // insertAdjacentElement(position: InsertPosition, insertedElement: Element): Element | null;
  // insertAdjacentHTML(where: InsertPosition, html: string): void;
  // insertAdjacentText(where: InsertPosition, text: string): void;
  /**
   * Returns true if matching selectors against element's root yields element, and false otherwise.
   */
  matches(selectors: string): boolean;
  msGetRegionContent(): any;
  releasePointerCapture(pointerId: number): void;
  /**
   * Removes element's first attribute whose qualified name is qualifiedName.
   */
  removeAttribute(qualifiedName: string): void;
  /**
   * Removes element's attribute whose namespace is namespace and local name is localName.
   */
  // removeAttributeNS(namespace: string | null, localName: string): void;
  // removeAttributeNode(attr: Attr): Attr;
  /**
   * Displays element fullscreen and resolves promise when done.
   * 
   * When supplied, options's navigationUI member indicates whether showing navigation UI while in fullscreen is preferred or not. If set to "show", navigation simplicity is preferred over screen space, and if set to "hide", more screen space is preferred. User agents are always free to honor user preference over the application's. The default value "auto" indicates no application preference.
   */
  // requestFullscreen(options?: FullscreenOptions): Promise<void>;
  requestPointerLock(): void;
  // scroll(options?: ScrollToOptions): void;
  // scroll(x: number, y: number): void;
  // scrollBy(options?: ScrollToOptions): void;
  // scrollBy(x: number, y: number): void;
  // scrollIntoView(arg?: boolean | ScrollIntoViewOptions): void;
  // scrollTo(options?: ScrollToOptions): void;
  // scrollTo(x: number, y: number): void;
  /**
   * Sets the value of element's first attribute whose qualified name is qualifiedName to value.
   */
  setAttribute(qualifiedName: string, value: string): void;
  /**
   * Sets the value of element's attribute whose namespace is namespace and local name is localName to value.
   */
  // setAttributeNS(namespace: string | null, qualifiedName: string, value: string): void;
  // setAttributeNode(attr: Attr): Attr | null;
  // setAttributeNodeNS(attr: Attr): Attr | null;
  setPointerCapture(pointerId: number): void;
  /**
   * If force is not given, "toggles" qualifiedName, removing it if it is present and adding it if it is not present. If force is true, adds qualifiedName. If force is false, removes qualifiedName.
   * 
   * Returns true if qualifiedName is now present, and false otherwise.
   */
  toggleAttribute(qualifiedName: string, force?: boolean): boolean;
  webkitMatchesSelector(selectors: string): boolean;
  addEventListener<K extends keyof ElementEventMap>(type: K, listener: (this: Element, ev: ElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof ElementEventMap>(type: K, listener: (this: Element, ev: ElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var Element: {
  prototype: Element;
  new(): Element;
};

interface BlobCallback {
  (blob: Blob | null): void;
}

interface CanvasUserInterface {
  drawFocusIfNeeded(element: Element): void;
  drawFocusIfNeeded(path: Path2D, element: Element): void;
  scrollPathIntoView(): void;
  scrollPathIntoView(path: Path2D): void;
}

/** The CanvasRenderingContext2D interface, part of the Canvas API, provides the 2D rendering context for the drawing surface of a <canvas> element. It is used for drawing shapes, text, images, and other objects. */
interface CanvasRenderingContext2D extends
  // CanvasCompositing,
  // CanvasDrawImage,
  // CanvasDrawPath,
  // CanvasFillStrokeStyles,
  // CanvasFilters,
  // CanvasImageData,
  // CanvasImageSmoothing,
  // CanvasPath,
  // CanvasPathDrawingStyles,
  // CanvasRect,
  // CanvasShadowStyles,
  // CanvasState,
  // CanvasText,
  // CanvasTextDrawingStyles,
  // CanvasTransform,
  CanvasUserInterface {
  readonly canvas: HTMLCanvasElement;
}

declare var CanvasRenderingContext2D: {
  prototype: CanvasRenderingContext2D;
  new(): CanvasRenderingContext2D;
};

/** Any HTML element. Some elements directly implement this interface, while others implement it via an interface that inherits it. */
interface HTMLElement extends Element, DocumentAndElementEventHandlers, GlobalEventHandlers {
  accessKey: string;
  readonly accessKeyLabel: string;
  autocapitalize: string;
  dir: string;
  draggable: boolean;
  hidden: boolean;
  innerText: string;
  lang: string;
  readonly offsetHeight: number;
  readonly offsetLeft: number;
  readonly offsetParent: Element | null;
  readonly offsetTop: number;
  readonly offsetWidth: number;
  spellcheck: boolean;
  title: string;
  translate: boolean;
  click(): void;
  addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var HTMLElement: {
  prototype: HTMLElement;
  new(): HTMLElement;
};

/** Provides special properties and methods for manipulating <img> elements. */
interface HTMLImageElement extends HTMLElement {
  /**
   * Sets or retrieves how the object is aligned with adjacent text.
   */
  /** @deprecated */
  align: string;
  /**
   * Sets or retrieves a text alternative to the graphic.
   */
  alt: string;
  /**
   * Specifies the properties of a border drawn around an object.
   */
  /** @deprecated */
  border: string;
  /**
   * Retrieves whether the object is fully loaded.
   */
  readonly complete: boolean;
  crossOrigin: string | null;
  readonly currentSrc: string;
  decoding: "async" | "sync" | "auto";
  /**
   * Sets or retrieves the height of the object.
   */
  height: number;
  /**
   * Sets or retrieves the width of the border to draw around the object.
   */
  /** @deprecated */
  hspace: number;
  /**
   * Sets or retrieves whether the image is a server-side image map.
   */
  isMap: boolean;
  /**
   * Sets or retrieves a Uniform Resource Identifier (URI) to a long description of the object.
   */
  /** @deprecated */
  longDesc: string;
  /** @deprecated */
  lowsrc: string;
  /**
   * Sets or retrieves the name of the object.
   */
  /** @deprecated */
  name: string;
  /**
   * The original height of the image resource before sizing.
   */
  readonly naturalHeight: number;
  /**
   * The original width of the image resource before sizing.
   */
  readonly naturalWidth: number;
  referrerPolicy: string;
  sizes: string;
  /**
   * The address or URL of the a media resource that is to be considered.
   */
  src: string;
  srcset: string;
  /**
   * Sets or retrieves the URL, often with a bookmark extension (#name), to use as a client-side image map.
   */
  useMap: string;
  /**
   * Sets or retrieves the vertical margin for the object.
   */
  /** @deprecated */
  vspace: number;
  /**
   * Sets or retrieves the width of the object.
   */
  width: number;
  readonly x: number;
  readonly y: number;
  decode(): Promise<void>;
  addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLImageElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLImageElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var HTMLImageElement: {
  prototype: HTMLImageElement;
  new(): HTMLImageElement;
};

declare var Image: {
  new(width?: number, height?: number): HTMLImageElement;
};

/** Provides properties and methods for manipulating the layout and presentation of <canvas> elements. The HTMLCanvasElement interface also inherits the properties and methods of the HTMLElement interface. */
interface HTMLCanvasElement extends HTMLElement {
  /**
   * Gets or sets the height of a canvas element on a document.
   */
  height: number;
  /**
   * Gets or sets the width of a canvas element on a document.
   */
  width: number;
  /**
   * Returns an object that provides methods and properties for drawing and manipulating images and graphics on a canvas element in a document. A context object includes information about colors, line widths, fonts, and other graphic parameters that can be drawn on a canvas.
   * @param contextId The identifier (ID) of the type of canvas to create. Internet Explorer 9 and Internet Explorer 10 support only a 2-D context using canvas.getContext("2d"); IE11 Preview also supports 3-D or WebGL context using canvas.getContext("experimental-webgl");
   */
  getContext(contextId: "2d", options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D | null;
  getContext(contextId: "bitmaprenderer", options?: ImageBitmapRenderingContextSettings): ImageBitmapRenderingContext | null;
  getContext(contextId: "webgl", options?: WebGLContextAttributes): WebGLRenderingContext | null;
  getContext(contextId: "webgl2", options?: WebGLContextAttributes): WebGL2RenderingContext | null;
  getContext(contextId: string, options?: any): RenderingContext | null;
  toBlob(callback: BlobCallback, type?: string, quality?: any): void;
  /**
   * Returns the content of the current canvas as an image that you can use as a source for another canvas or an HTML element.
   * @param type The standard MIME type for the image format to return. If you do not specify this parameter, the default value is a PNG format image.
   */
  toDataURL(type?: string, quality?: any): string;
  transferControlToOffscreen(): OffscreenCanvas;
  addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLCanvasElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLCanvasElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var HTMLCanvasElement: {
  prototype: HTMLCanvasElement;
  new(): HTMLCanvasElement;
};
