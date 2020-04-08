/*
/// <reference path="../../node_modules/typescript/lib/lib.dom.d.ts" />
/// <reference path="../../node_modules/typescript/lib/lib.es2020.d.ts" />
*/

/// <reference no-default-lib="true"/>
/// <reference path="../../node_modules/typescript/lib/lib.es2015.promise.d.ts" />
/// <reference path="../../node_modules/typescript/lib/lib.es2015.iterable.d.ts" />
/// <reference path="../../node_modules/typescript/lib/lib.es5.d.ts" />

/**
 * This file only purpose is to provide some DOM types inside the worker context.
 * We only need a few types; importing the whole DOM library will generate conflict
 * with the definitions in the worker library.
 * I could not find any other sane way of doing this...
 */

interface PromiseLike<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseLike<TResult1 | TResult2>;
}

 /**
 * Represents the completion of an asynchronous operation
 */
interface Promise<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
}

declare var document: Document;

declare var console: Console;

declare type EventListenerOrEventListenerObject = EventListener | EventListenerObject;

declare function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;

type BodyInit =
| Blob
| BufferSource
// | FormData
// | URLSearchParams
// | ReadableStream<Uint8Array>
| string;
type BlobPart = BufferSource | Blob | string;
type BufferSource = ArrayBufferView | ArrayBuffer;
type EndingType = "native" | "transparent";
type Float32List = Float32Array | GLfloat[];
type RenderingContext =
  CanvasRenderingContext2D |
  ImageBitmapRenderingContext |
  WebGLRenderingContext |
  WebGL2RenderingContext;
type MessageEventSource =
  // WindowProxy |
  MessagePort; // |
  // ServiceWorker;
type GLenum = number;
type GLuint = number;
type GLfloat = number;
type GLclampf = number;
type GLboolean = boolean;
type GLbitfield = number;
type GLint = number;
type GLsizei = number;
type GLintptr = number;
type GLsizeiptr = number;
type Int32List = Int32Array | GLint[];
type Uint32List = Uint32Array | GLuint[];
type GLint64 = number;
type GLuint64 = number;
type WebGLPowerPreference = "default" | "high-performance" | "low-power";
type OnErrorEventHandler = OnErrorEventHandlerNonNull | null;
type Transferable =
  // ArrayBuffer |
  MessagePort |
  ImageBitmap |
  OffscreenCanvas;
type HTMLOrSVGImageElement =
  HTMLImageElement;
  // | SVGImageElement;
type CanvasImageSource =
  HTMLOrSVGImageElement |
  // HTMLVideoElement |
  HTMLCanvasElement |
  ImageBitmap |
  OffscreenCanvas;
//  type ImageBitmapSource = CanvasImageSource | Blob | ImageData;
type OffscreenRenderingContext = OffscreenCanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | WebGL2RenderingContext;
type OffscreenRenderingContextId = "2d" | "bitmaprenderer" | "webgl" | "webgl2";
type RequestInfo = Request | string;
type TexImageSource =
  | ImageBitmap
  | ImageData
  | HTMLImageElement
  | HTMLCanvasElement
  // | HTMLVideoElement
  | OffscreenCanvas;
type TouchType = "direct" | "stylus";
 /** Any web page loaded in the browser and serves as an entry point into the web page's content, which is the DOM tree. */
interface Document extends
  //Node,
  DocumentAndElementEventHandlers,
  //DocumentOrShadowRoot,
  GlobalEventHandlers
  // NonElementParentNode,
  // ParentNode,
  // XPathEvaluatorBase
  {
  /**
   * Sets or gets the URL for the current document.
   */
  readonly URL: string;
  /**
   * Sets or gets the color of all active links in the document.
   */
  /** @deprecated */
  alinkColor: string;
  /**
   * Returns a reference to the collection of elements contained by the object.
   */
  /** @deprecated */
  // readonly all: HTMLAllCollection;
  /**
   * Retrieves a collection of all a objects that have a name and/or id property. Objects in this collection are in HTML source order.
   */
  /** @deprecated */
  // readonly anchors: HTMLCollectionOf<HTMLAnchorElement>;
  /**
   * Retrieves a collection of all applet objects in the document.
   */
  /** @deprecated */
  // readonly applets: HTMLCollectionOf<HTMLAppletElement>;
  /**
   * Deprecated. Sets or retrieves a value that indicates the background color behind the object.
   */
  /** @deprecated */
  bgColor: string;
  /**
   * Specifies the beginning and end of the document body.
   */
  body: HTMLElement;
  /**
   * Returns document's encoding.
   */
  readonly characterSet: string;
  /**
   * Gets or sets the character set used to encode the object.
   */
  readonly charset: string;
  /**
   * Gets a value that indicates whether standards-compliant mode is switched on for the object.
   */
  readonly compatMode: string;
  /**
   * Returns document's content type.
   */
  readonly contentType: string;
  /**
   * Returns the HTTP cookies that apply to the Document. If there are no cookies or cookies can't be applied to this resource, the empty string will be returned.
   *
   * Can be set, to add a new cookie to the element's set of HTTP cookies.
   *
   * If the contents are sandboxed into a unique origin (e.g. in an iframe with the sandbox attribute), a "SecurityError" DOMException will be thrown on getting and setting.
   */
  cookie: string;
  /**
   * Returns the script element, or the SVG script element, that is currently executing, as long as the element represents a classic script. In the case of reentrant script execution, returns the one that most recently started executing amongst those that have not yet finished executing.
   *
   * Returns null if the Document is not currently executing a script or SVG script element (e.g., because the running script is an event handler, or a timeout), or if the currently executing script or SVG script element represents a module script.
   */
  // readonly currentScript: HTMLOrSVGScriptElement | null;
  // readonly defaultView: (WindowProxy & typeof globalThis) | null;
  /**
   * Sets or gets a value that indicates whether the document can be edited.
   */
  designMode: string;
  /**
   * Sets or retrieves a value that indicates the reading order of the object.
   */
  dir: string;
  /**
   * Gets an object representing the document type declaration associated with the current document.
   */
  // readonly doctype: DocumentType | null;
  /**
   * Gets a reference to the root node of the document.
   */
  readonly documentElement: HTMLElement;
  /**
   * Returns document's URL.
   */
  readonly documentURI: string;
  /**
   * Sets or gets the security domain of the document.
   */
  domain: string;
  /**
   * Retrieves a collection of all embed objects in the document.
   */
  // readonly embeds: HTMLCollectionOf<HTMLEmbedElement>;
  /**
   * Sets or gets the foreground (text) color of the document.
   */
  /** @deprecated */
  fgColor: string;
  /**
   * Retrieves a collection, in source order, of all form objects in the document.
   */
  // readonly forms: HTMLCollectionOf<HTMLFormElement>;
  /** @deprecated */
  readonly fullscreen: boolean;
  /**
   * Returns true if document has the ability to display elements fullscreen and fullscreen is supported, or false otherwise.
   */
  readonly fullscreenEnabled: boolean;
  /**
   * Returns the head element.
   */
  // readonly head: HTMLHeadElement;
  readonly hidden: boolean;
  /**
   * Retrieves a collection, in source order, of img objects in the document.
   */
  // readonly images: HTMLCollectionOf<HTMLImageElement>;
  /**
   * Gets the implementation object of the current document.
   */
  // readonly implementation: DOMImplementation;
  /**
   * Returns the character encoding used to create the webpage that is loaded into the document object.
   */
  readonly inputEncoding: string;
  /**
   * Gets the date that the page was last modified, if the page supplies one.
   */
  readonly lastModified: string;
  /**
   * Sets or gets the color of the document links.
   */
  /** @deprecated */
  linkColor: string;
  /**
   * Retrieves a collection of all a objects that specify the href property and all area objects in the document.
   */
  // readonly links: HTMLCollectionOf<HTMLAnchorElement | HTMLAreaElement>;
  /**
   * Contains information about the current URL.
   */
  // location: Location;
  onfullscreenchange: ((this: Document, ev: Event) => any) | null;
  onfullscreenerror: ((this: Document, ev: Event) => any) | null;
  onpointerlockchange: ((this: Document, ev: Event) => any) | null;
  onpointerlockerror: ((this: Document, ev: Event) => any) | null;
  /**
   * Fires when the state of the object has changed.
   * @param ev The event
   */
  onreadystatechange: ((this: Document, ev: Event) => any) | null;
  onvisibilitychange: ((this: Document, ev: Event) => any) | null;
  /**
   * Returns document's origin.
   */
  readonly origin: string;
  readonly ownerDocument: null;
  /**
   * Return an HTMLCollection of the embed elements in the Document.
   */
  // readonly plugins: HTMLCollectionOf<HTMLEmbedElement>;
  /**
   * Retrieves a value that indicates the current state of the object.
   */
  // readonly readyState: DocumentReadyState;
  /**
   * Gets the URL of the location that referred the user to the current page.
   */
  readonly referrer: string;
  /**
   * Retrieves a collection of all script objects in the document.
   */
  // readonly scripts: HTMLCollectionOf<HTMLScriptElement>;
  readonly scrollingElement: Element | null;
  // readonly timeline: DocumentTimeline;
  /**
   * Contains the title of the document.
   */
  title: string;
  // readonly visibilityState: VisibilityState;
  /**
   * Sets or gets the color of the links that the user has visited.
   */
  /** @deprecated */
  vlinkColor: string;
  /**
   * Moves node from another document and returns it.
   *
   * If node is a document, throws a "NotSupportedError" DOMException or, if node is a shadow root, throws a "HierarchyRequestError" DOMException.
   */
  // adoptNode<T extends Node>(source: T): T;
  /** @deprecated */
  captureEvents(): void;
  // caretPositionFromPoint(x: number, y: number): CaretPosition | null;
  /** @deprecated */
  // caretRangeFromPoint(x: number, y: number): Range;
  /** @deprecated */
  clear(): void;
  /**
   * Closes an output stream and forces the sent data to display.
   */
  close(): void;
  /**
   * Creates an attribute object with a specified name.
   * @param name String that sets the attribute object's name.
   */
  // createAttribute(localName: string): Attr;
  // createAttributeNS(namespace: string | null, qualifiedName: string): Attr;
  /**
   * Returns a CDATASection node whose data is data.
   */
  // createCDATASection(data: string): CDATASection;
  /**
   * Creates a comment object with the specified data.
   * @param data Sets the comment object's data.
   */
  // createComment(data: string): Comment;
  /**
   * Creates a new document.
   */
  // createDocumentFragment(): DocumentFragment;
  /**
   * Creates an instance of the element for the specified tag.
   * @param tagName The name of an element.
   */
  createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K];
  /** @deprecated */
  // createElement<K extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementDeprecatedTagNameMap[K];
  createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
  /**
   * Returns an element with namespace namespace. Its namespace prefix will be everything before ":" (U+003E) in qualifiedName or null. Its local name will be everything after ":" (U+003E) in qualifiedName or qualifiedName.
   *
   * If localName does not match the Name production an "InvalidCharacterError" DOMException will be thrown.
   *
   * If one of the following conditions is true a "NamespaceError" DOMException will be thrown:
   *
   * localName does not match the QName production.
   * Namespace prefix is not null and namespace is the empty string.
   * Namespace prefix is "xml" and namespace is not the XML namespace.
   * qualifiedName or namespace prefix is "xmlns" and namespace is not the XMLNS namespace.
   * namespace is the XMLNS namespace and neither qualifiedName nor namespace prefix is "xmlns".
   *
   * When supplied, options's is can be used to create a customized built-in element.
   */
  createElementNS(namespaceURI: "http://www.w3.org/1999/xhtml", qualifiedName: string): HTMLElement;
  // createElementNS<K extends keyof SVGElementTagNameMap>(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: K): SVGElementTagNameMap[K];
  // createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: string): SVGElement;
  // createElementNS(namespaceURI: string | null, qualifiedName: string, options?: ElementCreationOptions): Element;
  // createElementNS(namespace: string | null, qualifiedName: string, options?: string | ElementCreationOptions): Element;
  createEvent(eventInterface: "AnimationEvent"): AnimationEvent;
  // createEvent(eventInterface: "AnimationPlaybackEvent"): AnimationPlaybackEvent;
  // createEvent(eventInterface: "AudioProcessingEvent"): AudioProcessingEvent;
  // createEvent(eventInterface: "BeforeUnloadEvent"): BeforeUnloadEvent;
  // createEvent(eventInterface: "ClipboardEvent"): ClipboardEvent;
  // createEvent(eventInterface: "CloseEvent"): CloseEvent;
  // createEvent(eventInterface: "CompositionEvent"): CompositionEvent;
  // createEvent(eventInterface: "CustomEvent"): CustomEvent;
  // createEvent(eventInterface: "DeviceLightEvent"): DeviceLightEvent;
  // createEvent(eventInterface: "DeviceMotionEvent"): DeviceMotionEvent;
  // createEvent(eventInterface: "DeviceOrientationEvent"): DeviceOrientationEvent;
  // createEvent(eventInterface: "DragEvent"): DragEvent;
  createEvent(eventInterface: "ErrorEvent"): ErrorEvent;
  createEvent(eventInterface: "Event"): Event;
  createEvent(eventInterface: "Events"): Event;
  createEvent(eventInterface: "FocusEvent"): FocusEvent;
  // createEvent(eventInterface: "FocusNavigationEvent"): FocusNavigationEvent;
  // createEvent(eventInterface: "GamepadEvent"): GamepadEvent;
  // createEvent(eventInterface: "HashChangeEvent"): HashChangeEvent;
  // createEvent(eventInterface: "IDBVersionChangeEvent"): IDBVersionChangeEvent;
  // createEvent(eventInterface: "InputEvent"): InputEvent;
  // createEvent(eventInterface: "KeyboardEvent"): KeyboardEvent;
  // createEvent(eventInterface: "ListeningStateChangedEvent"): ListeningStateChangedEvent;
  // createEvent(eventInterface: "MSGestureEvent"): MSGestureEvent;
  // createEvent(eventInterface: "MSMediaKeyMessageEvent"): MSMediaKeyMessageEvent;
  // createEvent(eventInterface: "MSMediaKeyNeededEvent"): MSMediaKeyNeededEvent;
  // createEvent(eventInterface: "MSPointerEvent"): MSPointerEvent;
  // createEvent(eventInterface: "MediaEncryptedEvent"): MediaEncryptedEvent;
  // createEvent(eventInterface: "MediaKeyMessageEvent"): MediaKeyMessageEvent;
  // createEvent(eventInterface: "MediaQueryListEvent"): MediaQueryListEvent;
  // createEvent(eventInterface: "MediaStreamErrorEvent"): MediaStreamErrorEvent;
  // createEvent(eventInterface: "MediaStreamEvent"): MediaStreamEvent;
  // createEvent(eventInterface: "MediaStreamTrackEvent"): MediaStreamTrackEvent;
  createEvent(eventInterface: "MessageEvent"): MessageEvent;
  createEvent(eventInterface: "MouseEvent"): MouseEvent;
  createEvent(eventInterface: "MouseEvents"): MouseEvent;
  // createEvent(eventInterface: "MutationEvent"): MutationEvent;
  // createEvent(eventInterface: "MutationEvents"): MutationEvent;
  // createEvent(eventInterface: "OfflineAudioCompletionEvent"): OfflineAudioCompletionEvent;
  // createEvent(eventInterface: "OverflowEvent"): OverflowEvent;
  // createEvent(eventInterface: "PageTransitionEvent"): PageTransitionEvent;
  // createEvent(eventInterface: "PaymentRequestUpdateEvent"): PaymentRequestUpdateEvent;
  // createEvent(eventInterface: "PermissionRequestedEvent"): PermissionRequestedEvent;
  createEvent(eventInterface: "PointerEvent"): PointerEvent;
  // createEvent(eventInterface: "PopStateEvent"): PopStateEvent;
  // createEvent(eventInterface: "ProgressEvent"): ProgressEvent;
  createEvent(eventInterface: "PromiseRejectionEvent"): PromiseRejectionEvent;
  // createEvent(eventInterface: "RTCDTMFToneChangeEvent"): RTCDTMFToneChangeEvent;
  // createEvent(eventInterface: "RTCDataChannelEvent"): RTCDataChannelEvent;
  // createEvent(eventInterface: "RTCDtlsTransportStateChangedEvent"): RTCDtlsTransportStateChangedEvent;
  // createEvent(eventInterface: "RTCErrorEvent"): RTCErrorEvent;
  // createEvent(eventInterface: "RTCIceCandidatePairChangedEvent"): RTCIceCandidatePairChangedEvent;
  // createEvent(eventInterface: "RTCIceGathererEvent"): RTCIceGathererEvent;
  // createEvent(eventInterface: "RTCIceTransportStateChangedEvent"): RTCIceTransportStateChangedEvent;
  // createEvent(eventInterface: "RTCPeerConnectionIceErrorEvent"): RTCPeerConnectionIceErrorEvent;
  // createEvent(eventInterface: "RTCPeerConnectionIceEvent"): RTCPeerConnectionIceEvent;
  // createEvent(eventInterface: "RTCSsrcConflictEvent"): RTCSsrcConflictEvent;
  // createEvent(eventInterface: "RTCStatsEvent"): RTCStatsEvent;
  // createEvent(eventInterface: "RTCTrackEvent"): RTCTrackEvent;
  // createEvent(eventInterface: "SVGZoomEvent"): SVGZoomEvent;
  // createEvent(eventInterface: "SVGZoomEvents"): SVGZoomEvent;
  // createEvent(eventInterface: "SecurityPolicyViolationEvent"): SecurityPolicyViolationEvent;
  // createEvent(eventInterface: "ServiceWorkerMessageEvent"): ServiceWorkerMessageEvent;
  // createEvent(eventInterface: "SpeechRecognitionEvent"): SpeechRecognitionEvent;
  // createEvent(eventInterface: "SpeechSynthesisErrorEvent"): SpeechSynthesisErrorEvent;
  // createEvent(eventInterface: "SpeechSynthesisEvent"): SpeechSynthesisEvent;
  // createEvent(eventInterface: "StorageEvent"): StorageEvent;
  // createEvent(eventInterface: "TextEvent"): TextEvent;
  createEvent(eventInterface: "TouchEvent"): TouchEvent;
  // createEvent(eventInterface: "TrackEvent"): TrackEvent;
  // createEvent(eventInterface: "TransitionEvent"): TransitionEvent;
  createEvent(eventInterface: "UIEvent"): UIEvent;
  createEvent(eventInterface: "UIEvents"): UIEvent;
  // createEvent(eventInterface: "VRDisplayEvent"): VRDisplayEvent;
  // createEvent(eventInterface: "VRDisplayEvent "): VRDisplayEvent ;
  createEvent(eventInterface: "WebGLContextEvent"): WebGLContextEvent;
  // createEvent(eventInterface: "WheelEvent"): WheelEvent;
  createEvent(eventInterface: string): Event;
  /**
   * Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
   * @param root The root element or node to start traversing on.
   * @param whatToShow The type of nodes or elements to appear in the node list
   * @param filter A custom NodeFilter function to use. For more information, see filter. Use null for no filter.
   * @param entityReferenceExpansion A flag that specifies whether entity reference nodes are expanded.
   */
  // createNodeIterator(root: Node, whatToShow?: number, filter?: NodeFilter | null): NodeIterator;
  /**
   * Returns a ProcessingInstruction node whose target is target and data is data. If target does not match the Name production an "InvalidCharacterError" DOMException will be thrown. If data contains "?>" an "InvalidCharacterError" DOMException will be thrown.
   */
  // createProcessingInstruction(target: string, data: string): ProcessingInstruction;
  /**
   *  Returns an empty range object that has both of its boundary points positioned at the beginning of the document.
   */
  // createRange(): Range;
  /**
   * Creates a text string from the specified value.
   * @param data String that specifies the nodeValue property of the text node.
   */
  // createTextNode(data: string): Text;
  /**
   * Creates a TreeWalker object that you can use to traverse filtered lists of nodes or elements in a document.
   * @param root The root element or node to start traversing on.
   * @param whatToShow The type of nodes or elements to appear in the node list. For more information, see whatToShow.
   * @param filter A custom NodeFilter function to use.
   * @param entityReferenceExpansion A flag that specifies whether entity reference nodes are expanded.
   */
  // createTreeWalker(root: Node, whatToShow?: number, filter?: NodeFilter | null): TreeWalker;
  /** @deprecated */
  // createTreeWalker(root: Node, whatToShow: number, filter: NodeFilter | null, entityReferenceExpansion?: boolean): TreeWalker;
  /**
   * Returns the element for the specified x coordinate and the specified y coordinate.
   * @param x The x-offset
   * @param y The y-offset
   */
  elementFromPoint(x: number, y: number): Element | null;
  elementsFromPoint(x: number, y: number): Element[];
  /**
   * Executes a command on the current document, current selection, or the given range.
   * @param commandId String that specifies the command to execute. This command can be any of the command identifiers that can be executed in script.
   * @param showUI Display the user interface, defaults to false.
   * @param value Value to assign.
   */
  execCommand(commandId: string, showUI?: boolean, value?: string): boolean;
  /**
   * Stops document's fullscreen element from being displayed fullscreen and resolves promise when done.
   */
  exitFullscreen(): Promise<void>;
  exitPointerLock(): void;
  // getAnimations(): Animation[];
  /**
   * Returns a reference to the first object with the specified value of the ID or NAME attribute.
   * @param elementId String that specifies the ID value. Case-insensitive.
   */
  getElementById(elementId: string): HTMLElement | null;
  /**
   * Returns a HTMLCollection of the elements in the object on which the method was invoked (a document or an element) that have all the classes given by classNames. The classNames argument is interpreted as a space-separated list of classes.
   */
  // getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
  /**
   * Gets a collection of objects based on the value of the NAME or ID attribute.
   * @param elementName Gets a collection of objects based on the value of the NAME or ID attribute.
   */
  // getElementsByName(elementName: string): NodeListOf<HTMLElement>;
  /**
   * Retrieves a collection of objects based on the specified element name.
   * @param name Specifies the name of an element.
   */
  // getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
  // getElementsByTagName<K extends keyof SVGElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<SVGElementTagNameMap[K]>;
  // getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
  /**
   * If namespace and localName are "*" returns a HTMLCollection of all descendant elements.
   *
   * If only namespace is "*" returns a HTMLCollection of all descendant elements whose local name is localName.
   *
   * If only localName is "*" returns a HTMLCollection of all descendant elements whose namespace is namespace.
   *
   * Otherwise, returns a HTMLCollection of all descendant elements whose namespace is namespace and local name is localName.
   */
  // getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
  // getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
  // getElementsByTagNameNS(namespaceURI: string, localName: string): HTMLCollectionOf<Element>;
  /**
   * Returns an object representing the current selection of the document that is loaded into the object displaying a webpage.
   */
  // getSelection(): Selection | null;
  /**
   * Gets a value indicating whether the object currently has focus.
   */
  hasFocus(): boolean;
  /**
   * Returns a copy of node. If deep is true, the copy also includes the node's descendants.
   *
   * If node is a document or a shadow root, throws a "NotSupportedError" DOMException.
   */
  // importNode<T extends Node>(importedNode: T, deep: boolean): T;
  /**
   * Opens a new window and loads a document specified by a given URL. Also, opens a new window that uses the url parameter and the name parameter to collect the output of the write method and the writeln method.
   * @param url Specifies a MIME type for the document.
   * @param name Specifies the name of the window. This name is used as the value for the TARGET attribute on a form or an anchor element.
   * @param features Contains a list of items separated by commas. Each item consists of an option and a value, separated by an equals sign (for example, "fullscreen=yes, toolbar=yes"). The following values are supported.
   * @param replace Specifies whether the existing entry for the document is replaced in the history list.
   */
  open(url?: string, name?: string, features?: string, replace?: boolean): Document;
  /**
   * Returns a Boolean value that indicates whether a specified command can be successfully executed using execCommand, given the current state of the document.
   * @param commandId Specifies a command identifier.
   */
  queryCommandEnabled(commandId: string): boolean;
  /**
   * Returns a Boolean value that indicates whether the specified command is in the indeterminate state.
   * @param commandId String that specifies a command identifier.
   */
  queryCommandIndeterm(commandId: string): boolean;
  /**
   * Returns a Boolean value that indicates the current state of the command.
   * @param commandId String that specifies a command identifier.
   */
  queryCommandState(commandId: string): boolean;
  /**
   * Returns a Boolean value that indicates whether the current command is supported on the current range.
   * @param commandId Specifies a command identifier.
   */
  queryCommandSupported(commandId: string): boolean;
  /**
   * Returns the current value of the document, range, or current selection for the given command.
   * @param commandId String that specifies a command identifier.
   */
  queryCommandValue(commandId: string): string;
  /** @deprecated */
  releaseEvents(): void;
  /**
   * Writes one or more HTML expressions to a document in the specified window.
   * @param content Specifies the text and HTML tags to write.
   */
  write(...text: string[]): void;
  /**
   * Writes one or more HTML expressions, followed by a carriage return, to a document in the specified window.
   * @param content The text and HTML tags to write.
   */
  writeln(...text: string[]): void;
  // addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  // removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

