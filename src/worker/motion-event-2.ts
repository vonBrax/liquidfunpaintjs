// import { MainActivity } from '../worker/main-activity';
// import { throttle } from '../util/functionsHelper';
// https://developers.google.com/web/fundamentals/design-and-ux/input/touch/?hl=fi
// view-source:https://googlesamples.github.io/web-fundamentals/fundamentals/design-and-ux/input/touch/touch-demo-1.html

interface EventHistory {
  byIndex: Map<number, PointerEvent[]>;
  allIds: number[];
}

interface EventCache {
  index: number;
  cache: PointerEvent[];
}

interface PointersCache {
  byId: { [key: string]: EventCache };
  allIds: number[];
}

// interface HasTouchHandler {
//   onTouch: (e: MotionEvent) => void;
// }

export interface OnTouchListener {
  onTouch(event: MotionEvent): boolean;
}

export class MotionEvent {
  public static ACTION_POINTER_DOWN = 'pointerdown';
  public static ACTION_MOVE = 'pointermove';
  public static ACTION_POINTER_UP = 'pointerup';
  public static ACTION_CANCEL = 'pointercancel';

  public static ACTION_DOWN = MotionEvent.ACTION_POINTER_DOWN;
  public static ACTION_UP = MotionEvent.ACTION_POINTER_UP;

  history: EventHistory = {
    byIndex: new Map(),
    allIds: [],
  };

  // private history2: PointerEvent[] = [];
  // private pointers: number[] = [];
  private lastEvent: PointerEvent;
  private pointers: PointersCache = {
    byId: {},
    allIds: [],
  };
  // const pointers = [
  //   { id: 'pointerId', lastEvent: '', cache: [] }
  // ]
  // private lastEvents: PointerEvent[] = [];

  private pointerDown: boolean;
  private touchListeners: Set<OnTouchListener> = new Set();
  public container: HTMLCanvasElement;
  private containerBoundingRect: DOMRect;
  private clearPointersCache: number[] = [];

  // Function throttle/debounce related properties
  private readonly WAIT = 50;
  private readonly MAX_WAIT = 50;
  private leading = false;
  private trailing = true;
  private maxing = true;
  private useRAF = false;
  private debounced = false;
  private lastCallTime: number;
  private lastInvokeTime: number;
  private timerId: number;
  private result: any;

  constructor(container: HTMLCanvasElement) {
    this.container = container;
    this.containerBoundingRect = container.getBoundingClientRect();
    this.bindListeners();
  }

  bindListeners(): void {
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerCancel = this.onPointerCancel.bind(this);
    // this.dispatchCachedEvents = this.dispatchCachedEvents.bind(this);
    this.timerExpired = this.timerExpired.bind(this);
  }

  addListeners(): void {
    this.container.addEventListener('pointerdown', this.onPointerDown);
    this.container.addEventListener('pointermove', this.onPointerMove);
    this.container.addEventListener('pointerup', this.onPointerUp);
    this.container.addEventListener('pointercancel', this.onPointerCancel);
  }

  removeListeners(): void {
    this.container.removeEventListener('pointerdown', this.onPointerDown);
    this.container.removeEventListener('pointermove', this.onPointerMove);
    this.container.removeEventListener('pointerup', this.onPointerUp);
    this.container.removeEventListener('pointercancel', this.onPointerCancel);
  }

  getActionMasked(): string {
    return this.lastEvent.type;
  }

  getActionIndex(): number {
    return this.pointers.allIds.findIndex(
      (id) => this.lastEvent.pointerId === id,
    );
    // return this.history.allIds.findIndex(
    //   id => id === this.activeEvent.pointerId,
    // );
  }

  getPointerId(pointerIndex: number): number {
    return this.pointers.allIds[pointerIndex];
  }

  setOnTouchListener(listener: OnTouchListener): void {
    this.addListeners();
    this.touchListeners.add(listener);
    // window.requestAnimationFrame(this.dispatchCachedEvents);
  }

