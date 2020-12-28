/**
 * @todo
 * Serialize MotionEventBuild parameters
 * to pass it to the worker
 */
// import { MotionEventBuilder } from './motion-event-builder';
import {
  MotionEvent,
  PointerProperties,
  PointerCoords,
  // PointerCoords,
  // PointerProperties,
} from '@lfpjs/common';

// declare type AllPointerEvents = MouseEvent | TouchEvent | PointerEvent;

// timeStamp, action, offsetX, offsetY, pointerId, type, x, y, ...pointerCoords
declare type MotionEventBuildParams = Array<number | number[][]>;

declare interface CachedEvent {
  id: number;
  toolType: number;
  pointerCoords: number[];
}

export class MotionEventListener {
  private pointerDownName = 'pointerdown';
  private pointerUpName = 'pointerup';
  private pointerMoveName = 'pointermove';
  private pointerCancelName = 'pointercancel';

  private pointerOutName = 'pointerout';
  private pointerLeaveName = 'pointerleave';
  private pointerOverName = 'pointerover';
  private pointerEnterName = 'pointerenter';

  private ignorePointerMoveEvents = false;

  private pointerEventsSupport = false;
  private target: HTMLElement;

  // private subscribers: any[] = [];

  private timer: number = null;
  private tick = 50;
  private timeoutId: number;

  private moveEventParams: MotionEventBuildParams;
  private eventsCache: Map<number, CachedEvent> = new Map<
    number,
    CachedEvent
  >();

  private mPointerProperties: PointerProperties[] = [];
  private mSampleEventTimes: number[] = [];
  private mSamplePointerCoords: Array<PointerCoords[]> = [];

  private pointersDown = 0;
  // private moveEventCoords: PointerCoords[];

  private worker: Worker;

  constructor(target: HTMLElement, worker: Worker, attachListeners = true) {
    if (window.navigator.msPointerEnabled) {
      this.pointerDownName = 'MSPointerDown';
      this.pointerUpName = 'MSPointerUp';
      this.pointerMoveName = 'MSPointerMove';
      this.pointerCancelName = 'MSPointerCancel';
    }
    if (window.PointerEvent || window.navigator.msPointerEnabled) {
      this.pointerEventsSupport = true;
    }
    this.target = target;
    this.worker = worker;

    this.bindListeners();
    if (attachListeners) {
      this.attachListeners();
    }
  }

  private bindListeners(): void {
    this.handleGestureStart = this.handleGestureStart.bind(this);
    this.handleGestureMove = this.handleGestureMove.bind(this);
    this.handleGestureEnd = this.handleGestureEnd.bind(this);

    this.pauseMoveEvents = this.pauseMoveEvents.bind(this);
    this.resumeMoveEvents = this.resumeMoveEvents.bind(this);
  }

  private attachListeners(): void {
    if (this.pointerEventsSupport) {
      this.target.addEventListener(
        this.pointerDownName,
        this.handleGestureStart,
        true,
      );
    } else {
      this.target.addEventListener('touchstart', this.handleGestureStart, true);
      this.target.addEventListener('touchmove', this.handleGestureMove, true);
      this.target.addEventListener('touchend', this.handleGestureEnd, true);
      this.target.addEventListener('touchcancel', this.handleGestureEnd, true);

      this.target.addEventListener('mousedown', this.handleGestureStart, true);
    }
  }

  private attachPointerListeners(): void {
    this.target.addEventListener(
      this.pointerMoveName,
      this.handleGestureMove,
      true,
    );
    document.addEventListener(this.pointerUpName, this.handleGestureEnd, true);
    document.addEventListener(
      this.pointerCancelName,
      this.handleGestureEnd,
      true,
    );
    this.target.addEventListener(
      this.pointerOutName,
      this.pauseMoveEvents,
      true,
    );
    this.target.addEventListener(
      this.pointerLeaveName,
      this.pauseMoveEvents,
      true,
    );
    this.target.addEventListener(
      this.pointerOverName,
      this.resumeMoveEvents,
      true,
    );
    this.target.addEventListener(
      this.pointerEnterName,
      this.resumeMoveEvents,
      true,
    );
  }