/** This Fetch API interface represents a resource request. */
interface Request extends Body {
  /**
   * Returns the cache mode associated with request, which is a string indicating how the request will interact with the browser's cache when fetching.
   */
  // readonly cache: RequestCache;
  /**
   * Returns the credentials mode associated with request, which is a string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL.
   */
  // readonly credentials: RequestCredentials;
  /**
   * Returns the kind of resource requested by request, e.g., "document" or "script".
   */
  // readonly destination: RequestDestination;
  /**
   * Returns a Headers object consisting of the headers associated with request. Note that headers added in the network layer by the user agent will not be accounted for in this object, e.g., the "Host" header.
   */
  // readonly headers: Headers;
  /**
   * Returns request's subresource integrity metadata, which is a cryptographic hash of the resource being fetched. Its value consists of multiple hashes separated by whitespace. [SRI]
   */
  readonly integrity: string;
  /**
   * Returns a boolean indicating whether or not request is for a history navigation (a.k.a. back-foward navigation).
   */
  readonly isHistoryNavigation: boolean;
  /**
   * Returns a boolean indicating whether or not request is for a reload navigation.
   */
  readonly isReloadNavigation: boolean;
  /**
   * Returns a boolean indicating whether or not request can outlive the global in which it was created.
   */
  readonly keepalive: boolean;
  /**
   * Returns request's HTTP method, which is "GET" by default.
   */
  readonly method: string;
  /**
   * Returns the mode associated with request, which is a string indicating whether the request will use CORS, or will be restricted to same-origin URLs.
   */
  // readonly mode: RequestMode;
  /**
   * Returns the redirect mode associated with request, which is a string indicating how redirects for the request will be handled during fetching. A request will follow redirects by default.
   */
  // readonly redirect: RequestRedirect;
  /**
   * Returns the referrer of request. Its value can be a same-origin URL if explicitly set in init, the empty string to indicate no referrer, and "about:client" when defaulting to the global's default. This is used during fetching to determine the value of the `Referer` header of the request being made.
   */
  readonly referrer: string;
  /**
   * Returns the referrer policy associated with request. This is used during fetching to compute the value of the request's referrer.
   */
  // readonly referrerPolicy: ReferrerPolicy;
  /**
   * Returns the signal associated with request, which is an AbortSignal object indicating whether or not request has been aborted, and its abort event handler.
   */
  // readonly signal: AbortSignal;
  /**
   * Returns the URL of request as a string.
   */
  readonly url: string;
  clone(): Request;
}

declare var Request: {
  prototype: Request;
  new(input: RequestInfo, init?: RequestInit): Request;
};

/** This Fetch API interface represents the response to a request. */
interface Response extends Body {
  // readonly headers: Headers;
  readonly ok: boolean;
  readonly redirected: boolean;
  readonly status: number;
  readonly statusText: string;
  // readonly trailer: Promise<Headers>;
  // readonly type: ResponseType;
  readonly url: string;
  clone(): Response;
}

declare var Response: {
  prototype: Response;
  // new(body?: BodyInit | null, init?: ResponseInit): Response;
  error(): Response;
  redirect(url: string, status?: number): Response;
};

interface RequestInit {
  /**
   * A BodyInit object or null to set request's body.
   */
  body?: BodyInit | null;
  /**
   * A string indicating how the request will interact with the browser's cache to set request's cache.
   */
  // cache?: RequestCache;
  /**
   * A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials.
   */
  // credentials?: RequestCredentials;
  /**
   * A Headers object, an object literal, or an array of two-item arrays to set request's headers.
   */
  // headers?: HeadersInit;
  /**
   * A cryptographic hash of the resource to be fetched by request. Sets request's integrity.
   */
  integrity?: string;
  /**
   * A boolean to set request's keepalive.
   */
  keepalive?: boolean;
  /**
   * A string to set request's method.
   */
  method?: string;
  /**
   * A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode.
   */
  // mode?: RequestMode;
  /**
   * A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect.
   */
  // redirect?: RequestRedirect;
  /**
   * A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer.
   */
  referrer?: string;
  /**
   * A referrer policy to set request's referrerPolicy.
   */
  // referrerPolicy?: ReferrerPolicy;
  /**
   * An AbortSignal to set request's signal.
   */
  // signal?: AbortSignal | null;
  /**
   * Can only be null. Used to disassociate request from any Window.
   */
  window?: any;
}

interface ResponseInit {
  // headers?: HeadersInit;
  status?: number;
  statusText?: string;
}

interface Body {
  // readonly body: ReadableStream<Uint8Array> | null;
  readonly bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  // formData(): Promise<FormData>;
  json(): Promise<any>;
  text(): Promise<string>;
}


/** A file-like object of immutable, raw data. Blobs represent data that isn't necessarily in a JavaScript-native format. The File interface is based on Blob, inheriting blob functionality and expanding it to support files on the user's system. */
interface Blob {
  readonly size: number;
  readonly type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
  slice(start?: number, end?: number, contentType?: string): Blob;
  // stream(): ReadableStream;
  text(): Promise<string>;
}

declare var Blob: {
  prototype: Blob;
  new(blobParts?: BlobPart[], options?: BlobPropertyBag): Blob;
};

interface BlobPropertyBag {
  endings?: EndingType;
  type?: string;
}