  deleteOnTouchListener(listener: OnTouchListener): void {
    this.removeListeners();
    this.touchListeners.delete(listener);
  }

  getX(pointerIndex: number): number {
    const id = this.pointers.allIds[pointerIndex];
    if (id === this.lastEvent.pointerId) {
      return this.getPointerCoordX(this.lastEvent);
    }
    const length = this.pointers.byId[id].cache.length;
    const event = this.pointers.byId[id].cache[length - 1];
    return this.getPointerCoordX(event);
  }

  getY(pointerIndex: number): number {
    const id = this.pointers.allIds[pointerIndex];
    if (id === this.lastEvent.pointerId) {
      return this.getPointerCoordY(this.lastEvent);
    }
    const length = this.pointers.byId[id].cache.length;
    const event = this.pointers.byId[id].cache[length - 1];
    return this.getPointerCoordY(event);
  }

  getPointerCount(): number {
    return this.pointers.allIds.length;
  }

  getHistorySize(): number {
    const events = this.pointers.byId[this.lastEvent.pointerId];
    return events ? events.cache.length : 0;
  }

  getHistoricalX(pointerIndex: number, eventIndex: number): number {
    const id = this.pointers.allIds[pointerIndex];
    return this.getPointerCoordX(this.pointers.byId[id].cache[eventIndex]);
  }

  getHistoricalY(pointerIndex: number, eventIndex: number): number {
    const id = this.pointers.allIds[pointerIndex];
    return this.getPointerCoordY(this.pointers.byId[id].cache[eventIndex]);
  }

  onPointerDown(event: PointerEvent): void {
    console.log('Pointer down: ' + event.pointerId);
    this.pointerDown = true;
    event.preventDefault();
    this.setCurrentEvent(event);
    this.dispatch();
  }

  onPointerMove(event: PointerEvent): void {
    console.log('Pointer move: ' + event.pointerId + ' - ' + this.pointerDown);
    if (!this.pointerDown) {
      return;
    }
    event.preventDefault();
    this.setCurrentEvent(event);
    // this.dispatch();
    const time = Date.now();
    const isInvoking = this.shouldInvoke(time);
    this.lastCallTime = time;

    if (isInvoking) {
      if (this.timerId === undefined) {
        return this.leadingEdge(this.lastCallTime);
      }

      if (this.maxing) {
        // Handle invocations in a tight loop
        this.timerId = this.startTimer(this.WAIT);
        return this.invokeFunc(this.lastCallTime);
      }
    }

    if (this.timerId === undefined) {
      this.timerId = this.startTimer(this.WAIT);
    }
  }