  private detachPointerListeners(): void {
    this.target.removeEventListener(
      this.pointerMoveName,
      this.handleGestureMove,
      true,
    );
    document.removeEventListener(
      this.pointerUpName,
      this.handleGestureEnd,
      true,
    );
    document.removeEventListener(
      this.pointerCancelName,
      this.handleGestureEnd,
      true,
    );
    this.target.removeEventListener(
      this.pointerOutName,
      this.pauseMoveEvents,
      true,
    );
    this.target.removeEventListener(
      this.pointerLeaveName,
      this.pauseMoveEvents,
      true,
    );
    this.target.removeEventListener(
      this.pointerOverName,
      this.resumeMoveEvents,
      true,
    );
    this.target.removeEventListener(
      this.pointerEnterName,
      this.resumeMoveEvents,
      true,
    );
  }

  private pauseMoveEvents(): void {
    this.ignorePointerMoveEvents = true;
  }

  private resumeMoveEvents(): void {
    this.ignorePointerMoveEvents = false;
  }

  private handleGestureStart(evt: MouseEvent): void;
  private handleGestureStart(evt: TouchEvent): void;
  private handleGestureStart(evt: PointerEvent): void;
  private handleGestureStart(
    evt: MouseEvent | TouchEvent | PointerEvent,
  ): void {
    evt.preventDefault();
    // this.pointersDown++;

    // const target: HTMLElement = evt.target as HTMLElement;
    // let buildParams: MotionEventBuildParams;

    let id;
    let toolType;
    let clientX;
    let clientY;

    let action;

    if (evt instanceof TouchEvent) {
      const touch: Touch = evt.changedTouches.item(0);
      // const { identifier, clientX, clientY } = touch;
      // const [x, y, offsetX, offsetY] = this.getCoordinates(clientX, clientY);

      // id = identifier;
      id = touch.identifier;
      toolType = MotionEvent.TOOL_TYPE_FINGER;
      clientX = touch.clientX;
      clientY = touch.clientY;
      action =
        this.mPointerProperties.length > 1
          ? MotionEvent.ACTION_POINTER_DOWN
          : MotionEvent.ACTION_DOWN;
      // pp.id = identifier;
      // pp.toolType = MotionEvent.TOOL_TYPE_FINGER;
      // this.mPointerProperties.push(pp);

      // const pc = new PointerCoords();
      // pc.x = x;
      // pc.y = y;

      // this.pointersDown = evt.touches.length;
      // buildParams = this.motionEventFromTouch(
      //   evt,
      //   evt.touches.length === 1
      //     ? MotionEvent.ACTION_DOWN
      //     : MotionEvent.ACTION_POINTER_DOWN,
      // );
    } else if (evt instanceof PointerEvent && this.pointerEventsSupport) {
      // pp.id = evt.pointerId;
      // pp.toolType = this.motionEventToolTypeMap(evt.pointerType);
      // this.mPointerProperties.push(pp);
      id = evt.pointerId;
      toolType = this.motionEventToolTypeMap(evt.pointerType);
      clientX = evt.clientX;
      clientY = evt.clientY;
      action = evt.isPrimary
        ? MotionEvent.ACTION_DOWN
        : MotionEvent.ACTION_POINTER_DOWN;

      // Attach listeners only on first pointer touch
      // if (this.pointersDown === 1) {
      //   this.attachPointerListeners();
      // }
      if (evt.isPrimary) {
        this.attachPointerListeners();
      }
      this.resumeMoveEvents();
      // target.setPointerCapture(evt.pointerId);
      // buildParams = this.motionEventFromPointer(
      //   evt,
      //   evt.isPrimary
      //     ? MotionEvent.ACTION_DOWN
      //     : MotionEvent.ACTION_POINTER_DOWN,
      // );
    } else {
      // pp.id = 1;
      // pp.toolType = MotionEvent.TOOL_TYPE_MOUSE;
      // this.mPointerProperties.push(pp);
      id = 1;
      toolType = MotionEvent.TOOL_TYPE_MOUSE;
      clientX = evt.clientX;
      clientY = evt.clientY;
      action = MotionEvent.ACTION_DOWN;

      // buildParams = this.motionEventFromMouse(
      //   evt as MouseEvent,
      //   MotionEvent.ACTION_DOWN,
      // );
      // Attach listeners only on first pointer touch
      // if (this.pointersDown === 1) {
      //   document.addEventListener('mousemove', this.handleGestureMove, true);
      //   document.addEventListener('mouseup', this.handleGestureEnd, true);
      // }

      // Not expecting more than one mouse pointer
      document.addEventListener('mousemove', this.handleGestureMove, true);
      document.addEventListener('mouseup', this.handleGestureEnd, true);
    }

    const pp = new PointerProperties();
    pp.id = id;
    pp.toolType = toolType;

    this.mPointerProperties.push(pp);
    this.mSampleEventTimes.push(evt.timeStamp);

    // const pointerCount = this.mPointerProperties.length;
    const sampleCount = this.mSampleEventTimes.length;

    /**
     * @todo:
     * Make sure that we have one PointerCoords
     * for each actve pointer.
     * If I'm thinking straight, for pointerdown
     * events, we should not have batched events,
     * which means history size will not be
     * greater than 1, so no need to check
     * sampleCount
     */
    // for (let h = 0; h < sampleCount; h++) {
    //   for (let i = 0; i < pointerCount; i++) {

    //   }
    // }

    const [x, y, offsetX, offsetY] = this.getCoordinates(clientX, clientY);
    const pc = new PointerCoords();
    pc.setAxisValue(MotionEvent.AXIS_X, x);
    pc.setAxisValue(MotionEvent.AXIS_Y, y);

    const storedX = pc.getAxisValue(MotionEvent.AXIS_X);
    const storedY = pc.getAxisValue(MotionEvent.AXIS_Y);
    if (storedX !== x) {
      throw new Error(`Expected "${storedX}" to equal "${x}"`);
    }
    if (storedY !== y) {
      throw new Error(`Expected "${storedY}" to equal "${y}"`);
    }

    // If this is the first pointer down, we need
    // to create the PointerCoords array.
    // The array will hold one pointer coord for each
    // active pointer.
    // For every new batched move event, we create
    // another PointerCoords array (len = pointerCount)
    // inside mSamplePointerCoords.
    // Only move events will be batched and therefore
    // only move events will have history size different
    // than 0.
    this.mSamplePointerCoords[sampleCount - 1] =
      this.mSamplePointerCoords[sampleCount - 1] || [];
    this.mSamplePointerCoords[sampleCount - 1].push(pc);
    // this.mSamplePointerCoords.push([pc]);

    const parcel = this.writeParcel(action, offsetX, offsetY);

    // this.dispatch(buildParams);
    this.dispatch(parcel);

    // const pointerId: number = buildParams[4] as number;
    // const type: number = buildParams[5] as number;
    // // const pp = new PointerProperties();
    // // pp.id = pointerId;
    // // pp.toolType = type;

    // this.eventsCache.set(pointerId, {
    //   id: pointerId,
    //   toolType: type,
    //   pointerCoords: [],
    // });
  }