/** Provides access to the browser's debugging console (e.g. the Web Console in Firefox). The specifics of how it works varies from browser to browser, but there is a de facto set of features that are typically provided. */
interface Console {
  memory: any;
  assert(condition?: boolean, message?: string, ...data: any[]): void;
  clear(): void;
  count(label?: string): void;
  debug(message?: any, ...optionalParams: any[]): void;
  dir(value?: any, ...optionalParams: any[]): void;
  dirxml(value: any): void;
  error(message?: any, ...optionalParams: any[]): void;
  exception(message?: string, ...optionalParams: any[]): void;
  group(groupTitle?: string, ...optionalParams: any[]): void;
  groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void;
  groupEnd(): void;
  info(message?: any, ...optionalParams: any[]): void;
  log(message?: any, ...optionalParams: any[]): void;
  markTimeline(label?: string): void;
  profile(reportName?: string): void;
  profileEnd(reportName?: string): void;
  table(...tabularData: any[]): void;
  time(label?: string): void;
  timeEnd(label?: string): void;
  timeStamp(label?: string): void;
  timeline(label?: string): void;
  timelineEnd(label?: string): void;
  trace(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
}

declare var Console: {
  prototype: Console;
  new(): Console;
};

interface ImageEncodeOptions {
  quality?: number;
  type?: string;
}

/** The underlying pixel data of an area of a <canvas> element. It is created using the ImageData() constructor or creator methods on the CanvasRenderingContext2D object associated with a canvas: createImageData() and getImageData(). It can also be used to set a part of the canvas by using putImageData(). */
interface ImageData {
  /**
   * Returns the one-dimensional array containing the data in RGBA order, as integers in the range 0 to 255.
   */
  readonly data: Uint8ClampedArray;
  /**
   * Returns the actual dimensions of the data in the ImageData object, in pixels.
   */
  readonly height: number;
  /**
   * Returns the actual dimensions of the data in the ImageData object, in pixels.
   */
  readonly width: number;
}

declare var ImageData: {
  prototype: ImageData;
  new(width: number, height: number): ImageData;
  new(array: Uint8ClampedArray, width: number, height?: number): ImageData;
};


interface Float32Array {
  /**
   * Determines whether an array includes a certain element, returning true or false as appropriate.
   * @param searchElement The element to search for.
   * @param fromIndex The position in this array at which to begin searching for searchElement.
   */
  includes(searchElement: number, fromIndex?: number): boolean;
}

declare var Document: {
  prototype: Document;
  new(): Document;
};

interface ElementCreationOptions {
  is?: string;
}

interface HTMLElementTagNameMap {
  // "a": HTMLAnchorElement;
  "abbr": HTMLElement;
  "address": HTMLElement;
  // "applet": HTMLAppletElement;
  // "area": HTMLAreaElement;
  "article": HTMLElement;
  "aside": HTMLElement;
  // "audio": HTMLAudioElement;
  "b": HTMLElement;
  // "base": HTMLBaseElement;
  // "basefont": HTMLBaseFontElement;
  "bdi": HTMLElement;
  "bdo": HTMLElement;
  // "blockquote": HTMLQuoteElement;
  // "body": HTMLBodyElement;
  // "br": HTMLBRElement;
  // "button": HTMLButtonElement;
  "canvas": HTMLCanvasElement;
  // "caption": HTMLTableCaptionElement;
  "cite": HTMLElement;
  "code": HTMLElement;
  // "col": HTMLTableColElement;
  // "colgroup": HTMLTableColElement;
  // "data": HTMLDataElement;
  // "datalist": HTMLDataListElement;
  "dd": HTMLElement;
  // "del": HTMLModElement;
  // "details": HTMLDetailsElement;
  "dfn": HTMLElement;
  // "dialog": HTMLDialogElement;
  // "dir": HTMLDirectoryElement;
  // "div": HTMLDivElement;
  // "dl": HTMLDListElement;
  "dt": HTMLElement;
  "em": HTMLElement;
  // "embed": HTMLEmbedElement;
  // "fieldset": HTMLFieldSetElement;
  "figcaption": HTMLElement;
  "figure": HTMLElement;
  // "font": HTMLFontElement;
  "footer": HTMLElement;
  // "form": HTMLFormElement;
  // "frame": HTMLFrameElement;
  // "frameset": HTMLFrameSetElement;
  // "h1": HTMLHeadingElement;
  // "h2": HTMLHeadingElement;
  // "h3": HTMLHeadingElement;
  // "h4": HTMLHeadingElement;
  // "h5": HTMLHeadingElement;
  // "h6": HTMLHeadingElement;
  // "head": HTMLHeadElement;
  "header": HTMLElement;
  "hgroup": HTMLElement;
  // "hr": HTMLHRElement;
  // "html": HTMLHtmlElement;
  "i": HTMLElement;
  // "iframe": HTMLIFrameElement;
  "img": HTMLImageElement;
  // "input": HTMLInputElement;
  // "ins": HTMLModElement;
  "kbd": HTMLElement;
  // "label": HTMLLabelElement;
  // "legend": HTMLLegendElement;
  // "li": HTMLLIElement;
  // "link": HTMLLinkElement;
  "main": HTMLElement;
  // "map": HTMLMapElement;
  "mark": HTMLElement;
  // "marquee": HTMLMarqueeElement;
  // "menu": HTMLMenuElement;
  // "meta": HTMLMetaElement;
  // "meter": HTMLMeterElement;
  "nav": HTMLElement;
  "noscript": HTMLElement;
  // "object": HTMLObjectElement;
  // "ol": HTMLOListElement;
  // "optgroup": HTMLOptGroupElement;
  // "option": HTMLOptionElement;
  // "output": HTMLOutputElement;
  // "p": HTMLParagraphElement;
  // "param": HTMLParamElement;
  // "picture": HTMLPictureElement;
  // "pre": HTMLPreElement;
  // "progress": HTMLProgressElement;
  // "q": HTMLQuoteElement;
  "rp": HTMLElement;
  "rt": HTMLElement;
  "ruby": HTMLElement;
  "s": HTMLElement;
  "samp": HTMLElement;
  // "script": HTMLScriptElement;
  "section": HTMLElement;
  // "select": HTMLSelectElement;
  // "slot": HTMLSlotElement;
  "small": HTMLElement;
  // "source": HTMLSourceElement;
  // "span": HTMLSpanElement;
  "strong": HTMLElement;
  // "style": HTMLStyleElement;
  "sub": HTMLElement;
  "summary": HTMLElement;
  "sup": HTMLElement;
  // "table": HTMLTableElement;
  // "tbody": HTMLTableSectionElement;
  // "td": HTMLTableDataCellElement;
  // "template": HTMLTemplateElement;
  // "textarea": HTMLTextAreaElement;
  // "tfoot": HTMLTableSectionElement;
  // "th": HTMLTableHeaderCellElement;
  // "thead": HTMLTableSectionElement;
  // "time": HTMLTimeElement;
  // "title": HTMLTitleElement;
  // "tr": HTMLTableRowElement;
  // "track": HTMLTrackElement;
  "u": HTMLElement;
  // "ul": HTMLUListElement;
  "var": HTMLElement;
  // "video": HTMLVideoElement;
  "wbr": HTMLElement;
}


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

/** EventTarget is a DOM interface implemented by objects that can receive events and may have listeners for them. */
interface EventTarget {
  /**
   * Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.
   *
   * The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.
   *
   * When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.
   *
   * When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.
   *
   * When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.
   *
   * The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.
   */
  addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
  /**
   * Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.
   */
  dispatchEvent(event: Event): boolean;
  /**
   * Removes the event listener in target's event listener list with the same type, callback, and options.
   */
  removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
}

declare var EventTarget: {
  prototype: EventTarget;
  new(): EventTarget;
};

interface EventInit {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

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
// interface ProgressEvent<T extends EventTarget = EventTarget> extends Event {
//   readonly lengthComputable: boolean;
//   readonly loaded: number;
//   readonly target: T | null;
//   readonly total: number;
// }

// declare var ProgressEvent: {
//   prototype: ProgressEvent;
//   new(type: string, eventInitDict?: ProgressEventInit): ProgressEvent;
// };

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

interface MessageEventInit extends EventInit {
  data?: any;
  lastEventId?: string;
  origin?: string;
  ports?: MessagePort[];
  source?: MessageEventSource | null;
}

/** A message received by a target object. */
interface MessageEvent extends Event {
  /**
   * Returns the data of the message.
   */
  readonly data: any;
  /**
   * Returns the last event ID string, for server-sent events.
   */
  readonly lastEventId: string;
  /**
   * Returns the origin of the message, for server-sent events and cross-document messaging.
   */
  readonly origin: string;
  /**
   * Returns the MessagePort array sent with the message, for cross-document messaging and channel messaging.
   */
  // readonly ports: ReadonlyArray<MessagePort>;
  readonly ports: MessagePort[];
  /**
   * Returns the WindowProxy of the source window, for cross-document messaging, and the MessagePort being attached, in the connect event fired at SharedWorkerGlobalScope objects.
   */
  readonly source: MessageEventSource | null;
}

declare var MessageEvent: {
  prototype: MessageEvent;
  new(type: string, eventInitDict?: MessageEventInit): MessageEvent;
};

interface MessagePortEventMap {
  "message": MessageEvent;
  "messageerror": MessageEvent;
}

/** This Channel Messaging API interface represents one of the two ports of a MessageChannel, allowing messages to be sent from one port and listening out for them arriving at the other. */
interface MessagePort extends EventTarget {
  onmessage: ((this: MessagePort, ev: MessageEvent) => any) | null;
  onmessageerror: ((this: MessagePort, ev: MessageEvent) => any) | null;
  /**
   * Disconnects the port, so that it is no longer active.
   */
  close(): void;
  /**
   * Posts a message through the channel. Objects listed in transfer are transferred, not just cloned, meaning that they are no longer usable on the sending side.
   *
   * Throws a "DataCloneError" DOMException if transfer contains duplicate objects or port, or if message could not be cloned.
   */
  postMessage(message: any, transfer: Transferable[]): void;
  postMessage(message: any, options?: PostMessageOptions): void;
  /**
   * Begins dispatching messages received on the port.
   */
  start(): void;
  addEventListener<K extends keyof MessagePortEventMap>(type: K, listener: (this: MessagePort, ev: MessagePortEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof MessagePortEventMap>(type: K, listener: (this: MessagePort, ev: MessagePortEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var MessagePort: {
  prototype: MessagePort;
  new(): MessagePort;
};

interface PostMessageOptions {
  transfer?: any[];
}

interface PromiseRejectionEventInit extends EventInit {
  promise: Promise<any>;
  reason?: any;
}

interface PromiseRejectionEvent extends Event {
  readonly promise: Promise<any>;
  readonly reason: any;
}

declare var PromiseRejectionEvent: {
  prototype: PromiseRejectionEvent;
  new(type: string, eventInitDict: PromiseRejectionEventInit): PromiseRejectionEvent;
};

interface WebGLContextEventInit extends EventInit {
  statusMessage?: string;
}

/** The WebContextEvent interface is part of the WebGL API and is an interface for an event that is generated in response to a status change to the WebGL rendering context. */
interface WebGLContextEvent extends Event {
  readonly statusMessage: string;
}

declare var WebGLContextEvent: {
  prototype: WebGLContextEvent;
  new(type: string, eventInit?: WebGLContextEventInit): WebGLContextEvent;
};

/** Part of the WebGL API and represents the information returned by calling the WebGLRenderingContext.getActiveAttrib() and WebGLRenderingContext.getActiveUniform() methods. */
interface WebGLActiveInfo {
  readonly name: string;
  readonly size: GLint;
  readonly type: GLenum;
}

declare var WebGLActiveInfo: {
  prototype: WebGLActiveInfo;
  new(): WebGLActiveInfo;
};

interface WebGLContextAttributes {
  alpha?: boolean;
  antialias?: boolean;
  depth?: boolean;
  desynchronized?: boolean;
  failIfMajorPerformanceCaveat?: boolean;
  powerPreference?: WebGLPowerPreference;
  premultipliedAlpha?: boolean;
  preserveDrawingBuffer?: boolean;
  stencil?: boolean;
}

interface WebGLObject {
}

declare var WebGLObject: {
    prototype: WebGLObject;
    new(): WebGLObject;
};

/** The WebGLProgram is part of the WebGL API and is a combination of two compiled WebGLShaders consisting of a vertex shader and a fragment shader (both written in GLSL). */
interface WebGLProgram extends WebGLObject {
}

declare var WebGLProgram: {
    prototype: WebGLProgram;
    new(): WebGLProgram;
};

/** The WebGLShader is part of the WebGL API and can either be a vertex or a fragment shader. A WebGLProgram requires both types of shaders. */
interface WebGLShader extends WebGLObject {
}

declare var WebGLShader: {
    prototype: WebGLShader;
    new(): WebGLShader;
};

/** Part of the WebGL API and represents an opaque buffer object storing data such as vertices or colors. */
interface WebGLBuffer extends WebGLObject {
}

declare var WebGLBuffer: {
    prototype: WebGLBuffer;
    new(): WebGLBuffer;
};

/** Part of the WebGL API and represents a collection of buffers that serve as a rendering destination. */
interface WebGLFramebuffer extends WebGLObject {
}

declare var WebGLFramebuffer: {
    prototype: WebGLFramebuffer;
    new(): WebGLFramebuffer;
};

/** Part of the WebGL API and represents a buffer that can contain an image, or can be source or target of an rendering operation. */
interface WebGLRenderbuffer extends WebGLObject {
}

declare var WebGLRenderbuffer: {
    prototype: WebGLRenderbuffer;
    new(): WebGLRenderbuffer;
};

/** Part of the WebGL API and represents an opaque texture object providing storage and state for texturing operations. */
interface WebGLTexture extends WebGLObject {
}

declare var WebGLTexture: {
    prototype: WebGLTexture;
    new(): WebGLTexture;
};

interface WebGLTransformFeedback extends WebGLObject {
}

declare var WebGLTransformFeedback: {
    prototype: WebGLTransformFeedback;
    new(): WebGLTransformFeedback;
};

interface WebGLVertexArrayObject extends WebGLObject {
}

declare var WebGLVertexArrayObject: {
    prototype: WebGLVertexArrayObject;
    new(): WebGLVertexArrayObject;
};

interface WebGLQuery extends WebGLObject {
}

declare var WebGLQuery: {
    prototype: WebGLQuery;
    new(): WebGLQuery;
};

interface WebGLSync extends WebGLObject {
}

declare var WebGLSync: {
    prototype: WebGLSync;
    new(): WebGLSync;
};


interface WebGLSampler extends WebGLObject {
}

declare var WebGLSampler: {
    prototype: WebGLSampler;
    new(): WebGLSampler;
};

interface EXT_blend_minmax {
  readonly MAX_EXT: GLenum;
  readonly MIN_EXT: GLenum;
}


interface EXT_sRGB {
  readonly FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT: GLenum;
  readonly SRGB8_ALPHA8_EXT: GLenum;
  readonly SRGB_ALPHA_EXT: GLenum;
  readonly SRGB_EXT: GLenum;
}

interface EXT_shader_texture_lod {
}

/** The EXT_texture_filter_anisotropic extension is part of the WebGL API and exposes two constants for anisotropic filtering (AF). */
interface EXT_texture_filter_anisotropic {
  readonly MAX_TEXTURE_MAX_ANISOTROPY_EXT: GLenum;
  readonly TEXTURE_MAX_ANISOTROPY_EXT: GLenum;
}

/** The EXT_frag_depth extension is part of the WebGL API and enables to set a depth value of a fragment from within the fragment shader. */
interface EXT_frag_depth {
}

/** The OES_element_index_uint extension is part of the WebGL API and adds support for gl.UNSIGNED_INT types to WebGLRenderingContext.drawElements(). */
interface OES_element_index_uint {
}

/** The OES_standard_derivatives extension is part of the WebGL API and adds the GLSL derivative functions dFdx, dFdy, and fwidth. */
interface OES_standard_derivatives {
  readonly FRAGMENT_SHADER_DERIVATIVE_HINT_OES: GLenum;
}

/** The OES_texture_float extension is part of the WebGL API and exposes floating-point pixel types for textures. */
interface OES_texture_float {
}

/** The OES_texture_float_linear extension is part of the WebGL API and allows linear filtering with floating-point pixel types for textures. */
interface OES_texture_float_linear {
}

/** The OES_texture_half_float extension is part of the WebGL API and adds texture formats with 16- (aka half float) and 32-bit floating-point components. */
interface OES_texture_half_float {
    readonly HALF_FLOAT_OES: GLenum;
}

/** The OES_texture_half_float_linear extension is part of the WebGL API and allows linear filtering with half floating-point pixel types for textures. */
interface OES_texture_half_float_linear {
}

interface OES_vertex_array_object {
  // bindVertexArrayOES(arrayObject: WebGLVertexArrayObjectOES | null): void;
  // createVertexArrayOES(): WebGLVertexArrayObjectOES | null;
  // deleteVertexArrayOES(arrayObject: WebGLVertexArrayObjectOES | null): void;
  // isVertexArrayOES(arrayObject: WebGLVertexArrayObjectOES | null): GLboolean;
  readonly VERTEX_ARRAY_BINDING_OES: GLenum;
}

interface WEBGL_color_buffer_float {
  readonly FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: GLenum;
  readonly RGBA32F_EXT: GLenum;
  readonly UNSIGNED_NORMALIZED_EXT: GLenum;
}

interface WEBGL_compressed_texture_astc {
  getSupportedProfiles(): string[];
  readonly COMPRESSED_RGBA_ASTC_10x10_KHR: GLenum;
  readonly COMPRESSED_RGBA_ASTC_10x5_KHR: GLenum;
  readonly COMPRESSED_RGBA_ASTC_10x6_KHR: GLenum;
  readonly COMPRESSED_RGBA_ASTC_10x8_KHR: GLenum;
  readonly COMPRESSED_RGBA_ASTC_12x10_KHR: GLenum;
  readonly COMPRESSED_RGBA_ASTC_12x12_KHR: GLenum;
  readonly COMPRESSED_RGBA_ASTC_4x4_KHR: GLenum;
  readonly COMPRESSED_RGBA_ASTC_5x4_KHR: GLenum;
  readonly COMPRESSED_RGBA_ASTC_5x5_KHR: GLenum;
  readonly COMPRESSED_RGBA_ASTC_6x5_KHR: GLenum;
  readonly COMPRESSED_RGBA_ASTC_6x6_KHR: GLenum;
  readonly COMPRESSED_RGBA_ASTC_8x5_KHR: GLenum;
  readonly COMPRESSED_RGBA_ASTC_8x6_KHR: GLenum;
  readonly COMPRESSED_RGBA_ASTC_8x8_KHR: GLenum;
  readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR: GLenum;
  readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR: GLenum;
  readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR: GLenum;
  readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR: GLenum;
  readonly COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR: GLenum;
  readonly COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR: GLenum;
  readonly COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR: GLenum;
  readonly COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR: GLenum;
  readonly COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR: GLenum;
  readonly COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR: GLenum;
  readonly COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR: GLenum;
  readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR: GLenum;
  readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR: GLenum;
  readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR: GLenum;
}

/** The WEBGL_compressed_texture_s3tc extension is part of the WebGL API and exposes four S3TC compressed texture formats. */
interface WEBGL_compressed_texture_s3tc {
  readonly COMPRESSED_RGBA_S3TC_DXT1_EXT: GLenum;
  readonly COMPRESSED_RGBA_S3TC_DXT3_EXT: GLenum;
  readonly COMPRESSED_RGBA_S3TC_DXT5_EXT: GLenum;
  readonly COMPRESSED_RGB_S3TC_DXT1_EXT: GLenum;
}

interface WEBGL_compressed_texture_s3tc_srgb {
  readonly COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT: GLenum;
  readonly COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT: GLenum;
  readonly COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT: GLenum;
  readonly COMPRESSED_SRGB_S3TC_DXT1_EXT: GLenum;
}

interface WEBGL_debug_shaders {
  getTranslatedShaderSource(shader: WebGLShader): string;
}

/** The WEBGL_debug_renderer_info extension is part of the WebGL API and exposes two constants with information about the graphics driver for debugging purposes. */
interface WEBGL_debug_renderer_info {
  readonly UNMASKED_RENDERER_WEBGL: GLenum;
  readonly UNMASKED_VENDOR_WEBGL: GLenum;
}

/** The WEBGL_depth_texture extension is part of the WebGL API and defines 2D depth and depth-stencil textures. */
interface WEBGL_depth_texture {
  readonly UNSIGNED_INT_24_8_WEBGL: GLenum;
}

interface WEBGL_draw_buffers {
  drawBuffersWEBGL(buffers: GLenum[]): void;
  readonly COLOR_ATTACHMENT0_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT10_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT11_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT12_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT13_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT14_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT15_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT1_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT2_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT3_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT4_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT5_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT6_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT7_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT8_WEBGL: GLenum;
  readonly COLOR_ATTACHMENT9_WEBGL: GLenum;
  readonly DRAW_BUFFER0_WEBGL: GLenum;
  readonly DRAW_BUFFER10_WEBGL: GLenum;
  readonly DRAW_BUFFER11_WEBGL: GLenum;
  readonly DRAW_BUFFER12_WEBGL: GLenum;
  readonly DRAW_BUFFER13_WEBGL: GLenum;
  readonly DRAW_BUFFER14_WEBGL: GLenum;
  readonly DRAW_BUFFER15_WEBGL: GLenum;
  readonly DRAW_BUFFER1_WEBGL: GLenum;
  readonly DRAW_BUFFER2_WEBGL: GLenum;
  readonly DRAW_BUFFER3_WEBGL: GLenum;
  readonly DRAW_BUFFER4_WEBGL: GLenum;
  readonly DRAW_BUFFER5_WEBGL: GLenum;
  readonly DRAW_BUFFER6_WEBGL: GLenum;
  readonly DRAW_BUFFER7_WEBGL: GLenum;
  readonly DRAW_BUFFER8_WEBGL: GLenum;
  readonly DRAW_BUFFER9_WEBGL: GLenum;
  readonly MAX_COLOR_ATTACHMENTS_WEBGL: GLenum;
  readonly MAX_DRAW_BUFFERS_WEBGL: GLenum;
}

interface WEBGL_lose_context {
  loseContext(): void;
  restoreContext(): void;
}

/** Part of the WebGL API and represents the information returned by calling the WebGLRenderingContext.getShaderPrecisionFormat() method. */
interface WebGLShaderPrecisionFormat {
  readonly precision: GLint;
  readonly rangeMax: GLint;
  readonly rangeMin: GLint;
}

declare var WebGLShaderPrecisionFormat: {
  prototype: WebGLShaderPrecisionFormat;
  new(): WebGLShaderPrecisionFormat;
};

/** Part of the WebGL API and represents the location of a uniform variable in a shader program. */
interface WebGLUniformLocation {
}

declare var WebGLUniformLocation: {
    prototype: WebGLUniformLocation;
    new(): WebGLUniformLocation;
};

/** The ANGLE_instanced_arrays extension is part of the WebGL API and allows to draw the same object, or groups of similar objects multiple times, if they share the same vertex data, primitive count and type. */
interface ANGLE_instanced_arrays {
  drawArraysInstancedANGLE(mode: GLenum, first: GLint, count: GLsizei, primcount: GLsizei): void;
  drawElementsInstancedANGLE(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr, primcount: GLsizei): void;
  vertexAttribDivisorANGLE(index: GLuint, divisor: GLuint): void;
  readonly VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: GLenum;
}


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
  // "progress": ProgressEvent;
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

interface GlobalEventHandlers {
  /**
   * Fires when the user aborts the download.
   * @param ev The event.
   */
  onabort: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
  onanimationcancel: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
  onanimationend: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
  onanimationiteration: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
  onanimationstart: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
  onauxclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
  /**
   * Fires when the object loses the input focus.
   * @param ev The focus event.
   */
  onblur: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
  oncancel: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Occurs when playback is possible, but would require further buffering.
   * @param ev The event.
   */
  oncanplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  oncanplaythrough: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Fires when the contents of the object or selection have changed.
   * @param ev The event.
   */
  onchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Fires when the user clicks the left mouse button on the object
   * @param ev The mouse event.
   */
  onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
  onclose: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Fires when the user clicks the right mouse button in the client area, opening the context menu.
   * @param ev The mouse event.
   */
  oncontextmenu: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
  oncuechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Fires when the user double-clicks the object.
   * @param ev The mouse event.
   */
  ondblclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
  /**
   * Fires on the source object continuously during a drag operation.
   * @param ev The event.
   */
  // ondrag: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
  /**
   * Fires on the source object when the user releases the mouse at the close of a drag operation.
   * @param ev The event.
   */
  // ondragend: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
  /**
   * Fires on the target element when the user drags the object to a valid drop target.
   * @param ev The drag event.
   */
  // ondragenter: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
  ondragexit: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Fires on the target object when the user moves the mouse out of a valid drop target during a drag operation.
   * @param ev The drag event.
   */
  // ondragleave: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
  /**
   * Fires on the target element continuously while the user drags the object over a valid drop target.
   * @param ev The event.
   */
  // ondragover: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
  /**
   * Fires on the source object when the user starts to drag a text selection or selected object.
   * @param ev The event.
   */
  // ondragstart: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
  // ondrop: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
  /**
   * Occurs when the duration attribute is updated.
   * @param ev The event.
   */
  ondurationchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Occurs when the media element is reset to its initial state.
   * @param ev The event.
   */
  onemptied: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Occurs when the end of playback is reached.
   * @param ev The event
   */
  onended: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Fires when an error occurs during object loading.
   * @param ev The event.
   */
  onerror: OnErrorEventHandler;
  /**
   * Fires when the object receives focus.
   * @param ev The event.
   */
  onfocus: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
  ongotpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
  oninput: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  oninvalid: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Fires when the user presses a key.
   * @param ev The keyboard event
   */
  // onkeydown: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
  /**
   * Fires when the user presses an alphanumeric key.
   * @param ev The event.
   */
  // onkeypress: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
  /**
   * Fires when the user releases a key.
   * @param ev The keyboard event
   */
  // onkeyup: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
  /**
   * Fires immediately after the browser loads the object.
   * @param ev The event.
   */
  onload: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Occurs when media data is loaded at the current playback position.
   * @param ev The event.
   */
  onloadeddata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Occurs when the duration and dimensions of the media have been determined.
   * @param ev The event.
   */
  onloadedmetadata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Occurs when Internet Explorer begins looking for media data.
   * @param ev The event.
   */
  onloadstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  onlostpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
  /**
   * Fires when the user clicks the object with either mouse button.
   * @param ev The mouse event.
   */
  onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
  onmouseenter: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
  onmouseleave: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
  /**
   * Fires when the user moves the mouse over the object.
   * @param ev The mouse event.
   */
  onmousemove: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
  /**
   * Fires when the user moves the mouse pointer outside the boundaries of the object.
   * @param ev The mouse event.
   */
  onmouseout: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
  /**
   * Fires when the user moves the mouse pointer into the object.
   * @param ev The mouse event.
   */
  onmouseover: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
  /**
   * Fires when the user releases a mouse button while the mouse is over the object.
   * @param ev The mouse event.
   */
  onmouseup: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
  /**
   * Occurs when playback is paused.
   * @param ev The event.
   */
  onpause: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Occurs when the play method is requested.
   * @param ev The event.
   */
  onplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Occurs when the audio or video has started playing.
   * @param ev The event.
   */
  onplaying: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  onpointercancel: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
  onpointerdown: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
  onpointerenter: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
  onpointerleave: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
  onpointermove: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
  onpointerout: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
  onpointerover: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
  onpointerup: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
  /**
   * Occurs to indicate progress while downloading media data.
   * @param ev The event.
   */
  // onprogress: ((this: GlobalEventHandlers, ev: ProgressEvent) => any) | null;
  /**
   * Occurs when the playback rate is increased or decreased.
   * @param ev The event.
   */
  onratechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Fires when the user resets a form.
   * @param ev The event.
   */
  onreset: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  onresize: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
  /**
   * Fires when the user repositions the scroll box in the scroll bar on the object.
   * @param ev The event.
   */
  onscroll: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  // onsecuritypolicyviolation: ((this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any) | null;
  /**
   * Occurs when the seek operation ends.
   * @param ev The event.
   */
  onseeked: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Occurs when the current playback position is moved.
   * @param ev The event.
   */
  onseeking: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Fires when the current selection changes.
   * @param ev The event.
   */
  onselect: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  onselectionchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  onselectstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Occurs when the download has stopped.
   * @param ev The event.
   */
  onstalled: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  onsubmit: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Occurs if the load operation has been intentionally halted.
   * @param ev The event.
   */
  onsuspend: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Occurs to indicate the current playback position.
   * @param ev The event.
   */
  ontimeupdate: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  ontoggle: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  ontouchcancel?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null;
  ontouchend?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null;
  ontouchmove?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null;
  ontouchstart?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null;
  // ontransitioncancel: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
  // ontransitionend: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
  // ontransitionrun: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
  // ontransitionstart: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
  /**
   * Occurs when the volume is changed, or playback is muted or unmuted.
   * @param ev The event.
   */
  onvolumechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  /**
   * Occurs when playback stops because the next frame of a video resource is not available.
   * @param ev The event.
   */
  onwaiting: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  // onwheel: ((this: GlobalEventHandlers, ev: WheelEvent) => any) | null;
  addEventListener<K extends keyof GlobalEventHandlersEventMap>(type: K, listener: (this: GlobalEventHandlers, ev: GlobalEventHandlersEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof GlobalEventHandlersEventMap>(type: K, listener: (this: GlobalEventHandlers, ev: GlobalEventHandlersEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

interface Error {
  name: string;
  message: string;
  stack?: string;
}

interface OnErrorEventHandlerNonNull {
  (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error): any;
}


/**
 * Fires when an error occurs during object loading.
 * @param ev The event.
 */
// declare var onerror: OnErrorEventHandler;

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

interface DOMRectInit {
  height?: number;
  width?: number;
  x?: number;
  y?: number;
}

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

interface ImageBitmapRenderingContext {
  /**
   * Returns the canvas element that the context is bound to.
   */
  readonly canvas: HTMLCanvasElement | OffscreenCanvas;
  /**
   * Transfers the underlying bitmap data from imageBitmap to context, and the bitmap becomes the contents of the canvas element to which context is bound.
   */
  transferFromImageBitmap(bitmap: ImageBitmap | null): void;
}

/** Provides an interface to the OpenGL ES 2.0 graphics rendering context for the drawing surface of an HTML <canvas> element. */
interface WebGLRenderingContext extends WebGLRenderingContextBase, WebGLRenderingContextOverloads {
}

declare var WebGLRenderingContext: {
    prototype: WebGLRenderingContext;
    new(): WebGLRenderingContext;
    readonly ACTIVE_ATTRIBUTES: GLenum;
    readonly ACTIVE_TEXTURE: GLenum;
    readonly ACTIVE_UNIFORMS: GLenum;
    readonly ALIASED_LINE_WIDTH_RANGE: GLenum;
    readonly ALIASED_POINT_SIZE_RANGE: GLenum;
    readonly ALPHA: GLenum;
    readonly ALPHA_BITS: GLenum;
    readonly ALWAYS: GLenum;
    readonly ARRAY_BUFFER: GLenum;
    readonly ARRAY_BUFFER_BINDING: GLenum;
    readonly ATTACHED_SHADERS: GLenum;
    readonly BACK: GLenum;
    readonly BLEND: GLenum;
    readonly BLEND_COLOR: GLenum;
    readonly BLEND_DST_ALPHA: GLenum;
    readonly BLEND_DST_RGB: GLenum;
    readonly BLEND_EQUATION: GLenum;
    readonly BLEND_EQUATION_ALPHA: GLenum;
    readonly BLEND_EQUATION_RGB: GLenum;
    readonly BLEND_SRC_ALPHA: GLenum;
    readonly BLEND_SRC_RGB: GLenum;
    readonly BLUE_BITS: GLenum;
    readonly BOOL: GLenum;
    readonly BOOL_VEC2: GLenum;
    readonly BOOL_VEC3: GLenum;
    readonly BOOL_VEC4: GLenum;
    readonly BROWSER_DEFAULT_WEBGL: GLenum;
    readonly BUFFER_SIZE: GLenum;
    readonly BUFFER_USAGE: GLenum;
    readonly BYTE: GLenum;
    readonly CCW: GLenum;
    readonly CLAMP_TO_EDGE: GLenum;
    readonly COLOR_ATTACHMENT0: GLenum;
    readonly COLOR_BUFFER_BIT: GLenum;
    readonly COLOR_CLEAR_VALUE: GLenum;
    readonly COLOR_WRITEMASK: GLenum;
    readonly COMPILE_STATUS: GLenum;
    readonly COMPRESSED_TEXTURE_FORMATS: GLenum;
    readonly CONSTANT_ALPHA: GLenum;
    readonly CONSTANT_COLOR: GLenum;
    readonly CONTEXT_LOST_WEBGL: GLenum;
    readonly CULL_FACE: GLenum;
    readonly CULL_FACE_MODE: GLenum;
    readonly CURRENT_PROGRAM: GLenum;
    readonly CURRENT_VERTEX_ATTRIB: GLenum;
    readonly CW: GLenum;
    readonly DECR: GLenum;
    readonly DECR_WRAP: GLenum;
    readonly DELETE_STATUS: GLenum;
    readonly DEPTH_ATTACHMENT: GLenum;
    readonly DEPTH_BITS: GLenum;
    readonly DEPTH_BUFFER_BIT: GLenum;
    readonly DEPTH_CLEAR_VALUE: GLenum;
    readonly DEPTH_COMPONENT: GLenum;
    readonly DEPTH_COMPONENT16: GLenum;
    readonly DEPTH_FUNC: GLenum;
    readonly DEPTH_RANGE: GLenum;
    readonly DEPTH_STENCIL: GLenum;
    readonly DEPTH_STENCIL_ATTACHMENT: GLenum;
    readonly DEPTH_TEST: GLenum;
    readonly DEPTH_WRITEMASK: GLenum;
    readonly DITHER: GLenum;
    readonly DONT_CARE: GLenum;
    readonly DST_ALPHA: GLenum;
    readonly DST_COLOR: GLenum;
    readonly DYNAMIC_DRAW: GLenum;
    readonly ELEMENT_ARRAY_BUFFER: GLenum;
    readonly ELEMENT_ARRAY_BUFFER_BINDING: GLenum;
    readonly EQUAL: GLenum;
    readonly FASTEST: GLenum;
    readonly FLOAT: GLenum;
    readonly FLOAT_MAT2: GLenum;
    readonly FLOAT_MAT3: GLenum;
    readonly FLOAT_MAT4: GLenum;
    readonly FLOAT_VEC2: GLenum;
    readonly FLOAT_VEC3: GLenum;
    readonly FLOAT_VEC4: GLenum;
    readonly FRAGMENT_SHADER: GLenum;
    readonly FRAMEBUFFER: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: GLenum;
    readonly FRAMEBUFFER_BINDING: GLenum;
    readonly FRAMEBUFFER_COMPLETE: GLenum;
    readonly FRAMEBUFFER_INCOMPLETE_ATTACHMENT: GLenum;
    readonly FRAMEBUFFER_INCOMPLETE_DIMENSIONS: GLenum;
    readonly FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: GLenum;
    readonly FRAMEBUFFER_UNSUPPORTED: GLenum;
    readonly FRONT: GLenum;
    readonly FRONT_AND_BACK: GLenum;
    readonly FRONT_FACE: GLenum;
    readonly FUNC_ADD: GLenum;
    readonly FUNC_REVERSE_SUBTRACT: GLenum;
    readonly FUNC_SUBTRACT: GLenum;
    readonly GENERATE_MIPMAP_HINT: GLenum;
    readonly GEQUAL: GLenum;
    readonly GREATER: GLenum;
    readonly GREEN_BITS: GLenum;
    readonly HIGH_FLOAT: GLenum;
    readonly HIGH_INT: GLenum;
    readonly IMPLEMENTATION_COLOR_READ_FORMAT: GLenum;
    readonly IMPLEMENTATION_COLOR_READ_TYPE: GLenum;
    readonly INCR: GLenum;
    readonly INCR_WRAP: GLenum;
    readonly INT: GLenum;
    readonly INT_VEC2: GLenum;
    readonly INT_VEC3: GLenum;
    readonly INT_VEC4: GLenum;
    readonly INVALID_ENUM: GLenum;
    readonly INVALID_FRAMEBUFFER_OPERATION: GLenum;
    readonly INVALID_OPERATION: GLenum;
    readonly INVALID_VALUE: GLenum;
    readonly INVERT: GLenum;
    readonly KEEP: GLenum;
    readonly LEQUAL: GLenum;
    readonly LESS: GLenum;
    readonly LINEAR: GLenum;
    readonly LINEAR_MIPMAP_LINEAR: GLenum;
    readonly LINEAR_MIPMAP_NEAREST: GLenum;
    readonly LINES: GLenum;
    readonly LINE_LOOP: GLenum;
    readonly LINE_STRIP: GLenum;
    readonly LINE_WIDTH: GLenum;
    readonly LINK_STATUS: GLenum;
    readonly LOW_FLOAT: GLenum;
    readonly LOW_INT: GLenum;
    readonly LUMINANCE: GLenum;
    readonly LUMINANCE_ALPHA: GLenum;
    readonly MAX_COMBINED_TEXTURE_IMAGE_UNITS: GLenum;
    readonly MAX_CUBE_MAP_TEXTURE_SIZE: GLenum;
    readonly MAX_FRAGMENT_UNIFORM_VECTORS: GLenum;
    readonly MAX_RENDERBUFFER_SIZE: GLenum;
    readonly MAX_TEXTURE_IMAGE_UNITS: GLenum;
    readonly MAX_TEXTURE_SIZE: GLenum;
    readonly MAX_VARYING_VECTORS: GLenum;
    readonly MAX_VERTEX_ATTRIBS: GLenum;
    readonly MAX_VERTEX_TEXTURE_IMAGE_UNITS: GLenum;
    readonly MAX_VERTEX_UNIFORM_VECTORS: GLenum;
    readonly MAX_VIEWPORT_DIMS: GLenum;
    readonly MEDIUM_FLOAT: GLenum;
    readonly MEDIUM_INT: GLenum;
    readonly MIRRORED_REPEAT: GLenum;
    readonly NEAREST: GLenum;
    readonly NEAREST_MIPMAP_LINEAR: GLenum;
    readonly NEAREST_MIPMAP_NEAREST: GLenum;
    readonly NEVER: GLenum;
    readonly NICEST: GLenum;
    readonly NONE: GLenum;
    readonly NOTEQUAL: GLenum;
    readonly NO_ERROR: GLenum;
    readonly ONE: GLenum;
    readonly ONE_MINUS_CONSTANT_ALPHA: GLenum;
    readonly ONE_MINUS_CONSTANT_COLOR: GLenum;
    readonly ONE_MINUS_DST_ALPHA: GLenum;
    readonly ONE_MINUS_DST_COLOR: GLenum;
    readonly ONE_MINUS_SRC_ALPHA: GLenum;
    readonly ONE_MINUS_SRC_COLOR: GLenum;
    readonly OUT_OF_MEMORY: GLenum;
    readonly PACK_ALIGNMENT: GLenum;
    readonly POINTS: GLenum;
    readonly POLYGON_OFFSET_FACTOR: GLenum;
    readonly POLYGON_OFFSET_FILL: GLenum;
    readonly POLYGON_OFFSET_UNITS: GLenum;
    readonly RED_BITS: GLenum;
    readonly RENDERBUFFER: GLenum;
    readonly RENDERBUFFER_ALPHA_SIZE: GLenum;
    readonly RENDERBUFFER_BINDING: GLenum;
    readonly RENDERBUFFER_BLUE_SIZE: GLenum;
    readonly RENDERBUFFER_DEPTH_SIZE: GLenum;
    readonly RENDERBUFFER_GREEN_SIZE: GLenum;
    readonly RENDERBUFFER_HEIGHT: GLenum;
    readonly RENDERBUFFER_INTERNAL_FORMAT: GLenum;
    readonly RENDERBUFFER_RED_SIZE: GLenum;
    readonly RENDERBUFFER_STENCIL_SIZE: GLenum;
    readonly RENDERBUFFER_WIDTH: GLenum;
    readonly RENDERER: GLenum;
    readonly REPEAT: GLenum;
    readonly REPLACE: GLenum;
    readonly RGB: GLenum;
    readonly RGB565: GLenum;
    readonly RGB5_A1: GLenum;
    readonly RGBA: GLenum;
    readonly RGBA4: GLenum;
    readonly SAMPLER_2D: GLenum;
    readonly SAMPLER_CUBE: GLenum;
    readonly SAMPLES: GLenum;
    readonly SAMPLE_ALPHA_TO_COVERAGE: GLenum;
    readonly SAMPLE_BUFFERS: GLenum;
    readonly SAMPLE_COVERAGE: GLenum;
    readonly SAMPLE_COVERAGE_INVERT: GLenum;
    readonly SAMPLE_COVERAGE_VALUE: GLenum;
    readonly SCISSOR_BOX: GLenum;
    readonly SCISSOR_TEST: GLenum;
    readonly SHADER_TYPE: GLenum;
    readonly SHADING_LANGUAGE_VERSION: GLenum;
    readonly SHORT: GLenum;
    readonly SRC_ALPHA: GLenum;
    readonly SRC_ALPHA_SATURATE: GLenum;
    readonly SRC_COLOR: GLenum;
    readonly STATIC_DRAW: GLenum;
    readonly STENCIL_ATTACHMENT: GLenum;
    readonly STENCIL_BACK_FAIL: GLenum;
    readonly STENCIL_BACK_FUNC: GLenum;
    readonly STENCIL_BACK_PASS_DEPTH_FAIL: GLenum;
    readonly STENCIL_BACK_PASS_DEPTH_PASS: GLenum;
    readonly STENCIL_BACK_REF: GLenum;
    readonly STENCIL_BACK_VALUE_MASK: GLenum;
    readonly STENCIL_BACK_WRITEMASK: GLenum;
    readonly STENCIL_BITS: GLenum;
    readonly STENCIL_BUFFER_BIT: GLenum;
    readonly STENCIL_CLEAR_VALUE: GLenum;
    readonly STENCIL_FAIL: GLenum;
    readonly STENCIL_FUNC: GLenum;
    readonly STENCIL_INDEX8: GLenum;
    readonly STENCIL_PASS_DEPTH_FAIL: GLenum;
    readonly STENCIL_PASS_DEPTH_PASS: GLenum;
    readonly STENCIL_REF: GLenum;
    readonly STENCIL_TEST: GLenum;
    readonly STENCIL_VALUE_MASK: GLenum;
    readonly STENCIL_WRITEMASK: GLenum;
    readonly STREAM_DRAW: GLenum;
    readonly SUBPIXEL_BITS: GLenum;
    readonly TEXTURE: GLenum;
    readonly TEXTURE0: GLenum;
    readonly TEXTURE1: GLenum;
    readonly TEXTURE10: GLenum;
    readonly TEXTURE11: GLenum;
    readonly TEXTURE12: GLenum;
    readonly TEXTURE13: GLenum;
    readonly TEXTURE14: GLenum;
    readonly TEXTURE15: GLenum;
    readonly TEXTURE16: GLenum;
    readonly TEXTURE17: GLenum;
    readonly TEXTURE18: GLenum;
    readonly TEXTURE19: GLenum;
    readonly TEXTURE2: GLenum;
    readonly TEXTURE20: GLenum;
    readonly TEXTURE21: GLenum;
    readonly TEXTURE22: GLenum;
    readonly TEXTURE23: GLenum;
    readonly TEXTURE24: GLenum;
    readonly TEXTURE25: GLenum;
    readonly TEXTURE26: GLenum;
    readonly TEXTURE27: GLenum;
    readonly TEXTURE28: GLenum;
    readonly TEXTURE29: GLenum;
    readonly TEXTURE3: GLenum;
    readonly TEXTURE30: GLenum;
    readonly TEXTURE31: GLenum;
    readonly TEXTURE4: GLenum;
    readonly TEXTURE5: GLenum;
    readonly TEXTURE6: GLenum;
    readonly TEXTURE7: GLenum;
    readonly TEXTURE8: GLenum;
    readonly TEXTURE9: GLenum;
    readonly TEXTURE_2D: GLenum;
    readonly TEXTURE_BINDING_2D: GLenum;
    readonly TEXTURE_BINDING_CUBE_MAP: GLenum;
    readonly TEXTURE_CUBE_MAP: GLenum;
    readonly TEXTURE_CUBE_MAP_NEGATIVE_X: GLenum;
    readonly TEXTURE_CUBE_MAP_NEGATIVE_Y: GLenum;
    readonly TEXTURE_CUBE_MAP_NEGATIVE_Z: GLenum;
    readonly TEXTURE_CUBE_MAP_POSITIVE_X: GLenum;
    readonly TEXTURE_CUBE_MAP_POSITIVE_Y: GLenum;
    readonly TEXTURE_CUBE_MAP_POSITIVE_Z: GLenum;
    readonly TEXTURE_MAG_FILTER: GLenum;
    readonly TEXTURE_MIN_FILTER: GLenum;
    readonly TEXTURE_WRAP_S: GLenum;
    readonly TEXTURE_WRAP_T: GLenum;
    readonly TRIANGLES: GLenum;
    readonly TRIANGLE_FAN: GLenum;
    readonly TRIANGLE_STRIP: GLenum;
    readonly UNPACK_ALIGNMENT: GLenum;
    readonly UNPACK_COLORSPACE_CONVERSION_WEBGL: GLenum;
    readonly UNPACK_FLIP_Y_WEBGL: GLenum;
    readonly UNPACK_PREMULTIPLY_ALPHA_WEBGL: GLenum;
    readonly UNSIGNED_BYTE: GLenum;
    readonly UNSIGNED_INT: GLenum;
    readonly UNSIGNED_SHORT: GLenum;
    readonly UNSIGNED_SHORT_4_4_4_4: GLenum;
    readonly UNSIGNED_SHORT_5_5_5_1: GLenum;
    readonly UNSIGNED_SHORT_5_6_5: GLenum;
    readonly VALIDATE_STATUS: GLenum;
    readonly VENDOR: GLenum;
    readonly VERSION: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_ENABLED: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_NORMALIZED: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_POINTER: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_SIZE: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_STRIDE: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_TYPE: GLenum;
    readonly VERTEX_SHADER: GLenum;
    readonly VIEWPORT: GLenum;
    readonly ZERO: GLenum;
};

interface WebGLRenderingContextBase {
    readonly canvas: HTMLCanvasElement | OffscreenCanvas;
    readonly drawingBufferHeight: GLsizei;
    readonly drawingBufferWidth: GLsizei;
    activeTexture(texture: GLenum): void;
    attachShader(program: WebGLProgram, shader: WebGLShader): void;
    bindAttribLocation(program: WebGLProgram, index: GLuint, name: string): void;
    bindBuffer(target: GLenum, buffer: WebGLBuffer | null): void;
    bindFramebuffer(target: GLenum, framebuffer: WebGLFramebuffer | null): void;
    bindRenderbuffer(target: GLenum, renderbuffer: WebGLRenderbuffer | null): void;
    bindTexture(target: GLenum, texture: WebGLTexture | null): void;
    blendColor(red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf): void;
    blendEquation(mode: GLenum): void;
    blendEquationSeparate(modeRGB: GLenum, modeAlpha: GLenum): void;
    blendFunc(sfactor: GLenum, dfactor: GLenum): void;
    blendFuncSeparate(srcRGB: GLenum, dstRGB: GLenum, srcAlpha: GLenum, dstAlpha: GLenum): void;
    checkFramebufferStatus(target: GLenum): GLenum;
    clear(mask: GLbitfield): void;
    clearColor(red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf): void;
    clearDepth(depth: GLclampf): void;
    clearStencil(s: GLint): void;
    colorMask(red: GLboolean, green: GLboolean, blue: GLboolean, alpha: GLboolean): void;
    compileShader(shader: WebGLShader): void;
    copyTexImage2D(target: GLenum, level: GLint, internalformat: GLenum, x: GLint, y: GLint, width: GLsizei, height: GLsizei, border: GLint): void;
    copyTexSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, x: GLint, y: GLint, width: GLsizei, height: GLsizei): void;
    createBuffer(): WebGLBuffer | null;
    createFramebuffer(): WebGLFramebuffer | null;
    createProgram(): WebGLProgram | null;
    createRenderbuffer(): WebGLRenderbuffer | null;
    createShader(type: GLenum): WebGLShader | null;
    createTexture(): WebGLTexture | null;
    cullFace(mode: GLenum): void;
    deleteBuffer(buffer: WebGLBuffer | null): void;
    deleteFramebuffer(framebuffer: WebGLFramebuffer | null): void;
    deleteProgram(program: WebGLProgram | null): void;
    deleteRenderbuffer(renderbuffer: WebGLRenderbuffer | null): void;
    deleteShader(shader: WebGLShader | null): void;
    deleteTexture(texture: WebGLTexture | null): void;
    depthFunc(func: GLenum): void;
    depthMask(flag: GLboolean): void;
    depthRange(zNear: GLclampf, zFar: GLclampf): void;
    detachShader(program: WebGLProgram, shader: WebGLShader): void;
    disable(cap: GLenum): void;
    disableVertexAttribArray(index: GLuint): void;
    drawArrays(mode: GLenum, first: GLint, count: GLsizei): void;
    drawElements(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr): void;
    enable(cap: GLenum): void;
    enableVertexAttribArray(index: GLuint): void;
    finish(): void;
    flush(): void;
    framebufferRenderbuffer(target: GLenum, attachment: GLenum, renderbuffertarget: GLenum, renderbuffer: WebGLRenderbuffer | null): void;
    framebufferTexture2D(target: GLenum, attachment: GLenum, textarget: GLenum, texture: WebGLTexture | null, level: GLint): void;
    frontFace(mode: GLenum): void;
    generateMipmap(target: GLenum): void;
    getActiveAttrib(program: WebGLProgram, index: GLuint): WebGLActiveInfo | null;
    getActiveUniform(program: WebGLProgram, index: GLuint): WebGLActiveInfo | null;
    getAttachedShaders(program: WebGLProgram): WebGLShader[] | null;
    getAttribLocation(program: WebGLProgram, name: string): GLint;
    getBufferParameter(target: GLenum, pname: GLenum): any;
    getContextAttributes(): WebGLContextAttributes | null;
    getError(): GLenum;
    getExtension(extensionName: "EXT_blend_minmax"): EXT_blend_minmax | null;
    getExtension(extensionName: "EXT_texture_filter_anisotropic"): EXT_texture_filter_anisotropic | null;
    getExtension(extensionName: "EXT_frag_depth"): EXT_frag_depth | null;
    getExtension(extensionName: "EXT_shader_texture_lod"): EXT_shader_texture_lod | null;
    getExtension(extensionName: "EXT_sRGB"): EXT_sRGB | null;
    getExtension(extensionName: "OES_vertex_array_object"): OES_vertex_array_object | null;
    getExtension(extensionName: "WEBGL_color_buffer_float"): WEBGL_color_buffer_float | null;
    getExtension(extensionName: "WEBGL_compressed_texture_astc"): WEBGL_compressed_texture_astc | null;
    getExtension(extensionName: "WEBGL_compressed_texture_s3tc_srgb"): WEBGL_compressed_texture_s3tc_srgb | null;
    getExtension(extensionName: "WEBGL_debug_shaders"): WEBGL_debug_shaders | null;
    getExtension(extensionName: "WEBGL_draw_buffers"): WEBGL_draw_buffers | null;
    getExtension(extensionName: "WEBGL_lose_context"): WEBGL_lose_context | null;
    getExtension(extensionName: "WEBGL_depth_texture"): WEBGL_depth_texture | null;
    getExtension(extensionName: "WEBGL_debug_renderer_info"): WEBGL_debug_renderer_info | null;
    getExtension(extensionName: "WEBGL_compressed_texture_s3tc"): WEBGL_compressed_texture_s3tc | null;
    getExtension(extensionName: "OES_texture_half_float_linear"): OES_texture_half_float_linear | null;
    getExtension(extensionName: "OES_texture_half_float"): OES_texture_half_float | null;
    getExtension(extensionName: "OES_texture_float_linear"): OES_texture_float_linear | null;
    getExtension(extensionName: "OES_texture_float"): OES_texture_float | null;
    getExtension(extensionName: "OES_standard_derivatives"): OES_standard_derivatives | null;
    getExtension(extensionName: "OES_element_index_uint"): OES_element_index_uint | null;
    getExtension(extensionName: "ANGLE_instanced_arrays"): ANGLE_instanced_arrays | null;
    getExtension(extensionName: string): any;
    getFramebufferAttachmentParameter(target: GLenum, attachment: GLenum, pname: GLenum): any;
    getParameter(pname: GLenum): any;
    getProgramInfoLog(program: WebGLProgram): string | null;
    getProgramParameter(program: WebGLProgram, pname: GLenum): any;
    getRenderbufferParameter(target: GLenum, pname: GLenum): any;
    getShaderInfoLog(shader: WebGLShader): string | null;
    getShaderParameter(shader: WebGLShader, pname: GLenum): any;
    getShaderPrecisionFormat(shadertype: GLenum, precisiontype: GLenum): WebGLShaderPrecisionFormat | null;
    getShaderSource(shader: WebGLShader): string | null;
    getSupportedExtensions(): string[] | null;
    getTexParameter(target: GLenum, pname: GLenum): any;
    getUniform(program: WebGLProgram, location: WebGLUniformLocation): any;
    getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation | null;
    getVertexAttrib(index: GLuint, pname: GLenum): any;
    getVertexAttribOffset(index: GLuint, pname: GLenum): GLintptr;
    hint(target: GLenum, mode: GLenum): void;
    isBuffer(buffer: WebGLBuffer | null): GLboolean;
    isContextLost(): boolean;
    isEnabled(cap: GLenum): GLboolean;
    isFramebuffer(framebuffer: WebGLFramebuffer | null): GLboolean;
    isProgram(program: WebGLProgram | null): GLboolean;
    isRenderbuffer(renderbuffer: WebGLRenderbuffer | null): GLboolean;
    isShader(shader: WebGLShader | null): GLboolean;
    isTexture(texture: WebGLTexture | null): GLboolean;
    lineWidth(width: GLfloat): void;
    linkProgram(program: WebGLProgram): void;
    pixelStorei(pname: GLenum, param: GLint | GLboolean): void;
    polygonOffset(factor: GLfloat, units: GLfloat): void;
    renderbufferStorage(target: GLenum, internalformat: GLenum, width: GLsizei, height: GLsizei): void;
    sampleCoverage(value: GLclampf, invert: GLboolean): void;
    scissor(x: GLint, y: GLint, width: GLsizei, height: GLsizei): void;
    shaderSource(shader: WebGLShader, source: string): void;
    stencilFunc(func: GLenum, ref: GLint, mask: GLuint): void;
    stencilFuncSeparate(face: GLenum, func: GLenum, ref: GLint, mask: GLuint): void;
    stencilMask(mask: GLuint): void;
    stencilMaskSeparate(face: GLenum, mask: GLuint): void;
    stencilOp(fail: GLenum, zfail: GLenum, zpass: GLenum): void;
    stencilOpSeparate(face: GLenum, fail: GLenum, zfail: GLenum, zpass: GLenum): void;
    texParameterf(target: GLenum, pname: GLenum, param: GLfloat): void;
    texParameteri(target: GLenum, pname: GLenum, param: GLint): void;
    uniform1f(location: WebGLUniformLocation | null, x: GLfloat): void;
    uniform1i(location: WebGLUniformLocation | null, x: GLint): void;
    uniform2f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat): void;
    uniform2i(location: WebGLUniformLocation | null, x: GLint, y: GLint): void;
    uniform3f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat, z: GLfloat): void;
    uniform3i(location: WebGLUniformLocation | null, x: GLint, y: GLint, z: GLint): void;
    uniform4f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat): void;
    uniform4i(location: WebGLUniformLocation | null, x: GLint, y: GLint, z: GLint, w: GLint): void;
    useProgram(program: WebGLProgram | null): void;
    validateProgram(program: WebGLProgram): void;
    vertexAttrib1f(index: GLuint, x: GLfloat): void;
    vertexAttrib1fv(index: GLuint, values: Float32List): void;
    vertexAttrib2f(index: GLuint, x: GLfloat, y: GLfloat): void;
    vertexAttrib2fv(index: GLuint, values: Float32List): void;
    vertexAttrib3f(index: GLuint, x: GLfloat, y: GLfloat, z: GLfloat): void;
    vertexAttrib3fv(index: GLuint, values: Float32List): void;
    vertexAttrib4f(index: GLuint, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat): void;
    vertexAttrib4fv(index: GLuint, values: Float32List): void;
    vertexAttribPointer(index: GLuint, size: GLint, type: GLenum, normalized: GLboolean, stride: GLsizei, offset: GLintptr): void;
    viewport(x: GLint, y: GLint, width: GLsizei, height: GLsizei): void;
    readonly ACTIVE_ATTRIBUTES: GLenum;
    readonly ACTIVE_TEXTURE: GLenum;
    readonly ACTIVE_UNIFORMS: GLenum;
    readonly ALIASED_LINE_WIDTH_RANGE: GLenum;
    readonly ALIASED_POINT_SIZE_RANGE: GLenum;
    readonly ALPHA: GLenum;
    readonly ALPHA_BITS: GLenum;
    readonly ALWAYS: GLenum;
    readonly ARRAY_BUFFER: GLenum;
    readonly ARRAY_BUFFER_BINDING: GLenum;
    readonly ATTACHED_SHADERS: GLenum;
    readonly BACK: GLenum;
    readonly BLEND: GLenum;
    readonly BLEND_COLOR: GLenum;
    readonly BLEND_DST_ALPHA: GLenum;
    readonly BLEND_DST_RGB: GLenum;
    readonly BLEND_EQUATION: GLenum;
    readonly BLEND_EQUATION_ALPHA: GLenum;
    readonly BLEND_EQUATION_RGB: GLenum;
    readonly BLEND_SRC_ALPHA: GLenum;
    readonly BLEND_SRC_RGB: GLenum;
    readonly BLUE_BITS: GLenum;
    readonly BOOL: GLenum;
    readonly BOOL_VEC2: GLenum;
    readonly BOOL_VEC3: GLenum;
    readonly BOOL_VEC4: GLenum;
    readonly BROWSER_DEFAULT_WEBGL: GLenum;
    readonly BUFFER_SIZE: GLenum;
    readonly BUFFER_USAGE: GLenum;
    readonly BYTE: GLenum;
    readonly CCW: GLenum;
    readonly CLAMP_TO_EDGE: GLenum;
    readonly COLOR_ATTACHMENT0: GLenum;
    readonly COLOR_BUFFER_BIT: GLenum;
    readonly COLOR_CLEAR_VALUE: GLenum;
    readonly COLOR_WRITEMASK: GLenum;
    readonly COMPILE_STATUS: GLenum;
    readonly COMPRESSED_TEXTURE_FORMATS: GLenum;
    readonly CONSTANT_ALPHA: GLenum;
    readonly CONSTANT_COLOR: GLenum;
    readonly CONTEXT_LOST_WEBGL: GLenum;
    readonly CULL_FACE: GLenum;
    readonly CULL_FACE_MODE: GLenum;
    readonly CURRENT_PROGRAM: GLenum;
    readonly CURRENT_VERTEX_ATTRIB: GLenum;
    readonly CW: GLenum;
    readonly DECR: GLenum;
    readonly DECR_WRAP: GLenum;
    readonly DELETE_STATUS: GLenum;
    readonly DEPTH_ATTACHMENT: GLenum;
    readonly DEPTH_BITS: GLenum;
    readonly DEPTH_BUFFER_BIT: GLenum;
    readonly DEPTH_CLEAR_VALUE: GLenum;
    readonly DEPTH_COMPONENT: GLenum;
    readonly DEPTH_COMPONENT16: GLenum;
    readonly DEPTH_FUNC: GLenum;
    readonly DEPTH_RANGE: GLenum;
    readonly DEPTH_STENCIL: GLenum;
    readonly DEPTH_STENCIL_ATTACHMENT: GLenum;
    readonly DEPTH_TEST: GLenum;
    readonly DEPTH_WRITEMASK: GLenum;
    readonly DITHER: GLenum;
    readonly DONT_CARE: GLenum;
    readonly DST_ALPHA: GLenum;
    readonly DST_COLOR: GLenum;
    readonly DYNAMIC_DRAW: GLenum;
    readonly ELEMENT_ARRAY_BUFFER: GLenum;
    readonly ELEMENT_ARRAY_BUFFER_BINDING: GLenum;
    readonly EQUAL: GLenum;
    readonly FASTEST: GLenum;
    readonly FLOAT: GLenum;
    readonly FLOAT_MAT2: GLenum;
    readonly FLOAT_MAT3: GLenum;
    readonly FLOAT_MAT4: GLenum;
    readonly FLOAT_VEC2: GLenum;
    readonly FLOAT_VEC3: GLenum;
    readonly FLOAT_VEC4: GLenum;
    readonly FRAGMENT_SHADER: GLenum;
    readonly FRAMEBUFFER: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: GLenum;
    readonly FRAMEBUFFER_BINDING: GLenum;
    readonly FRAMEBUFFER_COMPLETE: GLenum;
    readonly FRAMEBUFFER_INCOMPLETE_ATTACHMENT: GLenum;
    readonly FRAMEBUFFER_INCOMPLETE_DIMENSIONS: GLenum;
    readonly FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: GLenum;
    readonly FRAMEBUFFER_UNSUPPORTED: GLenum;
    readonly FRONT: GLenum;
    readonly FRONT_AND_BACK: GLenum;
    readonly FRONT_FACE: GLenum;
    readonly FUNC_ADD: GLenum;
    readonly FUNC_REVERSE_SUBTRACT: GLenum;
    readonly FUNC_SUBTRACT: GLenum;
    readonly GENERATE_MIPMAP_HINT: GLenum;
    readonly GEQUAL: GLenum;
    readonly GREATER: GLenum;
    readonly GREEN_BITS: GLenum;
    readonly HIGH_FLOAT: GLenum;
    readonly HIGH_INT: GLenum;
    readonly IMPLEMENTATION_COLOR_READ_FORMAT: GLenum;
    readonly IMPLEMENTATION_COLOR_READ_TYPE: GLenum;
    readonly INCR: GLenum;
    readonly INCR_WRAP: GLenum;
    readonly INT: GLenum;
    readonly INT_VEC2: GLenum;
    readonly INT_VEC3: GLenum;
    readonly INT_VEC4: GLenum;
    readonly INVALID_ENUM: GLenum;
    readonly INVALID_FRAMEBUFFER_OPERATION: GLenum;
    readonly INVALID_OPERATION: GLenum;
    readonly INVALID_VALUE: GLenum;
    readonly INVERT: GLenum;
    readonly KEEP: GLenum;
    readonly LEQUAL: GLenum;
    readonly LESS: GLenum;
    readonly LINEAR: GLenum;
    readonly LINEAR_MIPMAP_LINEAR: GLenum;
    readonly LINEAR_MIPMAP_NEAREST: GLenum;
    readonly LINES: GLenum;
    readonly LINE_LOOP: GLenum;
    readonly LINE_STRIP: GLenum;
    readonly LINE_WIDTH: GLenum;
    readonly LINK_STATUS: GLenum;
    readonly LOW_FLOAT: GLenum;
    readonly LOW_INT: GLenum;
    readonly LUMINANCE: GLenum;
    readonly LUMINANCE_ALPHA: GLenum;
    readonly MAX_COMBINED_TEXTURE_IMAGE_UNITS: GLenum;
    readonly MAX_CUBE_MAP_TEXTURE_SIZE: GLenum;
    readonly MAX_FRAGMENT_UNIFORM_VECTORS: GLenum;
    readonly MAX_RENDERBUFFER_SIZE: GLenum;
    readonly MAX_TEXTURE_IMAGE_UNITS: GLenum;
    readonly MAX_TEXTURE_SIZE: GLenum;
    readonly MAX_VARYING_VECTORS: GLenum;
    readonly MAX_VERTEX_ATTRIBS: GLenum;
    readonly MAX_VERTEX_TEXTURE_IMAGE_UNITS: GLenum;
    readonly MAX_VERTEX_UNIFORM_VECTORS: GLenum;
    readonly MAX_VIEWPORT_DIMS: GLenum;
    readonly MEDIUM_FLOAT: GLenum;
    readonly MEDIUM_INT: GLenum;
    readonly MIRRORED_REPEAT: GLenum;
    readonly NEAREST: GLenum;
    readonly NEAREST_MIPMAP_LINEAR: GLenum;
    readonly NEAREST_MIPMAP_NEAREST: GLenum;
    readonly NEVER: GLenum;
    readonly NICEST: GLenum;
    readonly NONE: GLenum;
    readonly NOTEQUAL: GLenum;
    readonly NO_ERROR: GLenum;
    readonly ONE: GLenum;
    readonly ONE_MINUS_CONSTANT_ALPHA: GLenum;
    readonly ONE_MINUS_CONSTANT_COLOR: GLenum;
    readonly ONE_MINUS_DST_ALPHA: GLenum;
    readonly ONE_MINUS_DST_COLOR: GLenum;
    readonly ONE_MINUS_SRC_ALPHA: GLenum;
    readonly ONE_MINUS_SRC_COLOR: GLenum;
    readonly OUT_OF_MEMORY: GLenum;
    readonly PACK_ALIGNMENT: GLenum;
    readonly POINTS: GLenum;
    readonly POLYGON_OFFSET_FACTOR: GLenum;
    readonly POLYGON_OFFSET_FILL: GLenum;
    readonly POLYGON_OFFSET_UNITS: GLenum;
    readonly RED_BITS: GLenum;
    readonly RENDERBUFFER: GLenum;
    readonly RENDERBUFFER_ALPHA_SIZE: GLenum;
    readonly RENDERBUFFER_BINDING: GLenum;
    readonly RENDERBUFFER_BLUE_SIZE: GLenum;
    readonly RENDERBUFFER_DEPTH_SIZE: GLenum;
    readonly RENDERBUFFER_GREEN_SIZE: GLenum;
    readonly RENDERBUFFER_HEIGHT: GLenum;
    readonly RENDERBUFFER_INTERNAL_FORMAT: GLenum;
    readonly RENDERBUFFER_RED_SIZE: GLenum;
    readonly RENDERBUFFER_STENCIL_SIZE: GLenum;
    readonly RENDERBUFFER_WIDTH: GLenum;
    readonly RENDERER: GLenum;
    readonly REPEAT: GLenum;
    readonly REPLACE: GLenum;
    readonly RGB: GLenum;
    readonly RGB565: GLenum;
    readonly RGB5_A1: GLenum;
    readonly RGBA: GLenum;
    readonly RGBA4: GLenum;
    readonly SAMPLER_2D: GLenum;
    readonly SAMPLER_CUBE: GLenum;
    readonly SAMPLES: GLenum;
    readonly SAMPLE_ALPHA_TO_COVERAGE: GLenum;
    readonly SAMPLE_BUFFERS: GLenum;
    readonly SAMPLE_COVERAGE: GLenum;
    readonly SAMPLE_COVERAGE_INVERT: GLenum;
    readonly SAMPLE_COVERAGE_VALUE: GLenum;
    readonly SCISSOR_BOX: GLenum;
    readonly SCISSOR_TEST: GLenum;
    readonly SHADER_TYPE: GLenum;
    readonly SHADING_LANGUAGE_VERSION: GLenum;
    readonly SHORT: GLenum;
    readonly SRC_ALPHA: GLenum;
    readonly SRC_ALPHA_SATURATE: GLenum;
    readonly SRC_COLOR: GLenum;
    readonly STATIC_DRAW: GLenum;
    readonly STENCIL_ATTACHMENT: GLenum;
    readonly STENCIL_BACK_FAIL: GLenum;
    readonly STENCIL_BACK_FUNC: GLenum;
    readonly STENCIL_BACK_PASS_DEPTH_FAIL: GLenum;
    readonly STENCIL_BACK_PASS_DEPTH_PASS: GLenum;
    readonly STENCIL_BACK_REF: GLenum;
    readonly STENCIL_BACK_VALUE_MASK: GLenum;
    readonly STENCIL_BACK_WRITEMASK: GLenum;
    readonly STENCIL_BITS: GLenum;
    readonly STENCIL_BUFFER_BIT: GLenum;
    readonly STENCIL_CLEAR_VALUE: GLenum;
    readonly STENCIL_FAIL: GLenum;
    readonly STENCIL_FUNC: GLenum;
    readonly STENCIL_INDEX8: GLenum;
    readonly STENCIL_PASS_DEPTH_FAIL: GLenum;
    readonly STENCIL_PASS_DEPTH_PASS: GLenum;
    readonly STENCIL_REF: GLenum;
    readonly STENCIL_TEST: GLenum;
    readonly STENCIL_VALUE_MASK: GLenum;
    readonly STENCIL_WRITEMASK: GLenum;
    readonly STREAM_DRAW: GLenum;
    readonly SUBPIXEL_BITS: GLenum;
    readonly TEXTURE: GLenum;
    readonly TEXTURE0: GLenum;
    readonly TEXTURE1: GLenum;
    readonly TEXTURE10: GLenum;
    readonly TEXTURE11: GLenum;
    readonly TEXTURE12: GLenum;
    readonly TEXTURE13: GLenum;
    readonly TEXTURE14: GLenum;
    readonly TEXTURE15: GLenum;
    readonly TEXTURE16: GLenum;
    readonly TEXTURE17: GLenum;
    readonly TEXTURE18: GLenum;
    readonly TEXTURE19: GLenum;
    readonly TEXTURE2: GLenum;
    readonly TEXTURE20: GLenum;
    readonly TEXTURE21: GLenum;
    readonly TEXTURE22: GLenum;
    readonly TEXTURE23: GLenum;
    readonly TEXTURE24: GLenum;
    readonly TEXTURE25: GLenum;
    readonly TEXTURE26: GLenum;
    readonly TEXTURE27: GLenum;
    readonly TEXTURE28: GLenum;
    readonly TEXTURE29: GLenum;
    readonly TEXTURE3: GLenum;
    readonly TEXTURE30: GLenum;
    readonly TEXTURE31: GLenum;
    readonly TEXTURE4: GLenum;
    readonly TEXTURE5: GLenum;
    readonly TEXTURE6: GLenum;
    readonly TEXTURE7: GLenum;
    readonly TEXTURE8: GLenum;
    readonly TEXTURE9: GLenum;
    readonly TEXTURE_2D: GLenum;
    readonly TEXTURE_BINDING_2D: GLenum;
    readonly TEXTURE_BINDING_CUBE_MAP: GLenum;
    readonly TEXTURE_CUBE_MAP: GLenum;
    readonly TEXTURE_CUBE_MAP_NEGATIVE_X: GLenum;
    readonly TEXTURE_CUBE_MAP_NEGATIVE_Y: GLenum;
    readonly TEXTURE_CUBE_MAP_NEGATIVE_Z: GLenum;
    readonly TEXTURE_CUBE_MAP_POSITIVE_X: GLenum;
    readonly TEXTURE_CUBE_MAP_POSITIVE_Y: GLenum;
    readonly TEXTURE_CUBE_MAP_POSITIVE_Z: GLenum;
    readonly TEXTURE_MAG_FILTER: GLenum;
    readonly TEXTURE_MIN_FILTER: GLenum;
    readonly TEXTURE_WRAP_S: GLenum;
    readonly TEXTURE_WRAP_T: GLenum;
    readonly TRIANGLES: GLenum;
    readonly TRIANGLE_FAN: GLenum;
    readonly TRIANGLE_STRIP: GLenum;
    readonly UNPACK_ALIGNMENT: GLenum;
    readonly UNPACK_COLORSPACE_CONVERSION_WEBGL: GLenum;
    readonly UNPACK_FLIP_Y_WEBGL: GLenum;
    readonly UNPACK_PREMULTIPLY_ALPHA_WEBGL: GLenum;
    readonly UNSIGNED_BYTE: GLenum;
    readonly UNSIGNED_INT: GLenum;
    readonly UNSIGNED_SHORT: GLenum;
    readonly UNSIGNED_SHORT_4_4_4_4: GLenum;
    readonly UNSIGNED_SHORT_5_5_5_1: GLenum;
    readonly UNSIGNED_SHORT_5_6_5: GLenum;
    readonly VALIDATE_STATUS: GLenum;
    readonly VENDOR: GLenum;
    readonly VERSION: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_ENABLED: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_NORMALIZED: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_POINTER: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_SIZE: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_STRIDE: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_TYPE: GLenum;
    readonly VERTEX_SHADER: GLenum;
    readonly VIEWPORT: GLenum;
    readonly ZERO: GLenum;
}

interface WebGLRenderingContextOverloads {
    bufferData(target: GLenum, size: GLsizeiptr, usage: GLenum): void;
    bufferData(target: GLenum, data: BufferSource | null, usage: GLenum): void;
    bufferSubData(target: GLenum, offset: GLintptr, data: BufferSource): void;
    compressedTexImage2D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, border: GLint, data: ArrayBufferView): void;
    compressedTexSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, data: ArrayBufferView): void;
    readPixels(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pixels: ArrayBufferView | null): void;
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint, format: GLenum, type: GLenum, pixels: ArrayBufferView | null): void;
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, format: GLenum, type: GLenum, source: TexImageSource): void;
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pixels: ArrayBufferView | null): void;
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, format: GLenum, type: GLenum, source: TexImageSource): void;
    uniform1fv(location: WebGLUniformLocation | null, v: Float32List): void;
    uniform1iv(location: WebGLUniformLocation | null, v: Int32List): void;
    uniform2fv(location: WebGLUniformLocation | null, v: Float32List): void;
    uniform2iv(location: WebGLUniformLocation | null, v: Int32List): void;
    uniform3fv(location: WebGLUniformLocation | null, v: Float32List): void;
    uniform3iv(location: WebGLUniformLocation | null, v: Int32List): void;
    uniform4fv(location: WebGLUniformLocation | null, v: Float32List): void;
    uniform4iv(location: WebGLUniformLocation | null, v: Int32List): void;
    uniformMatrix2fv(location: WebGLUniformLocation | null, transpose: GLboolean, value: Float32List): void;
    uniformMatrix3fv(location: WebGLUniformLocation | null, transpose: GLboolean, value: Float32List): void;
    uniformMatrix4fv(location: WebGLUniformLocation | null, transpose: GLboolean, value: Float32List): void;
}

interface WebGL2RenderingContext extends WebGL2RenderingContextBase, WebGL2RenderingContextOverloads, WebGLRenderingContextBase {
}

declare var WebGL2RenderingContext: {
    prototype: WebGL2RenderingContext;
    new(): WebGL2RenderingContext;
    readonly ACTIVE_ATTRIBUTES: GLenum;
    readonly ACTIVE_TEXTURE: GLenum;
    readonly ACTIVE_UNIFORMS: GLenum;
    readonly ALIASED_LINE_WIDTH_RANGE: GLenum;
    readonly ALIASED_POINT_SIZE_RANGE: GLenum;
    readonly ALPHA: GLenum;
    readonly ALPHA_BITS: GLenum;
    readonly ALWAYS: GLenum;
    readonly ARRAY_BUFFER: GLenum;
    readonly ARRAY_BUFFER_BINDING: GLenum;
    readonly ATTACHED_SHADERS: GLenum;
    readonly BACK: GLenum;
    readonly BLEND: GLenum;
    readonly BLEND_COLOR: GLenum;
    readonly BLEND_DST_ALPHA: GLenum;
    readonly BLEND_DST_RGB: GLenum;
    readonly BLEND_EQUATION: GLenum;
    readonly BLEND_EQUATION_ALPHA: GLenum;
    readonly BLEND_EQUATION_RGB: GLenum;
    readonly BLEND_SRC_ALPHA: GLenum;
    readonly BLEND_SRC_RGB: GLenum;
    readonly BLUE_BITS: GLenum;
    readonly BOOL: GLenum;
    readonly BOOL_VEC2: GLenum;
    readonly BOOL_VEC3: GLenum;
    readonly BOOL_VEC4: GLenum;
    readonly BROWSER_DEFAULT_WEBGL: GLenum;
    readonly BUFFER_SIZE: GLenum;
    readonly BUFFER_USAGE: GLenum;
    readonly BYTE: GLenum;
    readonly CCW: GLenum;
    readonly CLAMP_TO_EDGE: GLenum;
    readonly COLOR_ATTACHMENT0: GLenum;
    readonly COLOR_BUFFER_BIT: GLenum;
    readonly COLOR_CLEAR_VALUE: GLenum;
    readonly COLOR_WRITEMASK: GLenum;
    readonly COMPILE_STATUS: GLenum;
    readonly COMPRESSED_TEXTURE_FORMATS: GLenum;
    readonly CONSTANT_ALPHA: GLenum;
    readonly CONSTANT_COLOR: GLenum;
    readonly CONTEXT_LOST_WEBGL: GLenum;
    readonly CULL_FACE: GLenum;
    readonly CULL_FACE_MODE: GLenum;
    readonly CURRENT_PROGRAM: GLenum;
    readonly CURRENT_VERTEX_ATTRIB: GLenum;
    readonly CW: GLenum;
    readonly DECR: GLenum;
    readonly DECR_WRAP: GLenum;
    readonly DELETE_STATUS: GLenum;
    readonly DEPTH_ATTACHMENT: GLenum;
    readonly DEPTH_BITS: GLenum;
    readonly DEPTH_BUFFER_BIT: GLenum;
    readonly DEPTH_CLEAR_VALUE: GLenum;
    readonly DEPTH_COMPONENT: GLenum;
    readonly DEPTH_COMPONENT16: GLenum;
    readonly DEPTH_FUNC: GLenum;
    readonly DEPTH_RANGE: GLenum;
    readonly DEPTH_STENCIL: GLenum;
    readonly DEPTH_STENCIL_ATTACHMENT: GLenum;
    readonly DEPTH_TEST: GLenum;
    readonly DEPTH_WRITEMASK: GLenum;
    readonly DITHER: GLenum;
    readonly DONT_CARE: GLenum;
    readonly DST_ALPHA: GLenum;
    readonly DST_COLOR: GLenum;
    readonly DYNAMIC_DRAW: GLenum;
    readonly ELEMENT_ARRAY_BUFFER: GLenum;
    readonly ELEMENT_ARRAY_BUFFER_BINDING: GLenum;
    readonly EQUAL: GLenum;
    readonly FASTEST: GLenum;
    readonly FLOAT: GLenum;
    readonly FLOAT_MAT2: GLenum;
    readonly FLOAT_MAT3: GLenum;
    readonly FLOAT_MAT4: GLenum;
    readonly FLOAT_VEC2: GLenum;
    readonly FLOAT_VEC3: GLenum;
    readonly FLOAT_VEC4: GLenum;
    readonly FRAGMENT_SHADER: GLenum;
    readonly FRAMEBUFFER: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: GLenum;
    readonly FRAMEBUFFER_BINDING: GLenum;
    readonly FRAMEBUFFER_COMPLETE: GLenum;
    readonly FRAMEBUFFER_INCOMPLETE_ATTACHMENT: GLenum;
    readonly FRAMEBUFFER_INCOMPLETE_DIMENSIONS: GLenum;
    readonly FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: GLenum;
    readonly FRAMEBUFFER_UNSUPPORTED: GLenum;
    readonly FRONT: GLenum;
    readonly FRONT_AND_BACK: GLenum;
    readonly FRONT_FACE: GLenum;
    readonly FUNC_ADD: GLenum;
    readonly FUNC_REVERSE_SUBTRACT: GLenum;
    readonly FUNC_SUBTRACT: GLenum;
    readonly GENERATE_MIPMAP_HINT: GLenum;
    readonly GEQUAL: GLenum;
    readonly GREATER: GLenum;
    readonly GREEN_BITS: GLenum;
    readonly HIGH_FLOAT: GLenum;
    readonly HIGH_INT: GLenum;
    readonly IMPLEMENTATION_COLOR_READ_FORMAT: GLenum;
    readonly IMPLEMENTATION_COLOR_READ_TYPE: GLenum;
    readonly INCR: GLenum;
    readonly INCR_WRAP: GLenum;
    readonly INT: GLenum;
    readonly INT_VEC2: GLenum;
    readonly INT_VEC3: GLenum;
    readonly INT_VEC4: GLenum;
    readonly INVALID_ENUM: GLenum;
    readonly INVALID_FRAMEBUFFER_OPERATION: GLenum;
    readonly INVALID_OPERATION: GLenum;
    readonly INVALID_VALUE: GLenum;
    readonly INVERT: GLenum;
    readonly KEEP: GLenum;
    readonly LEQUAL: GLenum;
    readonly LESS: GLenum;
    readonly LINEAR: GLenum;
    readonly LINEAR_MIPMAP_LINEAR: GLenum;
    readonly LINEAR_MIPMAP_NEAREST: GLenum;
    readonly LINES: GLenum;
    readonly LINE_LOOP: GLenum;
    readonly LINE_STRIP: GLenum;
    readonly LINE_WIDTH: GLenum;
    readonly LINK_STATUS: GLenum;
    readonly LOW_FLOAT: GLenum;
    readonly LOW_INT: GLenum;
    readonly LUMINANCE: GLenum;
    readonly LUMINANCE_ALPHA: GLenum;
    readonly MAX_COMBINED_TEXTURE_IMAGE_UNITS: GLenum;
    readonly MAX_CUBE_MAP_TEXTURE_SIZE: GLenum;
    readonly MAX_FRAGMENT_UNIFORM_VECTORS: GLenum;
    readonly MAX_RENDERBUFFER_SIZE: GLenum;
    readonly MAX_TEXTURE_IMAGE_UNITS: GLenum;
    readonly MAX_TEXTURE_SIZE: GLenum;
    readonly MAX_VARYING_VECTORS: GLenum;
    readonly MAX_VERTEX_ATTRIBS: GLenum;
    readonly MAX_VERTEX_TEXTURE_IMAGE_UNITS: GLenum;
    readonly MAX_VERTEX_UNIFORM_VECTORS: GLenum;
    readonly MAX_VIEWPORT_DIMS: GLenum;
    readonly MEDIUM_FLOAT: GLenum;
    readonly MEDIUM_INT: GLenum;
    readonly MIRRORED_REPEAT: GLenum;
    readonly NEAREST: GLenum;
    readonly NEAREST_MIPMAP_LINEAR: GLenum;
    readonly NEAREST_MIPMAP_NEAREST: GLenum;
    readonly NEVER: GLenum;
    readonly NICEST: GLenum;
    readonly NONE: GLenum;
    readonly NOTEQUAL: GLenum;
    readonly NO_ERROR: GLenum;
    readonly ONE: GLenum;
    readonly ONE_MINUS_CONSTANT_ALPHA: GLenum;
    readonly ONE_MINUS_CONSTANT_COLOR: GLenum;
    readonly ONE_MINUS_DST_ALPHA: GLenum;
    readonly ONE_MINUS_DST_COLOR: GLenum;
    readonly ONE_MINUS_SRC_ALPHA: GLenum;
    readonly ONE_MINUS_SRC_COLOR: GLenum;
    readonly OUT_OF_MEMORY: GLenum;
    readonly PACK_ALIGNMENT: GLenum;
    readonly POINTS: GLenum;
    readonly POLYGON_OFFSET_FACTOR: GLenum;
    readonly POLYGON_OFFSET_FILL: GLenum;
    readonly POLYGON_OFFSET_UNITS: GLenum;
    readonly RED_BITS: GLenum;
    readonly RENDERBUFFER: GLenum;
    readonly RENDERBUFFER_ALPHA_SIZE: GLenum;
    readonly RENDERBUFFER_BINDING: GLenum;
    readonly RENDERBUFFER_BLUE_SIZE: GLenum;
    readonly RENDERBUFFER_DEPTH_SIZE: GLenum;
    readonly RENDERBUFFER_GREEN_SIZE: GLenum;
    readonly RENDERBUFFER_HEIGHT: GLenum;
    readonly RENDERBUFFER_INTERNAL_FORMAT: GLenum;
    readonly RENDERBUFFER_RED_SIZE: GLenum;
    readonly RENDERBUFFER_STENCIL_SIZE: GLenum;
    readonly RENDERBUFFER_WIDTH: GLenum;
    readonly RENDERER: GLenum;
    readonly REPEAT: GLenum;
    readonly REPLACE: GLenum;
    readonly RGB: GLenum;
    readonly RGB565: GLenum;
    readonly RGB5_A1: GLenum;
    readonly RGBA: GLenum;
    readonly RGBA4: GLenum;
    readonly SAMPLER_2D: GLenum;
    readonly SAMPLER_CUBE: GLenum;
    readonly SAMPLES: GLenum;
    readonly SAMPLE_ALPHA_TO_COVERAGE: GLenum;
    readonly SAMPLE_BUFFERS: GLenum;
    readonly SAMPLE_COVERAGE: GLenum;
    readonly SAMPLE_COVERAGE_INVERT: GLenum;
    readonly SAMPLE_COVERAGE_VALUE: GLenum;
    readonly SCISSOR_BOX: GLenum;
    readonly SCISSOR_TEST: GLenum;
    readonly SHADER_TYPE: GLenum;
    readonly SHADING_LANGUAGE_VERSION: GLenum;
    readonly SHORT: GLenum;
    readonly SRC_ALPHA: GLenum;
    readonly SRC_ALPHA_SATURATE: GLenum;
    readonly SRC_COLOR: GLenum;
    readonly STATIC_DRAW: GLenum;
    readonly STENCIL_ATTACHMENT: GLenum;
    readonly STENCIL_BACK_FAIL: GLenum;
    readonly STENCIL_BACK_FUNC: GLenum;
    readonly STENCIL_BACK_PASS_DEPTH_FAIL: GLenum;
    readonly STENCIL_BACK_PASS_DEPTH_PASS: GLenum;
    readonly STENCIL_BACK_REF: GLenum;
    readonly STENCIL_BACK_VALUE_MASK: GLenum;
    readonly STENCIL_BACK_WRITEMASK: GLenum;
    readonly STENCIL_BITS: GLenum;
    readonly STENCIL_BUFFER_BIT: GLenum;
    readonly STENCIL_CLEAR_VALUE: GLenum;
    readonly STENCIL_FAIL: GLenum;
    readonly STENCIL_FUNC: GLenum;
    readonly STENCIL_INDEX8: GLenum;
    readonly STENCIL_PASS_DEPTH_FAIL: GLenum;
    readonly STENCIL_PASS_DEPTH_PASS: GLenum;
    readonly STENCIL_REF: GLenum;
    readonly STENCIL_TEST: GLenum;
    readonly STENCIL_VALUE_MASK: GLenum;
    readonly STENCIL_WRITEMASK: GLenum;
    readonly STREAM_DRAW: GLenum;
    readonly SUBPIXEL_BITS: GLenum;
    readonly TEXTURE: GLenum;
    readonly TEXTURE0: GLenum;
    readonly TEXTURE1: GLenum;
    readonly TEXTURE10: GLenum;
    readonly TEXTURE11: GLenum;
    readonly TEXTURE12: GLenum;
    readonly TEXTURE13: GLenum;
    readonly TEXTURE14: GLenum;
    readonly TEXTURE15: GLenum;
    readonly TEXTURE16: GLenum;
    readonly TEXTURE17: GLenum;
    readonly TEXTURE18: GLenum;
    readonly TEXTURE19: GLenum;
    readonly TEXTURE2: GLenum;
    readonly TEXTURE20: GLenum;
    readonly TEXTURE21: GLenum;
    readonly TEXTURE22: GLenum;
    readonly TEXTURE23: GLenum;
    readonly TEXTURE24: GLenum;
    readonly TEXTURE25: GLenum;
    readonly TEXTURE26: GLenum;
    readonly TEXTURE27: GLenum;
    readonly TEXTURE28: GLenum;
    readonly TEXTURE29: GLenum;
    readonly TEXTURE3: GLenum;
    readonly TEXTURE30: GLenum;
    readonly TEXTURE31: GLenum;
    readonly TEXTURE4: GLenum;
    readonly TEXTURE5: GLenum;
    readonly TEXTURE6: GLenum;
    readonly TEXTURE7: GLenum;
    readonly TEXTURE8: GLenum;
    readonly TEXTURE9: GLenum;
    readonly TEXTURE_2D: GLenum;
    readonly TEXTURE_BINDING_2D: GLenum;
    readonly TEXTURE_BINDING_CUBE_MAP: GLenum;
    readonly TEXTURE_CUBE_MAP: GLenum;
    readonly TEXTURE_CUBE_MAP_NEGATIVE_X: GLenum;
    readonly TEXTURE_CUBE_MAP_NEGATIVE_Y: GLenum;
    readonly TEXTURE_CUBE_MAP_NEGATIVE_Z: GLenum;
    readonly TEXTURE_CUBE_MAP_POSITIVE_X: GLenum;
    readonly TEXTURE_CUBE_MAP_POSITIVE_Y: GLenum;
    readonly TEXTURE_CUBE_MAP_POSITIVE_Z: GLenum;
    readonly TEXTURE_MAG_FILTER: GLenum;
    readonly TEXTURE_MIN_FILTER: GLenum;
    readonly TEXTURE_WRAP_S: GLenum;
    readonly TEXTURE_WRAP_T: GLenum;
    readonly TRIANGLES: GLenum;
    readonly TRIANGLE_FAN: GLenum;
    readonly TRIANGLE_STRIP: GLenum;
    readonly UNPACK_ALIGNMENT: GLenum;
    readonly UNPACK_COLORSPACE_CONVERSION_WEBGL: GLenum;
    readonly UNPACK_FLIP_Y_WEBGL: GLenum;
    readonly UNPACK_PREMULTIPLY_ALPHA_WEBGL: GLenum;
    readonly UNSIGNED_BYTE: GLenum;
    readonly UNSIGNED_INT: GLenum;
    readonly UNSIGNED_SHORT: GLenum;
    readonly UNSIGNED_SHORT_4_4_4_4: GLenum;
    readonly UNSIGNED_SHORT_5_5_5_1: GLenum;
    readonly UNSIGNED_SHORT_5_6_5: GLenum;
    readonly VALIDATE_STATUS: GLenum;
    readonly VENDOR: GLenum;
    readonly VERSION: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_ENABLED: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_NORMALIZED: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_POINTER: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_SIZE: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_STRIDE: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_TYPE: GLenum;
    readonly VERTEX_SHADER: GLenum;
    readonly VIEWPORT: GLenum;
    readonly ZERO: GLenum;
    readonly ACTIVE_UNIFORM_BLOCKS: GLenum;
    readonly ALREADY_SIGNALED: GLenum;
    readonly ANY_SAMPLES_PASSED: GLenum;
    readonly ANY_SAMPLES_PASSED_CONSERVATIVE: GLenum;
    readonly COLOR: GLenum;
    readonly COLOR_ATTACHMENT1: GLenum;
    readonly COLOR_ATTACHMENT10: GLenum;
    readonly COLOR_ATTACHMENT11: GLenum;
    readonly COLOR_ATTACHMENT12: GLenum;
    readonly COLOR_ATTACHMENT13: GLenum;
    readonly COLOR_ATTACHMENT14: GLenum;
    readonly COLOR_ATTACHMENT15: GLenum;
    readonly COLOR_ATTACHMENT2: GLenum;
    readonly COLOR_ATTACHMENT3: GLenum;
    readonly COLOR_ATTACHMENT4: GLenum;
    readonly COLOR_ATTACHMENT5: GLenum;
    readonly COLOR_ATTACHMENT6: GLenum;
    readonly COLOR_ATTACHMENT7: GLenum;
    readonly COLOR_ATTACHMENT8: GLenum;
    readonly COLOR_ATTACHMENT9: GLenum;
    readonly COMPARE_REF_TO_TEXTURE: GLenum;
    readonly CONDITION_SATISFIED: GLenum;
    readonly COPY_READ_BUFFER: GLenum;
    readonly COPY_READ_BUFFER_BINDING: GLenum;
    readonly COPY_WRITE_BUFFER: GLenum;
    readonly COPY_WRITE_BUFFER_BINDING: GLenum;
    readonly CURRENT_QUERY: GLenum;
    readonly DEPTH: GLenum;
    readonly DEPTH24_STENCIL8: GLenum;
    readonly DEPTH32F_STENCIL8: GLenum;
    readonly DEPTH_COMPONENT24: GLenum;
    readonly DEPTH_COMPONENT32F: GLenum;
    readonly DRAW_BUFFER0: GLenum;
    readonly DRAW_BUFFER1: GLenum;
    readonly DRAW_BUFFER10: GLenum;
    readonly DRAW_BUFFER11: GLenum;
    readonly DRAW_BUFFER12: GLenum;
    readonly DRAW_BUFFER13: GLenum;
    readonly DRAW_BUFFER14: GLenum;
    readonly DRAW_BUFFER15: GLenum;
    readonly DRAW_BUFFER2: GLenum;
    readonly DRAW_BUFFER3: GLenum;
    readonly DRAW_BUFFER4: GLenum;
    readonly DRAW_BUFFER5: GLenum;
    readonly DRAW_BUFFER6: GLenum;
    readonly DRAW_BUFFER7: GLenum;
    readonly DRAW_BUFFER8: GLenum;
    readonly DRAW_BUFFER9: GLenum;
    readonly DRAW_FRAMEBUFFER: GLenum;
    readonly DRAW_FRAMEBUFFER_BINDING: GLenum;
    readonly DYNAMIC_COPY: GLenum;
    readonly DYNAMIC_READ: GLenum;
    readonly FLOAT_32_UNSIGNED_INT_24_8_REV: GLenum;
    readonly FLOAT_MAT2x3: GLenum;
    readonly FLOAT_MAT2x4: GLenum;
    readonly FLOAT_MAT3x2: GLenum;
    readonly FLOAT_MAT3x4: GLenum;
    readonly FLOAT_MAT4x2: GLenum;
    readonly FLOAT_MAT4x3: GLenum;
    readonly FRAGMENT_SHADER_DERIVATIVE_HINT: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_RED_SIZE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: GLenum;
    readonly FRAMEBUFFER_DEFAULT: GLenum;
    readonly FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: GLenum;
    readonly HALF_FLOAT: GLenum;
    readonly INTERLEAVED_ATTRIBS: GLenum;
    readonly INT_2_10_10_10_REV: GLenum;
    readonly INT_SAMPLER_2D: GLenum;
    readonly INT_SAMPLER_2D_ARRAY: GLenum;
    readonly INT_SAMPLER_3D: GLenum;
    readonly INT_SAMPLER_CUBE: GLenum;
    readonly INVALID_INDEX: GLenum;
    readonly MAX: GLenum;
    readonly MAX_3D_TEXTURE_SIZE: GLenum;
    readonly MAX_ARRAY_TEXTURE_LAYERS: GLenum;
    readonly MAX_CLIENT_WAIT_TIMEOUT_WEBGL: GLenum;
    readonly MAX_COLOR_ATTACHMENTS: GLenum;
    readonly MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: GLenum;
    readonly MAX_COMBINED_UNIFORM_BLOCKS: GLenum;
    readonly MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: GLenum;
    readonly MAX_DRAW_BUFFERS: GLenum;
    readonly MAX_ELEMENTS_INDICES: GLenum;
    readonly MAX_ELEMENTS_VERTICES: GLenum;
    readonly MAX_ELEMENT_INDEX: GLenum;
    readonly MAX_FRAGMENT_INPUT_COMPONENTS: GLenum;
    readonly MAX_FRAGMENT_UNIFORM_BLOCKS: GLenum;
    readonly MAX_FRAGMENT_UNIFORM_COMPONENTS: GLenum;
    readonly MAX_PROGRAM_TEXEL_OFFSET: GLenum;
    readonly MAX_SAMPLES: GLenum;
    readonly MAX_SERVER_WAIT_TIMEOUT: GLenum;
    readonly MAX_TEXTURE_LOD_BIAS: GLenum;
    readonly MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: GLenum;
    readonly MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: GLenum;
    readonly MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: GLenum;
    readonly MAX_UNIFORM_BLOCK_SIZE: GLenum;
    readonly MAX_UNIFORM_BUFFER_BINDINGS: GLenum;
    readonly MAX_VARYING_COMPONENTS: GLenum;
    readonly MAX_VERTEX_OUTPUT_COMPONENTS: GLenum;
    readonly MAX_VERTEX_UNIFORM_BLOCKS: GLenum;
    readonly MAX_VERTEX_UNIFORM_COMPONENTS: GLenum;
    readonly MIN: GLenum;
    readonly MIN_PROGRAM_TEXEL_OFFSET: GLenum;
    readonly OBJECT_TYPE: GLenum;
    readonly PACK_ROW_LENGTH: GLenum;
    readonly PACK_SKIP_PIXELS: GLenum;
    readonly PACK_SKIP_ROWS: GLenum;
    readonly PIXEL_PACK_BUFFER: GLenum;
    readonly PIXEL_PACK_BUFFER_BINDING: GLenum;
    readonly PIXEL_UNPACK_BUFFER: GLenum;
    readonly PIXEL_UNPACK_BUFFER_BINDING: GLenum;
    readonly QUERY_RESULT: GLenum;
    readonly QUERY_RESULT_AVAILABLE: GLenum;
    readonly R11F_G11F_B10F: GLenum;
    readonly R16F: GLenum;
    readonly R16I: GLenum;
    readonly R16UI: GLenum;
    readonly R32F: GLenum;
    readonly R32I: GLenum;
    readonly R32UI: GLenum;
    readonly R8: GLenum;
    readonly R8I: GLenum;
    readonly R8UI: GLenum;
    readonly R8_SNORM: GLenum;
    readonly RASTERIZER_DISCARD: GLenum;
    readonly READ_BUFFER: GLenum;
    readonly READ_FRAMEBUFFER: GLenum;
    readonly READ_FRAMEBUFFER_BINDING: GLenum;
    readonly RED: GLenum;
    readonly RED_INTEGER: GLenum;
    readonly RENDERBUFFER_SAMPLES: GLenum;
    readonly RG: GLenum;
    readonly RG16F: GLenum;
    readonly RG16I: GLenum;
    readonly RG16UI: GLenum;
    readonly RG32F: GLenum;
    readonly RG32I: GLenum;
    readonly RG32UI: GLenum;
    readonly RG8: GLenum;
    readonly RG8I: GLenum;
    readonly RG8UI: GLenum;
    readonly RG8_SNORM: GLenum;
    readonly RGB10_A2: GLenum;
    readonly RGB10_A2UI: GLenum;
    readonly RGB16F: GLenum;
    readonly RGB16I: GLenum;
    readonly RGB16UI: GLenum;
    readonly RGB32F: GLenum;
    readonly RGB32I: GLenum;
    readonly RGB32UI: GLenum;
    readonly RGB8: GLenum;
    readonly RGB8I: GLenum;
    readonly RGB8UI: GLenum;
    readonly RGB8_SNORM: GLenum;
    readonly RGB9_E5: GLenum;
    readonly RGBA16F: GLenum;
    readonly RGBA16I: GLenum;
    readonly RGBA16UI: GLenum;
    readonly RGBA32F: GLenum;
    readonly RGBA32I: GLenum;
    readonly RGBA32UI: GLenum;
    readonly RGBA8: GLenum;
    readonly RGBA8I: GLenum;
    readonly RGBA8UI: GLenum;
    readonly RGBA8_SNORM: GLenum;
    readonly RGBA_INTEGER: GLenum;
    readonly RGB_INTEGER: GLenum;
    readonly RG_INTEGER: GLenum;
    readonly SAMPLER_2D_ARRAY: GLenum;
    readonly SAMPLER_2D_ARRAY_SHADOW: GLenum;
    readonly SAMPLER_2D_SHADOW: GLenum;
    readonly SAMPLER_3D: GLenum;
    readonly SAMPLER_BINDING: GLenum;
    readonly SAMPLER_CUBE_SHADOW: GLenum;
    readonly SEPARATE_ATTRIBS: GLenum;
    readonly SIGNALED: GLenum;
    readonly SIGNED_NORMALIZED: GLenum;
    readonly SRGB: GLenum;
    readonly SRGB8: GLenum;
    readonly SRGB8_ALPHA8: GLenum;
    readonly STATIC_COPY: GLenum;
    readonly STATIC_READ: GLenum;
    readonly STENCIL: GLenum;
    readonly STREAM_COPY: GLenum;
    readonly STREAM_READ: GLenum;
    readonly SYNC_CONDITION: GLenum;
    readonly SYNC_FENCE: GLenum;
    readonly SYNC_FLAGS: GLenum;
    readonly SYNC_FLUSH_COMMANDS_BIT: GLenum;
    readonly SYNC_GPU_COMMANDS_COMPLETE: GLenum;
    readonly SYNC_STATUS: GLenum;
    readonly TEXTURE_2D_ARRAY: GLenum;
    readonly TEXTURE_3D: GLenum;
    readonly TEXTURE_BASE_LEVEL: GLenum;
    readonly TEXTURE_BINDING_2D_ARRAY: GLenum;
    readonly TEXTURE_BINDING_3D: GLenum;
    readonly TEXTURE_COMPARE_FUNC: GLenum;
    readonly TEXTURE_COMPARE_MODE: GLenum;
    readonly TEXTURE_IMMUTABLE_FORMAT: GLenum;
    readonly TEXTURE_IMMUTABLE_LEVELS: GLenum;
    readonly TEXTURE_MAX_LEVEL: GLenum;
    readonly TEXTURE_MAX_LOD: GLenum;
    readonly TEXTURE_MIN_LOD: GLenum;
    readonly TEXTURE_WRAP_R: GLenum;
    readonly TIMEOUT_EXPIRED: GLenum;
    readonly TIMEOUT_IGNORED: GLint64;
    readonly TRANSFORM_FEEDBACK: GLenum;
    readonly TRANSFORM_FEEDBACK_ACTIVE: GLenum;
    readonly TRANSFORM_FEEDBACK_BINDING: GLenum;
    readonly TRANSFORM_FEEDBACK_BUFFER: GLenum;
    readonly TRANSFORM_FEEDBACK_BUFFER_BINDING: GLenum;
    readonly TRANSFORM_FEEDBACK_BUFFER_MODE: GLenum;
    readonly TRANSFORM_FEEDBACK_BUFFER_SIZE: GLenum;
    readonly TRANSFORM_FEEDBACK_BUFFER_START: GLenum;
    readonly TRANSFORM_FEEDBACK_PAUSED: GLenum;
    readonly TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: GLenum;
    readonly TRANSFORM_FEEDBACK_VARYINGS: GLenum;
    readonly UNIFORM_ARRAY_STRIDE: GLenum;
    readonly UNIFORM_BLOCK_ACTIVE_UNIFORMS: GLenum;
    readonly UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: GLenum;
    readonly UNIFORM_BLOCK_BINDING: GLenum;
    readonly UNIFORM_BLOCK_DATA_SIZE: GLenum;
    readonly UNIFORM_BLOCK_INDEX: GLenum;
    readonly UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: GLenum;
    readonly UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: GLenum;
    readonly UNIFORM_BUFFER: GLenum;
    readonly UNIFORM_BUFFER_BINDING: GLenum;
    readonly UNIFORM_BUFFER_OFFSET_ALIGNMENT: GLenum;
    readonly UNIFORM_BUFFER_SIZE: GLenum;
    readonly UNIFORM_BUFFER_START: GLenum;
    readonly UNIFORM_IS_ROW_MAJOR: GLenum;
    readonly UNIFORM_MATRIX_STRIDE: GLenum;
    readonly UNIFORM_OFFSET: GLenum;
    readonly UNIFORM_SIZE: GLenum;
    readonly UNIFORM_TYPE: GLenum;
    readonly UNPACK_IMAGE_HEIGHT: GLenum;
    readonly UNPACK_ROW_LENGTH: GLenum;
    readonly UNPACK_SKIP_IMAGES: GLenum;
    readonly UNPACK_SKIP_PIXELS: GLenum;
    readonly UNPACK_SKIP_ROWS: GLenum;
    readonly UNSIGNALED: GLenum;
    readonly UNSIGNED_INT_10F_11F_11F_REV: GLenum;
    readonly UNSIGNED_INT_24_8: GLenum;
    readonly UNSIGNED_INT_2_10_10_10_REV: GLenum;
    readonly UNSIGNED_INT_5_9_9_9_REV: GLenum;
    readonly UNSIGNED_INT_SAMPLER_2D: GLenum;
    readonly UNSIGNED_INT_SAMPLER_2D_ARRAY: GLenum;
    readonly UNSIGNED_INT_SAMPLER_3D: GLenum;
    readonly UNSIGNED_INT_SAMPLER_CUBE: GLenum;
    readonly UNSIGNED_INT_VEC2: GLenum;
    readonly UNSIGNED_INT_VEC3: GLenum;
    readonly UNSIGNED_INT_VEC4: GLenum;
    readonly UNSIGNED_NORMALIZED: GLenum;
    readonly VERTEX_ARRAY_BINDING: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_DIVISOR: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_INTEGER: GLenum;
    readonly WAIT_FAILED: GLenum;
};

interface WebGL2RenderingContextBase {
    beginQuery(target: GLenum, query: WebGLQuery): void;
    beginTransformFeedback(primitiveMode: GLenum): void;
    bindBufferBase(target: GLenum, index: GLuint, buffer: WebGLBuffer | null): void;
    bindBufferRange(target: GLenum, index: GLuint, buffer: WebGLBuffer | null, offset: GLintptr, size: GLsizeiptr): void;
    bindSampler(unit: GLuint, sampler: WebGLSampler | null): void;
    bindTransformFeedback(target: GLenum, tf: WebGLTransformFeedback | null): void;
    bindVertexArray(array: WebGLVertexArrayObject | null): void;
    blitFramebuffer(srcX0: GLint, srcY0: GLint, srcX1: GLint, srcY1: GLint, dstX0: GLint, dstY0: GLint, dstX1: GLint, dstY1: GLint, mask: GLbitfield, filter: GLenum): void;
    clearBufferfi(buffer: GLenum, drawbuffer: GLint, depth: GLfloat, stencil: GLint): void;
    clearBufferfv(buffer: GLenum, drawbuffer: GLint, values: Float32List, srcOffset?: GLuint): void;
    clearBufferiv(buffer: GLenum, drawbuffer: GLint, values: Int32List, srcOffset?: GLuint): void;
    clearBufferuiv(buffer: GLenum, drawbuffer: GLint, values: Uint32List, srcOffset?: GLuint): void;
    clientWaitSync(sync: WebGLSync, flags: GLbitfield, timeout: GLuint64): GLenum;
    compressedTexImage3D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, imageSize: GLsizei, offset: GLintptr): void;
    compressedTexImage3D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint): void;
    compressedTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, imageSize: GLsizei, offset: GLintptr): void;
    compressedTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint): void;
    copyBufferSubData(readTarget: GLenum, writeTarget: GLenum, readOffset: GLintptr, writeOffset: GLintptr, size: GLsizeiptr): void;
    copyTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, x: GLint, y: GLint, width: GLsizei, height: GLsizei): void;
    createQuery(): WebGLQuery | null;
    createSampler(): WebGLSampler | null;
    createTransformFeedback(): WebGLTransformFeedback | null;
    createVertexArray(): WebGLVertexArrayObject | null;
    deleteQuery(query: WebGLQuery | null): void;
    deleteSampler(sampler: WebGLSampler | null): void;
    deleteSync(sync: WebGLSync | null): void;
    deleteTransformFeedback(tf: WebGLTransformFeedback | null): void;
    deleteVertexArray(vertexArray: WebGLVertexArrayObject | null): void;
    drawArraysInstanced(mode: GLenum, first: GLint, count: GLsizei, instanceCount: GLsizei): void;
    drawBuffers(buffers: GLenum[]): void;
    drawElementsInstanced(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr, instanceCount: GLsizei): void;
    drawRangeElements(mode: GLenum, start: GLuint, end: GLuint, count: GLsizei, type: GLenum, offset: GLintptr): void;
    endQuery(target: GLenum): void;
    endTransformFeedback(): void;
    fenceSync(condition: GLenum, flags: GLbitfield): WebGLSync | null;
    framebufferTextureLayer(target: GLenum, attachment: GLenum, texture: WebGLTexture | null, level: GLint, layer: GLint): void;
    getActiveUniformBlockName(program: WebGLProgram, uniformBlockIndex: GLuint): string | null;
    getActiveUniformBlockParameter(program: WebGLProgram, uniformBlockIndex: GLuint, pname: GLenum): any;
    getActiveUniforms(program: WebGLProgram, uniformIndices: GLuint[], pname: GLenum): any;
    getBufferSubData(target: GLenum, srcByteOffset: GLintptr, dstBuffer: ArrayBufferView, dstOffset?: GLuint, length?: GLuint): void;
    getFragDataLocation(program: WebGLProgram, name: string): GLint;
    getIndexedParameter(target: GLenum, index: GLuint): any;
    getInternalformatParameter(target: GLenum, internalformat: GLenum, pname: GLenum): any;
    getQuery(target: GLenum, pname: GLenum): WebGLQuery | null;
    getQueryParameter(query: WebGLQuery, pname: GLenum): any;
    getSamplerParameter(sampler: WebGLSampler, pname: GLenum): any;
    getSyncParameter(sync: WebGLSync, pname: GLenum): any;
    getTransformFeedbackVarying(program: WebGLProgram, index: GLuint): WebGLActiveInfo | null;
    getUniformBlockIndex(program: WebGLProgram, uniformBlockName: string): GLuint;
    getUniformIndices(program: WebGLProgram, uniformNames: string[]): GLuint[] | null;
    invalidateFramebuffer(target: GLenum, attachments: GLenum[]): void;
    invalidateSubFramebuffer(target: GLenum, attachments: GLenum[], x: GLint, y: GLint, width: GLsizei, height: GLsizei): void;
    isQuery(query: WebGLQuery | null): GLboolean;
    isSampler(sampler: WebGLSampler | null): GLboolean;
    isSync(sync: WebGLSync | null): GLboolean;
    isTransformFeedback(tf: WebGLTransformFeedback | null): GLboolean;
    isVertexArray(vertexArray: WebGLVertexArrayObject | null): GLboolean;
    pauseTransformFeedback(): void;
    readBuffer(src: GLenum): void;
    renderbufferStorageMultisample(target: GLenum, samples: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei): void;
    resumeTransformFeedback(): void;
    samplerParameterf(sampler: WebGLSampler, pname: GLenum, param: GLfloat): void;
    samplerParameteri(sampler: WebGLSampler, pname: GLenum, param: GLint): void;
    texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, pboOffset: GLintptr): void;
    texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, source: TexImageSource): void;
    texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, srcData: ArrayBufferView | null): void;
    texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint): void;
    texStorage2D(target: GLenum, levels: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei): void;
    texStorage3D(target: GLenum, levels: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei): void;
    texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr): void;
    texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, source: TexImageSource): void;
    texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView | null, srcOffset?: GLuint): void;
    transformFeedbackVaryings(program: WebGLProgram, varyings: string[], bufferMode: GLenum): void;
    uniform1ui(location: WebGLUniformLocation | null, v0: GLuint): void;
    uniform1uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniform2ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint): void;
    uniform2uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniform3ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint, v2: GLuint): void;
    uniform3uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniform4ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint, v2: GLuint, v3: GLuint): void;
    uniform4uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniformBlockBinding(program: WebGLProgram, uniformBlockIndex: GLuint, uniformBlockBinding: GLuint): void;
    uniformMatrix2x3fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniformMatrix2x4fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniformMatrix3x2fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniformMatrix3x4fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniformMatrix4x2fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniformMatrix4x3fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    vertexAttribDivisor(index: GLuint, divisor: GLuint): void;
    vertexAttribI4i(index: GLuint, x: GLint, y: GLint, z: GLint, w: GLint): void;
    vertexAttribI4iv(index: GLuint, values: Int32List): void;
    vertexAttribI4ui(index: GLuint, x: GLuint, y: GLuint, z: GLuint, w: GLuint): void;
    vertexAttribI4uiv(index: GLuint, values: Uint32List): void;
    vertexAttribIPointer(index: GLuint, size: GLint, type: GLenum, stride: GLsizei, offset: GLintptr): void;
    waitSync(sync: WebGLSync, flags: GLbitfield, timeout: GLint64): void;
    readonly ACTIVE_UNIFORM_BLOCKS: GLenum;
    readonly ALREADY_SIGNALED: GLenum;
    readonly ANY_SAMPLES_PASSED: GLenum;
    readonly ANY_SAMPLES_PASSED_CONSERVATIVE: GLenum;
    readonly COLOR: GLenum;
    readonly COLOR_ATTACHMENT1: GLenum;
    readonly COLOR_ATTACHMENT10: GLenum;
    readonly COLOR_ATTACHMENT11: GLenum;
    readonly COLOR_ATTACHMENT12: GLenum;
    readonly COLOR_ATTACHMENT13: GLenum;
    readonly COLOR_ATTACHMENT14: GLenum;
    readonly COLOR_ATTACHMENT15: GLenum;
    readonly COLOR_ATTACHMENT2: GLenum;
    readonly COLOR_ATTACHMENT3: GLenum;
    readonly COLOR_ATTACHMENT4: GLenum;
    readonly COLOR_ATTACHMENT5: GLenum;
    readonly COLOR_ATTACHMENT6: GLenum;
    readonly COLOR_ATTACHMENT7: GLenum;
    readonly COLOR_ATTACHMENT8: GLenum;
    readonly COLOR_ATTACHMENT9: GLenum;
    readonly COMPARE_REF_TO_TEXTURE: GLenum;
    readonly CONDITION_SATISFIED: GLenum;
    readonly COPY_READ_BUFFER: GLenum;
    readonly COPY_READ_BUFFER_BINDING: GLenum;
    readonly COPY_WRITE_BUFFER: GLenum;
    readonly COPY_WRITE_BUFFER_BINDING: GLenum;
    readonly CURRENT_QUERY: GLenum;
    readonly DEPTH: GLenum;
    readonly DEPTH24_STENCIL8: GLenum;
    readonly DEPTH32F_STENCIL8: GLenum;
    readonly DEPTH_COMPONENT24: GLenum;
    readonly DEPTH_COMPONENT32F: GLenum;
    readonly DRAW_BUFFER0: GLenum;
    readonly DRAW_BUFFER1: GLenum;
    readonly DRAW_BUFFER10: GLenum;
    readonly DRAW_BUFFER11: GLenum;
    readonly DRAW_BUFFER12: GLenum;
    readonly DRAW_BUFFER13: GLenum;
    readonly DRAW_BUFFER14: GLenum;
    readonly DRAW_BUFFER15: GLenum;
    readonly DRAW_BUFFER2: GLenum;
    readonly DRAW_BUFFER3: GLenum;
    readonly DRAW_BUFFER4: GLenum;
    readonly DRAW_BUFFER5: GLenum;
    readonly DRAW_BUFFER6: GLenum;
    readonly DRAW_BUFFER7: GLenum;
    readonly DRAW_BUFFER8: GLenum;
    readonly DRAW_BUFFER9: GLenum;
    readonly DRAW_FRAMEBUFFER: GLenum;
    readonly DRAW_FRAMEBUFFER_BINDING: GLenum;
    readonly DYNAMIC_COPY: GLenum;
    readonly DYNAMIC_READ: GLenum;
    readonly FLOAT_32_UNSIGNED_INT_24_8_REV: GLenum;
    readonly FLOAT_MAT2x3: GLenum;
    readonly FLOAT_MAT2x4: GLenum;
    readonly FLOAT_MAT3x2: GLenum;
    readonly FLOAT_MAT3x4: GLenum;
    readonly FLOAT_MAT4x2: GLenum;
    readonly FLOAT_MAT4x3: GLenum;
    readonly FRAGMENT_SHADER_DERIVATIVE_HINT: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_RED_SIZE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: GLenum;
    readonly FRAMEBUFFER_DEFAULT: GLenum;
    readonly FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: GLenum;
    readonly HALF_FLOAT: GLenum;
    readonly INTERLEAVED_ATTRIBS: GLenum;
    readonly INT_2_10_10_10_REV: GLenum;
    readonly INT_SAMPLER_2D: GLenum;
    readonly INT_SAMPLER_2D_ARRAY: GLenum;
    readonly INT_SAMPLER_3D: GLenum;
    readonly INT_SAMPLER_CUBE: GLenum;
    readonly INVALID_INDEX: GLenum;
    readonly MAX: GLenum;
    readonly MAX_3D_TEXTURE_SIZE: GLenum;
    readonly MAX_ARRAY_TEXTURE_LAYERS: GLenum;
    readonly MAX_CLIENT_WAIT_TIMEOUT_WEBGL: GLenum;
    readonly MAX_COLOR_ATTACHMENTS: GLenum;
    readonly MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: GLenum;
    readonly MAX_COMBINED_UNIFORM_BLOCKS: GLenum;
    readonly MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: GLenum;
    readonly MAX_DRAW_BUFFERS: GLenum;
    readonly MAX_ELEMENTS_INDICES: GLenum;
    readonly MAX_ELEMENTS_VERTICES: GLenum;
    readonly MAX_ELEMENT_INDEX: GLenum;
    readonly MAX_FRAGMENT_INPUT_COMPONENTS: GLenum;
    readonly MAX_FRAGMENT_UNIFORM_BLOCKS: GLenum;
    readonly MAX_FRAGMENT_UNIFORM_COMPONENTS: GLenum;
    readonly MAX_PROGRAM_TEXEL_OFFSET: GLenum;
    readonly MAX_SAMPLES: GLenum;
    readonly MAX_SERVER_WAIT_TIMEOUT: GLenum;
    readonly MAX_TEXTURE_LOD_BIAS: GLenum;
    readonly MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: GLenum;
    readonly MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: GLenum;
    readonly MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: GLenum;
    readonly MAX_UNIFORM_BLOCK_SIZE: GLenum;
    readonly MAX_UNIFORM_BUFFER_BINDINGS: GLenum;
    readonly MAX_VARYING_COMPONENTS: GLenum;
    readonly MAX_VERTEX_OUTPUT_COMPONENTS: GLenum;
    readonly MAX_VERTEX_UNIFORM_BLOCKS: GLenum;
    readonly MAX_VERTEX_UNIFORM_COMPONENTS: GLenum;
    readonly MIN: GLenum;
    readonly MIN_PROGRAM_TEXEL_OFFSET: GLenum;
    readonly OBJECT_TYPE: GLenum;
    readonly PACK_ROW_LENGTH: GLenum;
    readonly PACK_SKIP_PIXELS: GLenum;
    readonly PACK_SKIP_ROWS: GLenum;
    readonly PIXEL_PACK_BUFFER: GLenum;
    readonly PIXEL_PACK_BUFFER_BINDING: GLenum;
    readonly PIXEL_UNPACK_BUFFER: GLenum;
    readonly PIXEL_UNPACK_BUFFER_BINDING: GLenum;
    readonly QUERY_RESULT: GLenum;
    readonly QUERY_RESULT_AVAILABLE: GLenum;
    readonly R11F_G11F_B10F: GLenum;
    readonly R16F: GLenum;
    readonly R16I: GLenum;
    readonly R16UI: GLenum;
    readonly R32F: GLenum;
    readonly R32I: GLenum;
    readonly R32UI: GLenum;
    readonly R8: GLenum;
    readonly R8I: GLenum;
    readonly R8UI: GLenum;
    readonly R8_SNORM: GLenum;
    readonly RASTERIZER_DISCARD: GLenum;
    readonly READ_BUFFER: GLenum;
    readonly READ_FRAMEBUFFER: GLenum;
    readonly READ_FRAMEBUFFER_BINDING: GLenum;
    readonly RED: GLenum;
    readonly RED_INTEGER: GLenum;
    readonly RENDERBUFFER_SAMPLES: GLenum;
    readonly RG: GLenum;
    readonly RG16F: GLenum;
    readonly RG16I: GLenum;
    readonly RG16UI: GLenum;
    readonly RG32F: GLenum;
    readonly RG32I: GLenum;
    readonly RG32UI: GLenum;
    readonly RG8: GLenum;
    readonly RG8I: GLenum;
    readonly RG8UI: GLenum;
    readonly RG8_SNORM: GLenum;
    readonly RGB10_A2: GLenum;
    readonly RGB10_A2UI: GLenum;
    readonly RGB16F: GLenum;
    readonly RGB16I: GLenum;
    readonly RGB16UI: GLenum;
    readonly RGB32F: GLenum;
    readonly RGB32I: GLenum;
    readonly RGB32UI: GLenum;
    readonly RGB8: GLenum;
    readonly RGB8I: GLenum;
    readonly RGB8UI: GLenum;
    readonly RGB8_SNORM: GLenum;
    readonly RGB9_E5: GLenum;
    readonly RGBA16F: GLenum;
    readonly RGBA16I: GLenum;
    readonly RGBA16UI: GLenum;
    readonly RGBA32F: GLenum;
    readonly RGBA32I: GLenum;
    readonly RGBA32UI: GLenum;
    readonly RGBA8: GLenum;
    readonly RGBA8I: GLenum;
    readonly RGBA8UI: GLenum;
    readonly RGBA8_SNORM: GLenum;
    readonly RGBA_INTEGER: GLenum;
    readonly RGB_INTEGER: GLenum;
    readonly RG_INTEGER: GLenum;
    readonly SAMPLER_2D_ARRAY: GLenum;
    readonly SAMPLER_2D_ARRAY_SHADOW: GLenum;
    readonly SAMPLER_2D_SHADOW: GLenum;
    readonly SAMPLER_3D: GLenum;
    readonly SAMPLER_BINDING: GLenum;
    readonly SAMPLER_CUBE_SHADOW: GLenum;
    readonly SEPARATE_ATTRIBS: GLenum;
    readonly SIGNALED: GLenum;
    readonly SIGNED_NORMALIZED: GLenum;
    readonly SRGB: GLenum;
    readonly SRGB8: GLenum;
    readonly SRGB8_ALPHA8: GLenum;
    readonly STATIC_COPY: GLenum;
    readonly STATIC_READ: GLenum;
    readonly STENCIL: GLenum;
    readonly STREAM_COPY: GLenum;
    readonly STREAM_READ: GLenum;
    readonly SYNC_CONDITION: GLenum;
    readonly SYNC_FENCE: GLenum;
    readonly SYNC_FLAGS: GLenum;
    readonly SYNC_FLUSH_COMMANDS_BIT: GLenum;
    readonly SYNC_GPU_COMMANDS_COMPLETE: GLenum;
    readonly SYNC_STATUS: GLenum;
    readonly TEXTURE_2D_ARRAY: GLenum;
    readonly TEXTURE_3D: GLenum;
    readonly TEXTURE_BASE_LEVEL: GLenum;
    readonly TEXTURE_BINDING_2D_ARRAY: GLenum;
    readonly TEXTURE_BINDING_3D: GLenum;
    readonly TEXTURE_COMPARE_FUNC: GLenum;
    readonly TEXTURE_COMPARE_MODE: GLenum;
    readonly TEXTURE_IMMUTABLE_FORMAT: GLenum;
    readonly TEXTURE_IMMUTABLE_LEVELS: GLenum;
    readonly TEXTURE_MAX_LEVEL: GLenum;
    readonly TEXTURE_MAX_LOD: GLenum;
    readonly TEXTURE_MIN_LOD: GLenum;
    readonly TEXTURE_WRAP_R: GLenum;
    readonly TIMEOUT_EXPIRED: GLenum;
    readonly TIMEOUT_IGNORED: GLint64;
    readonly TRANSFORM_FEEDBACK: GLenum;
    readonly TRANSFORM_FEEDBACK_ACTIVE: GLenum;
    readonly TRANSFORM_FEEDBACK_BINDING: GLenum;
    readonly TRANSFORM_FEEDBACK_BUFFER: GLenum;
    readonly TRANSFORM_FEEDBACK_BUFFER_BINDING: GLenum;
    readonly TRANSFORM_FEEDBACK_BUFFER_MODE: GLenum;
    readonly TRANSFORM_FEEDBACK_BUFFER_SIZE: GLenum;
    readonly TRANSFORM_FEEDBACK_BUFFER_START: GLenum;
    readonly TRANSFORM_FEEDBACK_PAUSED: GLenum;
    readonly TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: GLenum;
    readonly TRANSFORM_FEEDBACK_VARYINGS: GLenum;
    readonly UNIFORM_ARRAY_STRIDE: GLenum;
    readonly UNIFORM_BLOCK_ACTIVE_UNIFORMS: GLenum;
    readonly UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: GLenum;
    readonly UNIFORM_BLOCK_BINDING: GLenum;
    readonly UNIFORM_BLOCK_DATA_SIZE: GLenum;
    readonly UNIFORM_BLOCK_INDEX: GLenum;
    readonly UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: GLenum;
    readonly UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: GLenum;
    readonly UNIFORM_BUFFER: GLenum;
    readonly UNIFORM_BUFFER_BINDING: GLenum;
    readonly UNIFORM_BUFFER_OFFSET_ALIGNMENT: GLenum;
    readonly UNIFORM_BUFFER_SIZE: GLenum;
    readonly UNIFORM_BUFFER_START: GLenum;
    readonly UNIFORM_IS_ROW_MAJOR: GLenum;
    readonly UNIFORM_MATRIX_STRIDE: GLenum;
    readonly UNIFORM_OFFSET: GLenum;
    readonly UNIFORM_SIZE: GLenum;
    readonly UNIFORM_TYPE: GLenum;
    readonly UNPACK_IMAGE_HEIGHT: GLenum;
    readonly UNPACK_ROW_LENGTH: GLenum;
    readonly UNPACK_SKIP_IMAGES: GLenum;
    readonly UNPACK_SKIP_PIXELS: GLenum;
    readonly UNPACK_SKIP_ROWS: GLenum;
    readonly UNSIGNALED: GLenum;
    readonly UNSIGNED_INT_10F_11F_11F_REV: GLenum;
    readonly UNSIGNED_INT_24_8: GLenum;
    readonly UNSIGNED_INT_2_10_10_10_REV: GLenum;
    readonly UNSIGNED_INT_5_9_9_9_REV: GLenum;
    readonly UNSIGNED_INT_SAMPLER_2D: GLenum;
    readonly UNSIGNED_INT_SAMPLER_2D_ARRAY: GLenum;
    readonly UNSIGNED_INT_SAMPLER_3D: GLenum;
    readonly UNSIGNED_INT_SAMPLER_CUBE: GLenum;
    readonly UNSIGNED_INT_VEC2: GLenum;
    readonly UNSIGNED_INT_VEC3: GLenum;
    readonly UNSIGNED_INT_VEC4: GLenum;
    readonly UNSIGNED_NORMALIZED: GLenum;
    readonly VERTEX_ARRAY_BINDING: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_DIVISOR: GLenum;
    readonly VERTEX_ATTRIB_ARRAY_INTEGER: GLenum;
    readonly WAIT_FAILED: GLenum;
}

