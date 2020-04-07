export type JSONPrimitive = string | number | boolean | null;
export type JSONArray = JSONValue[];
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONValue };

declare global {
  interface EmscriptenModule {
    Draw: typeof Draw;
    cwrap: typeof cwrap;
    Vec2: typeof Vec2;
    World: typeof World;
    ParticleColor: typeof ParticleColor;
    ParticleFlag: typeof ParticleFlag;
    ParticleGroupDef: typeof ParticleGroupDef;
    ParticleGroupFlag: typeof ParticleGroupFlag;
    ParticleSystemDef: typeof ParticleSystemDef;
    BodyDef: typeof BodyDef;
    CircleShape: typeof CircleShape;
    PolygonShape: typeof PolygonShape;
    Transform: typeof Transform;
    canvas: HTMLCanvasElement;
    customMessageQueue?: MessageEvent[];
  }
}
export interface Caipps {
  module?: EmscriptenModule;
  canvas?: HTMLCanvasElement;
  context?: WebGLRenderingContext;
  init?(canvas: HTMLCanvasElement): void;
}

export interface HTMLImageElement extends HTMLElement {
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
  decoding: 'async' | 'sync' | 'auto';
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
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLImageElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLImageElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

// export type HTMLCanvasElement = typeof HTMLCanvasElement;

/** Element is the most general base class from which all objects in a Document inherit. It only has methods and properties common to all kinds of elements. More specific classes inherit from Element. */
interface Element
  extends Node,
    Animatable,
    ChildNode,
    InnerHTML,
    NonDocumentTypeChildNode,
    ParentNode,
    Slotable {
  readonly assignedSlot: HTMLSlotElement | null;
  readonly attributes: NamedNodeMap;
  /**
   * Allows for manipulation of element's class content attribute as a set of whitespace-separated tokens through a DOMTokenList object.
   */
  readonly classList: DOMTokenList;
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
  readonly shadowRoot: ShadowRoot | null;
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
  attachShadow(init: ShadowRootInit): ShadowRoot;
  /**
   * Returns the first (starting at element) inclusive ancestor that matches selectors, and null otherwise.
   */
  closest<K extends keyof HTMLElementTagNameMap>(
    selector: K,
  ): HTMLElementTagNameMap[K] | null;
  closest<K extends keyof SVGElementTagNameMap>(
    selector: K,
  ): SVGElementTagNameMap[K] | null;
  closest<E extends Element = Element>(selector: string): E | null;
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
  getAttributeNames(): string[];
  getAttributeNode(name: string): Attr | null;
  getAttributeNodeNS(namespaceURI: string, localName: string): Attr | null;
  getBoundingClientRect(): DOMRect;
  getClientRects(): DOMRectList;
  /**
   * Returns a HTMLCollection of the elements in the object on which the method was invoked (a document or an element) that have all the classes given by classNames. The classNames argument is interpreted as a space-separated list of classes.
   */
  getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
  getElementsByTagName<K extends keyof HTMLElementTagNameMap>(
    qualifiedName: K,
  ): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof SVGElementTagNameMap>(
    qualifiedName: K,
  ): HTMLCollectionOf<SVGElementTagNameMap[K]>;
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
  getElementsByTagNameNS(
    namespaceURI: 'http://www.w3.org/1999/xhtml',
    localName: string,
  ): HTMLCollectionOf<HTMLElement>;
  getElementsByTagNameNS(
    namespaceURI: 'http://www.w3.org/2000/svg',
    localName: string,
  ): HTMLCollectionOf<SVGElement>;
  getElementsByTagNameNS(
    namespaceURI: string,
    localName: string,
  ): HTMLCollectionOf<Element>;
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
  insertAdjacentElement(
    position: InsertPosition,
    insertedElement: Element,
  ): Element | null;
  insertAdjacentHTML(where: InsertPosition, html: string): void;
  insertAdjacentText(where: InsertPosition, text: string): void;
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
  removeAttributeNS(namespace: string | null, localName: string): void;
  removeAttributeNode(attr: Attr): Attr;
  /**
   * Displays element fullscreen and resolves promise when done.
   *
   * When supplied, options's navigationUI member indicates whether showing navigation UI while in fullscreen is preferred or not. If set to "show", navigation simplicity is preferred over screen space, and if set to "hide", more screen space is preferred. User agents are always free to honor user preference over the application's. The default value "auto" indicates no application preference.
   */
  requestFullscreen(options?: FullscreenOptions): Promise<void>;
  requestPointerLock(): void;
  scroll(options?: ScrollToOptions): void;
  scroll(x: number, y: number): void;
  scrollBy(options?: ScrollToOptions): void;
  scrollBy(x: number, y: number): void;
  scrollIntoView(arg?: boolean | ScrollIntoViewOptions): void;
  scrollTo(options?: ScrollToOptions): void;
  scrollTo(x: number, y: number): void;
  /**
   * Sets the value of element's first attribute whose qualified name is qualifiedName to value.
   */
  setAttribute(qualifiedName: string, value: string): void;
  /**
   * Sets the value of element's attribute whose namespace is namespace and local name is localName to value.
   */
  setAttributeNS(
    namespace: string | null,
    qualifiedName: string,
    value: string,
  ): void;
  setAttributeNode(attr: Attr): Attr | null;
  setAttributeNodeNS(attr: Attr): Attr | null;
  setPointerCapture(pointerId: number): void;
  /**
   * If force is not given, "toggles" qualifiedName, removing it if it is present and adding it if it is not present. If force is true, adds qualifiedName. If force is false, removes qualifiedName.
   *
   * Returns true if qualifiedName is now present, and false otherwise.
   */
  toggleAttribute(qualifiedName: string, force?: boolean): boolean;
  webkitMatchesSelector(selectors: string): boolean;
  addEventListener<K extends keyof ElementEventMap>(
    type: K,
    listener: (this: Element, ev: ElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof ElementEventMap>(
    type: K,
    listener: (this: Element, ev: ElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

/** Any HTML element. Some elements directly implement this interface, while others implement it via an interface that inherits it. */
interface HTMLElement
  extends Element,
    DocumentAndElementEventHandlers,
    ElementCSSInlineStyle,
    ElementContentEditable,
    GlobalEventHandlers,
    HTMLOrSVGElement {
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
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

/** Provides properties and methods for manipulating the layout and presentation of <canvas> elements. The HTMLCanvasElement interface also inherits the properties and methods of the HTMLElement interface. */
export interface HTMLCanvasElement extends HTMLElement {
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
  getContext(
    contextId: '2d',
    options?: CanvasRenderingContext2DSettings,
  ): CanvasRenderingContext2D | null;
  getContext(
    contextId: 'bitmaprenderer',
    options?: ImageBitmapRenderingContextSettings,
  ): ImageBitmapRenderingContext | null;
  getContext(
    contextId: 'webgl',
    options?: WebGLContextAttributes,
  ): WebGLRenderingContext | null;
  getContext(
    contextId: 'webgl2',
    options?: WebGLContextAttributes,
  ): WebGL2RenderingContext | null;
  getContext(contextId: string, options?: any): RenderingContext | null;
  toBlob(callback: BlobCallback, type?: string, quality?: any): void;
  /**
   * Returns the content of the current canvas as an image that you can use as a source for another canvas or an HTML element.
   * @param type The standard MIME type for the image format to return. If you do not specify this parameter, the default value is a PNG format image.
   */
  toDataURL(type?: string, quality?: any): string;
  transferControlToOffscreen(): OffscreenCanvas;
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLCanvasElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLCanvasElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

/** Simple user interface events. */
interface UIEvent extends Event {
  readonly detail: number;
  // readonly view: Window | null;
  /** @deprecated */
  readonly which: number;
}

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
}

export interface PointerEvent extends MouseEvent {
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

export interface DeviceMotionEventAcceleration {
  readonly x: number | null;
  readonly y: number | null;
  readonly z: number | null;
}