  private writeParcel(
    action: number,
    offsetX: number,
    offsetY: number,
  ): number[] {
    const pointerCount = this.mPointerProperties.length;
    const sampleCount = this.mSampleEventTimes.length;

    const parcel = [pointerCount, sampleCount, action, offsetX, offsetY];

    // console.log({
    //   pointerCount,
    //   sampleCount,
    //   mPointerProperties: Array.from(this.mPointerProperties),
    //   mSamplePointerCoords: Array.from(this.mSamplePointerCoords),
    //   mSampleEventTimes: this.mSampleEventTimes,
    // });
    for (let i = 0; i < pointerCount; i++) {
      const properties = this.mPointerProperties[i];
      parcel.push(properties.id);
      parcel.push(properties.toolType);
    }

    for (let h = 0; h < sampleCount; h++) {
      parcel.push(this.mSampleEventTimes[h]);
      for (let i = 0; i < pointerCount; i++) {
        const pc = this.mSamplePointerCoords[h][i];
        pc.writeToParcel(parcel);
      }
    }

    return parcel;
  }

  private handleGestureMove(evt: MouseEvent): void;
  private handleGestureMove(evt: TouchEvent): void;
  private handleGestureMove(evt: PointerEvent): void;
  private handleGestureMove(evt: MouseEvent | TouchEvent | PointerEvent): void {
    // Ignore cache for now, just send the events through
    // to the worker. Shift the work to the, well, "worker" :)
    evt.preventDefault();

    if (this.ignorePointerMoveEvents) {
      return;
    }

    // // Dispatch move events only once every 200ms
    // if (this.isTimerRunning()) {
    //   const events =
    //     evt instanceof TouchEvent ? Array.from(evt.changedTouches) : [evt];

    //   /**
    //    * @todo
    //    * Each pointer should have
    //    * its own PointerCoords array
    //    * so we can call addBatch properly
    //    */
    //   events.forEach((e: MouseEvent | PointerEvent | Touch) => {
    //     const id =
    //       e instanceof Touch
    //         ? e.identifier
    //         : e instanceof PointerEvent
    //         ? e.pointerId
    //         : 1;
    //     const { clientX, clientY } = e;
    //     const [x, y] = this.getCoordinates(clientX, clientY);
    //     // this.moveEventParams.push(x);
    //     // this.moveEventParams.push(y);
    //     if (!this.eventsCache.has(id)) {
    //       throw new Error(
    //         `Pointer id "${id}" was not registered before move event.`,
    //       );
    //     }
    //     const cache = this.eventsCache.get(id);
    //     cache.pointerCoords.push(x);
    //     cache.pointerCoords.push(y);
    //     // const pc = new PointerCoords();
    //     // pc.setAxisValue(MotionEvent.AXIS_X, x);
    //     // pc.setAxisValue(MotionEvent.AXIS_Y, y);
    //     // this.moveEventCoords.push(pc);
    //   });
    //   return;
    // }

    let id: number;
    // let toolType: number;
    // let clientX: number;
    // let clientY: number;
    const action = MotionEvent.ACTION_MOVE;

    // No caching, no keeping history.
    // History size always 0
    this.mSampleEventTimes[0] = evt.timeStamp;

    // Iterate over all current active pointers and
    // update their coords if neeeded
    // const pointerCount = this.mPointerProperties.length;
    // const sampleCount = this.mSampleEventTimes.length;
    // for (let h = 0; h < sampleCount; h++) {
    //   for (let i = 0; i < pointerCount; i++) {
    //     const pp = this.mPointerProperties[i];
    //     const pc = this.mSamplePointerCoords[h][i];

    //     if (evt instanceof TouchEvent) {
    //       const touch = evt.changedTouches.item(i);

    //       const [x, y, offsetX, offsetY] = this.getCoordinates(
    //         touch.clientX,
    //         touch.clientY,
    //       );
    //       pc.setAxisValue(MotionEvent.AXIS_X, x);
    //       pc.setAxisValue(MotionEvent.AXIS_Y, y);

    //       const parcel = this.writeParcel(action, offsetX, offsetY);
    //       this.dispatch(parcel);
    //     }
    //   }
    // }
    if (evt instanceof TouchEvent) {
      // Since touch events may carry multiple touch pointers
      // information, we will dispatch a new MotionEvent for every
      // pointer in the changedTouches TouchList ( we are not
      // creating batched MotionEvents for now)
      for (let i = 0; i < evt.changedTouches.length; i++) {
        const touch = evt.changedTouches.item(i);
        const pointerIndex = this.mPointerProperties.findIndex(
          (pp) => pp.id === touch.identifier,
        );
        const pc = this.mSamplePointerCoords[0][pointerIndex];
        const [x, y, offsetX, offsetY] = this.getCoordinates(
          touch.clientX,
          touch.clientY,
        );
        pc.setAxisValue(MotionEvent.AXIS_X, x);
        pc.setAxisValue(MotionEvent.AXIS_Y, y);

        const parcel = this.writeParcel(action, offsetX, offsetY);
        this.dispatch(parcel);
      }

      return;
    } else if (evt instanceof PointerEvent) {
      id = evt.pointerId;
    } else {
      id = 1;
    }

    const pointerIndex = this.mPointerProperties.findIndex(
      (pp) => pp.id === id,
    );
    const pc = this.mSamplePointerCoords[0][pointerIndex];
    const [x, y, offsetX, offsetY] = this.getCoordinates(
      evt.clientX,
      evt.clientY,
    );
    pc.setAxisValue(MotionEvent.AXIS_X, x);
    pc.setAxisValue(MotionEvent.AXIS_Y, y);
    const parcel = this.writeParcel(action, offsetX, offsetY);
    this.dispatch(parcel);

    // if (evt instanceof TouchEvent) {
    //   for (let i = 0; i < evt.changedTouches.length; i++) {
    //     const touch = evt.changedTouches.item(i);
    //   }
    //   // this.moveEventParams = this.motionEventFromTouch(
    //   //   evt,
    //   //   MotionEvent.ACTION_MOVE,
    //   // );
    //   // Note: PointerEvent extends MouseEvent,
    //   // so it will return true for PointerEvent_instance instanceof MouseEvent
    // } else if (this.pointerEventsSupport && evt instanceof PointerEvent) {
    //   this.moveEventParams = this.motionEventFromPointer(
    //     evt,
    //     MotionEvent.ACTION_MOVE,
    //   );
    // } else {
    //   // MouseEvent
    //   this.moveEventParams = this.motionEventFromMouse(
    //     evt,
    //     MotionEvent.ACTION_MOVE,
    //   );
    // }

    // this.startTimer();
  }