interface WebGL2RenderingContextOverloads {
    bufferData(target: GLenum, size: GLsizeiptr, usage: GLenum): void;
    bufferData(target: GLenum, srcData: BufferSource | null, usage: GLenum): void;
    bufferData(target: GLenum, srcData: ArrayBufferView, usage: GLenum, srcOffset: GLuint, length?: GLuint): void;
    bufferSubData(target: GLenum, dstByteOffset: GLintptr, srcData: BufferSource): void;
    bufferSubData(target: GLenum, dstByteOffset: GLintptr, srcData: ArrayBufferView, srcOffset: GLuint, length?: GLuint): void;
    compressedTexImage2D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, border: GLint, imageSize: GLsizei, offset: GLintptr): void;
    compressedTexImage2D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, border: GLint, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint): void;
    compressedTexSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, imageSize: GLsizei, offset: GLintptr): void;
    compressedTexSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint): void;
    readPixels(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView | null): void;
    readPixels(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, offset: GLintptr): void;
    readPixels(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView, dstOffset: GLuint): void;
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint, format: GLenum, type: GLenum, pixels: ArrayBufferView | null): void;
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, format: GLenum, type: GLenum, source: TexImageSource): void;
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint, format: GLenum, type: GLenum, pboOffset: GLintptr): void;
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint, format: GLenum, type: GLenum, source: TexImageSource): void;
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint): void;
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pixels: ArrayBufferView | null): void;
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, format: GLenum, type: GLenum, source: TexImageSource): void;
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr): void;
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, source: TexImageSource): void;
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint): void;
    uniform1fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniform1iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniform2fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniform2iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniform3fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniform3iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniform4fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniform4iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniformMatrix2fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniformMatrix3fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
    uniformMatrix4fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
}