  private shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - this.lastCallTime;
    const timeSinceLastInvoke = time - this.lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      this.lastCallTime === undefined ||
      timeSinceLastCall >= this.WAIT ||
      timeSinceLastCall < 0 ||
      timeSinceLastInvoke >= this.MAX_WAIT
    );
  }

  private leadingEdge(time: number): void {
    // Reset any "maxWait" timer
    this.lastInvokeTime = time;

    // Start the timer for the trailing edge
    this.timerId = this.startTimer(this.WAIT);

    // Invoke the leading edge
    if (this.leading) {
      this.dispatch();
    }
  }

  private startTimer(wait: number): number {
    if (this.useRAF) {
      cancelAnimationFrame(this.timerId);
      return requestAnimationFrame(this.timerExpired);
    }

    return setTimeout(this.timerExpired, wait);
  }

  private timerExpired(): void {
    const time = Date.now();
    if (this.shouldInvoke(time)) {
      return this.trailingEdge(time);
    }

    // Restart the timer
    this.timerId = this.startTimer(this.remainingWait(time));
  }

  private trailingEdge(time: number): any {
    this.timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (this.trailing && this.debounced) {
      return this.invokeFunc(time);
    }
    this.debounced = false;
    return this.result;
  }

  private invokeFunc(time: number): any {
    this.debounced = false;
    this.lastInvokeTime = time;
    // return this.dispatch();
    this.dispatch();
    return this.clearCache(this.lastEvent.pointerId);
  }

  private remainingWait(time: number): number {
    const timeSinceLastCall = time - this.lastCallTime;
    const timeSinceLastInvoke = time - this.lastInvokeTime;
    const timeWaiting = this.WAIT - timeSinceLastCall;

    return this.maxing
      ? Math.min(timeWaiting, this.MAX_WAIT - timeSinceLastInvoke)
      : timeWaiting;
  }

  private pending(): boolean {
    return this.timerId !== undefined;
  }

  private cancel(): void {
    if (this.timerId !== undefined) {
      this.cancelTimer(this.timerId);
    }

    this.lastInvokeTime = 0;
    this.debounced = false;
    this.lastCallTime = this.timerId = undefined;
  }

  private cancelTimer(id: number): void {
    if (this.useRAF) {
      return cancelAnimationFrame(id);
    }

    clearTimeout(id);
  }

  onPointerUp(event: PointerEvent): void {
    console.log('Pointer up: ' + event.pointerId);
    this.pointerDown = false;
    if (this.pending()) {
      this.cancel();
      this.dispatch();
    }

    this.setCurrentEvent(event);
    this.dispatch();
    // this.clearPointersCache.push(event.pointerId);
    // this.dispatchCachedEvents();
    this.clearCache(event.pointerId);

    // this.dispatch();
    // this.clearCache(event.pointerId);
  }

  dispatchCachedEvents(): void {
    if (this.pointers.allIds.length) {
      this.dispatch();
    }

    if (this.clearPointersCache.length) {
      this.clearPointersCache.forEach((id) => this.clearCache(id));
      this.clearPointersCache = [];
    }

    // window.requestAnimationFrame(this.dispatchCachedEvents);
  }

  onPointerCancel(event: PointerEvent): void {
    console.log('Pointer cancel: ' + event.pointerId);
    // if (this.pending()) {
    //   this.cancel();
    // }

    // this.setCurrentEvent(event);
    // this.clearCache(event.pointerId);
    this.onPointerUp(event);
  }

  dispatch(): void {
    this.touchListeners.forEach((activity) => activity.onTouch(this));
  }

  private setCurrentEvent(e: PointerEvent): void {
    if (!this.lastEvent) {
      this.pointers.allIds.push(e.pointerId);
      this.lastEvent = e;
      return;
    }
    const pid = this.lastEvent.pointerId;
    let index = this.pointers.allIds.findIndex((id) => id === pid);
    if (index === -1) {
      index = this.pointers.allIds.length;
      this.pointers.allIds.push(pid);
    }
    this.pointers.byId[pid] = this.pointers.byId[pid] || { index, cache: [] };
    if (e.type === 'pointermove') {
      this.pointers.byId[pid].cache.push(this.lastEvent);
    }

    this.lastEvent = e;

    // this.history2.push(this.lastEvent);
    // this.lastEvent = e;

    // const index = this.history.allIds.findIndex(id => id === e.pointerId);
    // if (index > -1) {
    //   this.history.byIndex.get(index).push(e);
    // } else {
    //   this.history.allIds.push(e.pointerId);
    //   this.history.byIndex.set(this.history.allIds.length - 1, [e]);
    // }

    // this.activeEvent = e;
  }

  private getPointerCoordX(event: PointerEvent): number {
    return event.clientX - this.containerBoundingRect.left;
  }

  private getPointerCoordY(event: PointerEvent): number {
    return event.clientY - this.containerBoundingRect.top;
  }

  private clearCache(pointerId: number): void {
    const index = this.pointers.byId[pointerId].index;
    this.pointers.allIds.splice(index, 1);
    this.pointers.byId[pointerId].cache = [];
    this.updateIndexes();
  }

  private updateIndexes(): void {
    this.pointers.allIds.forEach((id: number, index: number) => {
      this.pointers.byId[id].index = index;
    });
  }
}