  private handleGestureEnd(evt: MouseEvent): void;
  private handleGestureEnd(evt: TouchEvent): void;
  private handleGestureEnd(evt: PointerEvent): void;
  private handleGestureEnd(evt: MouseEvent | TouchEvent | PointerEvent): void {
    evt.preventDefault();
    // const target: HTMLElement = evt.target as HTMLElement;
    // this.pointersDown--;

    // let motionEventParams: MotionEventBuildParams;

    const action =
      evt.type === 'touchcancel' || evt.type === this.pointerCancelName
        ? MotionEvent.ACTION_CANCEL
        : this.mPointerProperties.length === 1
        ? MotionEvent.ACTION_UP
        : MotionEvent.ACTION_POINTER_UP;
    let clientX: number;
    let clientY: number;
    let pointerId: number;

    if (evt instanceof TouchEvent) {
      const touch = evt.changedTouches.item(0);
      clientX = touch.clientX;
      clientY = touch.clientY;
      pointerId = touch.identifier;
    } else if (evt instanceof PointerEvent) {
      clientX = evt.clientX;
      clientY = evt.clientY;
      pointerId = evt.pointerId;
    } else {
      clientX = evt.clientX;
      clientY = evt.clientY;
      pointerId = 1;
    }

    const [x, y, offsetX, offsetY] = this.getCoordinates(clientX, clientY);
    const pointerIndex = this.mPointerProperties.findIndex(
      (pp) => pp.id === pointerId,
    );
    const pc = this.mSamplePointerCoords[0][pointerIndex];
    pc.setAxisValue(MotionEvent.AXIS_X, x);
    pc.setAxisValue(MotionEvent.AXIS_Y, y);

    this.mSampleEventTimes[0] = evt.timeStamp;

    const parcel = this.writeParcel(action, offsetX, offsetY);
    this.dispatch(parcel);

    // Clean up entries for pointer that went up
    const sampleCount = this.mSampleEventTimes.length;
    for (let h = 0; h < sampleCount; h++) {
      this.mSamplePointerCoords[h].splice(pointerIndex, 1);
      this.mSampleEventTimes.splice(h, 1);
    }
    this.mPointerProperties.splice(pointerIndex, 1);
    const pointerCount = this.mPointerProperties.length;

    if (pointerCount === 0) {
      if (this.pointerEventsSupport) {
        this.detachPointerListeners();
      } else {
        document.removeEventListener('mousemove', this.handleGestureMove, true);
        document.removeEventListener('mouseup', this.handleGestureEnd, true);
      }
    }

    // if (evt instanceof TouchEvent) {
    //   this.pointersDown = evt.touches.length;
    //   action =
    //     action || evt.touches.length === 1
    //       ? MotionEvent.ACTION_UP
    //       : MotionEvent.ACTION_POINTER_UP;

    //   motionEventParams = this.motionEventFromTouch(evt, action);
    // } else if (this.pointerEventsSupport && evt instanceof PointerEvent) {
    //   // Wait all pointers go up before detaching the listeners
    //   if (this.pointersDown === 0) {
    //     this.detachPointerListeners();
    //   }

    //   // target.releasePointerCapture(evt.pointerId);
    //   action =
    //     action || evt.isPrimary
    //       ? MotionEvent.ACTION_UP
    //       : MotionEvent.ACTION_POINTER_UP;

    //   motionEventParams = this.motionEventFromPointer(evt, action);
    // } else {
    //   // MouseEvent
    //   motionEventParams = this.motionEventFromMouse(
    //     evt as MouseEvent,
    //     MotionEvent.ACTION_UP,
    //   );
    //   if (this.pointersDown === 0) {
    //     // Wait all pointers go up before detaching the listeners
    //     document.removeEventListener('mousemove', this.handleGestureMove, true);
    //     document.removeEventListener('mouseup', this.handleGestureEnd, true);
    //   }
    // }

    // // Clear cached move events
    // if (this.timeoutId) {
    //   clearTimeout(this.timeoutId);
    //   this.timeoutId = null;
    //   this.stopTimer();
    //   this.dispatch(motionEventParams);
    //   const pointerId: number = motionEventParams[4] as number;
    //   this.eventsCache.delete(pointerId);
    // } else {
    //   // make sure pointerup goes after pointermove
    //   setTimeout(() => {
    //     this.dispatch(motionEventParams);
    //     const pointerId: number = motionEventParams[4] as number;
    //     this.eventsCache.delete(pointerId);
    //   });
    // }
  }