interface ElementCSSInlineStyle {
  readonly style: CSSStyleDeclaration;
}

/** An object that is a CSS declaration block, and exposes style information and various style-related methods and properties. */
interface CSSStyleDeclaration {
  alignContent: string;
  alignItems: string;
  alignSelf: string;
  alignmentBaseline: string;
  all: string;
  animation: string;
  animationDelay: string;
  animationDirection: string;
  animationDuration: string;
  animationFillMode: string;
  animationIterationCount: string;
  animationName: string;
  animationPlayState: string;
  animationTimingFunction: string;
  backfaceVisibility: string;
  background: string;
  backgroundAttachment: string;
  backgroundClip: string;
  backgroundColor: string;
  backgroundImage: string;
  backgroundOrigin: string;
  backgroundPosition: string;
  backgroundPositionX: string;
  backgroundPositionY: string;
  backgroundRepeat: string;
  backgroundSize: string;
  baselineShift: string;
  blockSize: string;
  border: string;
  borderBlockEnd: string;
  borderBlockEndColor: string;
  borderBlockEndStyle: string;
  borderBlockEndWidth: string;
  borderBlockStart: string;
  borderBlockStartColor: string;
  borderBlockStartStyle: string;
  borderBlockStartWidth: string;
  borderBottom: string;
  borderBottomColor: string;
  borderBottomLeftRadius: string;
  borderBottomRightRadius: string;
  borderBottomStyle: string;
  borderBottomWidth: string;
  borderCollapse: string;
  borderColor: string;
  borderImage: string;
  borderImageOutset: string;
  borderImageRepeat: string;
  borderImageSlice: string;
  borderImageSource: string;
  borderImageWidth: string;
  borderInlineEnd: string;
  borderInlineEndColor: string;
  borderInlineEndStyle: string;
  borderInlineEndWidth: string;
  borderInlineStart: string;
  borderInlineStartColor: string;
  borderInlineStartStyle: string;
  borderInlineStartWidth: string;
  borderLeft: string;
  borderLeftColor: string;
  borderLeftStyle: string;
  borderLeftWidth: string;
  borderRadius: string;
  borderRight: string;
  borderRightColor: string;
  borderRightStyle: string;
  borderRightWidth: string;
  borderSpacing: string;
  borderStyle: string;
  borderTop: string;
  borderTopColor: string;
  borderTopLeftRadius: string;
  borderTopRightRadius: string;
  borderTopStyle: string;
  borderTopWidth: string;
  borderWidth: string;
  bottom: string;
  boxShadow: string;
  boxSizing: string;
  breakAfter: string;
  breakBefore: string;
  breakInside: string;
  captionSide: string;
  caretColor: string;
  clear: string;
  clip: string;
  clipPath: string;
  clipRule: string;
  color: string;
  colorInterpolation: string;
  colorInterpolationFilters: string;
  columnCount: string;
  columnFill: string;
  columnGap: string;
  columnRule: string;
  columnRuleColor: string;
  columnRuleStyle: string;
  columnRuleWidth: string;
  columnSpan: string;
  columnWidth: string;
  columns: string;
  content: string;
  counterIncrement: string;
  counterReset: string;
  cssFloat: string;
  cssText: string;
  cursor: string;
  direction: string;
  display: string;
  dominantBaseline: string;
  emptyCells: string;
  fill: string;
  fillOpacity: string;
  fillRule: string;
  filter: string;
  flex: string;
  flexBasis: string;
  flexDirection: string;
  flexFlow: string;
  flexGrow: string;
  flexShrink: string;
  flexWrap: string;
  float: string;
  floodColor: string;
  floodOpacity: string;
  font: string;
  fontFamily: string;
  fontFeatureSettings: string;
  fontKerning: string;
  fontSize: string;
  fontSizeAdjust: string;
  fontStretch: string;
  fontStyle: string;
  fontSynthesis: string;
  fontVariant: string;
  fontVariantCaps: string;
  fontVariantEastAsian: string;
  fontVariantLigatures: string;
  fontVariantNumeric: string;
  fontVariantPosition: string;
  fontWeight: string;
  gap: string;
  glyphOrientationVertical: string;
  grid: string;
  gridArea: string;
  gridAutoColumns: string;
  gridAutoFlow: string;
  gridAutoRows: string;
  gridColumn: string;
  gridColumnEnd: string;
  gridColumnGap: string;
  gridColumnStart: string;
  gridGap: string;
  gridRow: string;
  gridRowEnd: string;
  gridRowGap: string;
  gridRowStart: string;
  gridTemplate: string;
  gridTemplateAreas: string;
  gridTemplateColumns: string;
  gridTemplateRows: string;
  height: string;
  hyphens: string;
  imageOrientation: string;
  imageRendering: string;
  inlineSize: string;
  justifyContent: string;
  justifyItems: string;
  justifySelf: string;
  left: string;
  readonly length: number;
  letterSpacing: string;
  lightingColor: string;
  lineBreak: string;
  lineHeight: string;
  listStyle: string;
  listStyleImage: string;
  listStylePosition: string;
  listStyleType: string;
  margin: string;
  marginBlockEnd: string;
  marginBlockStart: string;
  marginBottom: string;
  marginInlineEnd: string;
  marginInlineStart: string;
  marginLeft: string;
  marginRight: string;
  marginTop: string;
  marker: string;
  markerEnd: string;
  markerMid: string;
  markerStart: string;
  mask: string;
  maskComposite: string;
  maskImage: string;
  maskPosition: string;
  maskRepeat: string;
  maskSize: string;
  maskType: string;
  maxBlockSize: string;
  maxHeight: string;
  maxInlineSize: string;
  maxWidth: string;
  minBlockSize: string;
  minHeight: string;
  minInlineSize: string;
  minWidth: string;
  objectFit: string;
  objectPosition: string;
  opacity: string;
  order: string;
  orphans: string;
  outline: string;
  outlineColor: string;
  outlineOffset: string;
  outlineStyle: string;
  outlineWidth: string;
  overflow: string;
  overflowAnchor: string;
  overflowWrap: string;
  overflowX: string;
  overflowY: string;
  padding: string;
  paddingBlockEnd: string;
  paddingBlockStart: string;
  paddingBottom: string;
  paddingInlineEnd: string;
  paddingInlineStart: string;
  paddingLeft: string;
  paddingRight: string;
  paddingTop: string;
  pageBreakAfter: string;
  pageBreakBefore: string;
  pageBreakInside: string;
  paintOrder: string;
  // readonly parentRule: CSSRule | null;
  perspective: string;
  perspectiveOrigin: string;
  placeContent: string;
  placeItems: string;
  placeSelf: string;
  pointerEvents: string;
  position: string;
  quotes: string;
  resize: string;
  right: string;
  rotate: string;
  rowGap: string;
  rubyAlign: string;
  rubyPosition: string;
  scale: string;
  scrollBehavior: string;
  shapeRendering: string;
  stopColor: string;
  stopOpacity: string;
  stroke: string;
  strokeDasharray: string;
  strokeDashoffset: string;
  strokeLinecap: string;
  strokeLinejoin: string;
  strokeMiterlimit: string;
  strokeOpacity: string;
  strokeWidth: string;
  tabSize: string;
  tableLayout: string;
  textAlign: string;
  textAlignLast: string;
  textAnchor: string;
  textCombineUpright: string;
  textDecoration: string;
  textDecorationColor: string;
  textDecorationLine: string;
  textDecorationStyle: string;
  textEmphasis: string;
  textEmphasisColor: string;
  textEmphasisPosition: string;
  textEmphasisStyle: string;
  textIndent: string;
  textJustify: string;
  textOrientation: string;
  textOverflow: string;
  textRendering: string;
  textShadow: string;
  textTransform: string;
  textUnderlinePosition: string;
  top: string;
  touchAction: string;
  transform: string;
  transformBox: string;
  transformOrigin: string;
  transformStyle: string;
  transition: string;
  transitionDelay: string;
  transitionDuration: string;
  transitionProperty: string;
  transitionTimingFunction: string;
  translate: string;
  unicodeBidi: string;
  userSelect: string;
  verticalAlign: string;
  visibility: string;
  /** @deprecated */
  webkitAlignContent: string;
  /** @deprecated */
  webkitAlignItems: string;
  /** @deprecated */
  webkitAlignSelf: string;
  /** @deprecated */
  webkitAnimation: string;
  /** @deprecated */
  webkitAnimationDelay: string;
  /** @deprecated */
  webkitAnimationDirection: string;
  /** @deprecated */
  webkitAnimationDuration: string;
  /** @deprecated */
  webkitAnimationFillMode: string;
  /** @deprecated */
  webkitAnimationIterationCount: string;
  /** @deprecated */
  webkitAnimationName: string;
  /** @deprecated */
  webkitAnimationPlayState: string;
  /** @deprecated */
  webkitAnimationTimingFunction: string;
  /** @deprecated */
  webkitAppearance: string;
  /** @deprecated */
  webkitBackfaceVisibility: string;
  /** @deprecated */
  webkitBackgroundClip: string;
  /** @deprecated */
  webkitBackgroundOrigin: string;
  /** @deprecated */
  webkitBackgroundSize: string;
  /** @deprecated */
  webkitBorderBottomLeftRadius: string;
  /** @deprecated */
  webkitBorderBottomRightRadius: string;
  /** @deprecated */
  webkitBorderRadius: string;
  /** @deprecated */
  webkitBorderTopLeftRadius: string;
  /** @deprecated */
  webkitBorderTopRightRadius: string;
  /** @deprecated */
  webkitBoxAlign: string;
  /** @deprecated */
  webkitBoxFlex: string;
  /** @deprecated */
  webkitBoxOrdinalGroup: string;
  /** @deprecated */
  webkitBoxOrient: string;
  /** @deprecated */
  webkitBoxPack: string;
  /** @deprecated */
  webkitBoxShadow: string;
  /** @deprecated */
  webkitBoxSizing: string;
  /** @deprecated */
  webkitFilter: string;
  /** @deprecated */
  webkitFlex: string;
  /** @deprecated */
  webkitFlexBasis: string;
  /** @deprecated */
  webkitFlexDirection: string;
  /** @deprecated */
  webkitFlexFlow: string;
  /** @deprecated */
  webkitFlexGrow: string;
  /** @deprecated */
  webkitFlexShrink: string;
  /** @deprecated */
  webkitFlexWrap: string;
  /** @deprecated */
  webkitJustifyContent: string;
  webkitLineClamp: string;
  /** @deprecated */
  webkitMask: string;
  /** @deprecated */
  webkitMaskBoxImage: string;
  /** @deprecated */
  webkitMaskBoxImageOutset: string;
  /** @deprecated */
  webkitMaskBoxImageRepeat: string;
  /** @deprecated */
  webkitMaskBoxImageSlice: string;
  /** @deprecated */
  webkitMaskBoxImageSource: string;
  /** @deprecated */
  webkitMaskBoxImageWidth: string;
  /** @deprecated */
  webkitMaskClip: string;
  /** @deprecated */
  webkitMaskComposite: string;
  /** @deprecated */
  webkitMaskImage: string;
  /** @deprecated */
  webkitMaskOrigin: string;
  /** @deprecated */
  webkitMaskPosition: string;
  /** @deprecated */
  webkitMaskRepeat: string;
  /** @deprecated */
  webkitMaskSize: string;
  /** @deprecated */
  webkitOrder: string;
  /** @deprecated */
  webkitPerspective: string;
  /** @deprecated */
  webkitPerspectiveOrigin: string;
  webkitTapHighlightColor: string;
  /** @deprecated */
  webkitTextFillColor: string;
  /** @deprecated */
  webkitTextSizeAdjust: string;
  /** @deprecated */
  webkitTextStroke: string;
  /** @deprecated */
  webkitTextStrokeColor: string;
  /** @deprecated */
  webkitTextStrokeWidth: string;
  /** @deprecated */
  webkitTransform: string;
  /** @deprecated */
  webkitTransformOrigin: string;
  /** @deprecated */
  webkitTransformStyle: string;
  /** @deprecated */
  webkitTransition: string;
  /** @deprecated */
  webkitTransitionDelay: string;
  /** @deprecated */
  webkitTransitionDuration: string;
  /** @deprecated */
  webkitTransitionProperty: string;
  /** @deprecated */
  webkitTransitionTimingFunction: string;
  /** @deprecated */
  webkitUserSelect: string;
  whiteSpace: string;
  widows: string;
  width: string;
  willChange: string;
  wordBreak: string;
  wordSpacing: string;
  wordWrap: string;
  writingMode: string;
  zIndex: string;
  /** @deprecated */
  zoom: string;
  getPropertyPriority(property: string): string;
  getPropertyValue(property: string): string;
  item(index: number): string;
  removeProperty(property: string): string;
  setProperty(property: string, value: string | null, priority?: string): void;
  [index: number]: string;
}