  private motionEventFromTouch(
    evt: TouchEvent,
    action: number,
  ): MotionEventBuildParams {
    const touch: Touch = evt.changedTouches.item(0);
    const { identifier, clientX, clientY } = touch;
    const [x, y, offsetX, offsetY] = this.getCoordinates(clientX, clientY);
    const type = MotionEvent.TOOL_TYPE_FINGER;

    const params: MotionEventBuildParams = [
      // evt.touches.length,
      evt.timeStamp,
      action,
      offsetX,
      offsetY,
      identifier,
      type,
      x,
      y,
    ];

    // const pointerProperties = [];
    // const pointerCoords = [];
    // // Pass along any information on other touch points
    // // if (evt.touches.length > 1) {
    // for (let i = 0; i < evt.changedTouches.length; i++) {
    //   const { clientX, clientY, identifier } = evt.touches.item(i);
    //   pointerProperties.push(identifier);
    //   pointerProperties.push(type);

    //   const [x, y] = this.getCoordinates(clientX, clientY);
    //   // params.push(x);
    //   // params.push(y);
    //   pointerCoords.push(x);
    //   pointerCoords.push(y);
    // }
    // // }

    // params.push(pointerProperties);
    // params.push(pointerCoords);
    return params;
  }

  private motionEventFromPointer(
    evt: PointerEvent,
    action: number,
  ): MotionEventBuildParams {
    const {
      pointerId,
      pointerType,
      clientX = evt.x,
      clientY = evt.y,
      timeStamp,
    } = evt;
    const [x, y, offsetX, offsetY] = this.getCoordinates(clientX, clientY);
    const type = this.motionEventToolTypeMap(pointerType);

    return [
      // this.pointersDown,
      timeStamp,
      action,
      offsetX,
      offsetY,
      pointerId,
      type,
      x,
      y,
    ];
  }

  public motionEventFromMouse(
    evt: MouseEvent,
    action: number,
  ): MotionEventBuildParams {
    const { timeStamp, clientX = evt.x, clientY = evt.y } = evt;
    const [x, y, offsetX, offsetY] = this.getCoordinates(clientX, clientY);
    const pointerId = 1;
    const type = MotionEvent.TOOL_TYPE_MOUSE;

    return [timeStamp, action, offsetX, offsetY, pointerId, type, x, y];
  }

  private motionEventToolTypeMap(toolType: string): number {
    switch (toolType.toLowerCase()) {
      case 'mouse':
        return MotionEvent.TOOL_TYPE_MOUSE;
      case 'pen':
        return MotionEvent.TOOL_TYPE_STYLUS;
      case 'touch':
        return MotionEvent.TOOL_TYPE_FINGER;
      default:
        return MotionEvent.TOOL_TYPE_UNKNOWN;
    }
  }

  private getCoordinates(clientX: number, clientY: number): number[] {
    const containerBox = this.target.getBoundingClientRect();

    return [clientX, clientY, -containerBox.left, -containerBox.top];
  }

  private startTimer(): void {
    this.timer = Date.now();
    // this.moveEventCoords = [];
    this.timeoutId = setTimeout(() => this.stopTimer(), this.tick);
  }