declare var CSSStyleDeclaration: {
  prototype: CSSStyleDeclaration;
  new(): CSSStyleDeclaration;
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

interface ImageBitmap {
  /**
   * Returns the intrinsic height of the image, in CSS pixels.
   */
  readonly height: number;
  /**
   * Returns the intrinsic width of the image, in CSS pixels.
   */
  readonly width: number;
  /**
   * Releases imageBitmap's underlying bitmap data.
   */
  close(): void;
}

declare var ImageBitmap: {
  prototype: ImageBitmap;
  new(): ImageBitmap;
};

interface CanvasUserInterface {
  drawFocusIfNeeded(element: Element): void;
  // drawFocusIfNeeded(path: Path2D, element: Element): void;
  scrollPathIntoView(): void;
  // scrollPathIntoView(path: Path2D): void;
}

interface CanvasDrawImage {
  drawImage(image: CanvasImageSource, dx: number, dy: number): void;
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
  drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
}

interface CanvasImageData {
  createImageData(sw: number, sh: number): ImageData;
  createImageData(imagedata: ImageData): ImageData;
  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
  putImageData(imagedata: ImageData, dx: number, dy: number): void;
  putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
}

/** The CanvasRenderingContext2D interface, part of the Canvas API, provides the 2D rendering context for the drawing surface of a <canvas> element. It is used for drawing shapes, text, images, and other objects. */
interface CanvasRenderingContext2D extends
  // CanvasCompositing,
  CanvasDrawImage,
  // CanvasDrawPath,
  // CanvasFillStrokeStyles,
  // CanvasFilters,
  CanvasImageData,
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

interface CanvasRenderingContext2DSettings {
  alpha?: boolean;
  desynchronized?: boolean;
}

interface ImageBitmapRenderingContextSettings {
  alpha?: boolean;
}

interface OffscreenCanvasRenderingContext2D extends
  // CanvasCompositing,
  CanvasDrawImage,
  // CanvasDrawPath,
  // CanvasFillStrokeStyles,
  // CanvasFilters,
  CanvasImageData
  // CanvasImageSmoothing,
  // CanvasPath,
  // CanvasPathDrawingStyles,
  // CanvasRect,
  // CanvasShadowStyles,
  // CanvasState,
  // CanvasText,
  // CanvasTextDrawingStyles,
  // CanvasTransform
  {
  readonly canvas: OffscreenCanvas;
  commit(): void;
}

declare var OffscreenCanvasRenderingContext2D: {
  prototype: OffscreenCanvasRenderingContext2D;
  new(): OffscreenCanvasRenderingContext2D;
};


interface OffscreenCanvas extends EventTarget {
  /**
   * These attributes return the dimensions of the OffscreenCanvas object's bitmap.
   *
   * They can be set, to replace the bitmap with a new, transparent black bitmap of the specified dimensions (effectively resizing it).
   */
  height: number;
  /**
   * These attributes return the dimensions of the OffscreenCanvas object's bitmap.
   *
   * They can be set, to replace the bitmap with a new, transparent black bitmap of the specified dimensions (effectively resizing it).
   */
  width: number;
  /**
   * Returns a promise that will fulfill with a new Blob object representing a file containing the image in the OffscreenCanvas object.
   *
   * The argument, if provided, is a dictionary that controls the encoding options of the image file to be created. The type field specifies the file format and has a default value of "image/png"; that type is also used if the requested type isn't supported. If the image format supports variable quality (such as "image/jpeg"), then the quality field is a number in the range 0.0 to 1.0 inclusive indicating the desired quality level for the resulting image.
   */
  convertToBlob(options?: ImageEncodeOptions): Promise<Blob>;
  /**
   * Returns an object that exposes an API for drawing on the OffscreenCanvas object. contextId specifies the desired API: "2d", "bitmaprenderer", "webgl", or "webgl2". options is handled by that API.
   *
   * This specification defines the "2d" context below, which is similar but distinct from the "2d" context that is created from a canvas element. The WebGL specifications define the "webgl" and "webgl2" contexts. [WEBGL]
   *
   * Returns null if the canvas has already been initialized with another context type (e.g., trying to get a "2d" context after getting a "webgl" context).
   */
  getContext(contextId: "2d", options?: CanvasRenderingContext2DSettings): OffscreenCanvasRenderingContext2D | null;
  getContext(contextId: "bitmaprenderer", options?: ImageBitmapRenderingContextSettings): ImageBitmapRenderingContext | null;
  getContext(contextId: "webgl", options?: WebGLContextAttributes): WebGLRenderingContext | null;
  getContext(contextId: "webgl2", options?: WebGLContextAttributes): WebGL2RenderingContext | null;
  getContext(contextId: OffscreenRenderingContextId, options?: any): OffscreenRenderingContext | null;
  /**
   * Returns a newly created ImageBitmap object with the image in the OffscreenCanvas object. The image in the OffscreenCanvas object is replaced with a new blank image.
   */
  transferToImageBitmap(): ImageBitmap;
}

declare var OffscreenCanvas: {
  prototype: OffscreenCanvas;
  new(width: number, height: number): OffscreenCanvas;
};


/** Any HTML element. Some elements directly implement this interface, while others implement it via an interface that inherits it. */
interface HTMLElement extends
  Element,
  DocumentAndElementEventHandlers,
  ElementCSSInlineStyle,
  // ElementContentEditable,
  GlobalEventHandlers
  // HTMLOrSVGElement ,
  {
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

// interface HTMLOrSVGElement {
//   autofocus: boolean;
//   readonly dataset: DOMStringMap;
//   nonce?: string;
//   tabIndex: number;
//   blur(): void;
//   focus(options?: FocusOptions): void;
// }

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