  private stopTimer(): void {
    // if (this.moveEventCoords.length) {
    //   this.moveEvent.addBatch(this.timer, this.moveEventCoords);
    // }
    const pointerProperties: Array<number[]> = [];
    const pointerCoords: Array<number[]> = [];
    this.eventsCache.forEach((cache) => {
      const pp = [];
      pp.push(cache.id);
      pp.push(cache.toolType);
      pointerProperties.push(pp);
      pointerCoords.push(cache.pointerCoords);
      cache.pointerCoords = [];
    });
    this.moveEventParams.push(pointerProperties);
    this.moveEventParams.push(pointerCoords);
    this.dispatch(this.moveEventParams);

    this.timer = null;
    this.moveEventParams = null;
    this.timeoutId = null;
    // this.eventsCache.clear();
  }

  private isTimerRunning(): boolean {
    return this.timer !== null;
  }

  // public subscribe(fn: any): void {
  //   this.subscribers.push(fn);
  // }

  private dispatch(params: MotionEventBuildParams): void {
    // this.subscribers.forEach((sub) => sub(params));
    this.worker.postMessage({ type: 'motionevent', value: params });
  }

  public simulate(evt: TouchEvent | PointerEvent | MouseEvent): void {
    if (evt instanceof TouchEvent) {
      this.simulateTouch(evt);
    } else if (evt instanceof PointerEvent) {
      this.simulatePointer(evt);
    } else {
      this.simulateMouse(evt);
    }
  }

  private simulateTouch(evt: TouchEvent): void {
    switch (evt.type) {
      case 'touchstart':
        return this.handleGestureStart(evt);
      case 'touchmove':
        return this.handleGestureMove(evt);
      case 'touchup':
      case 'touchcancel':
        return this.handleGestureEnd(evt);
    }
  }

  private simulatePointer(evt: PointerEvent): void {
    switch (evt.type) {
      case 'pointerdown':
        return this.handleGestureStart(evt);
      case 'pointermove':
        return this.handleGestureMove(evt);
      case 'pointerup':
      case 'pointercancel':
        return this.handleGestureEnd(evt);
      case 'pointerenter':
      case 'pointerover':
        return this.resumeMoveEvents();
      case 'pointerleave':
      case 'pointerout':
        return this.pauseMoveEvents();
    }
  }

  private simulateMouse(evt: MouseEvent): void {
    // todo
  }
}
