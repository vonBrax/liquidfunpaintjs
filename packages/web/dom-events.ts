interface EventPayload {
  clientX?: number;
  clientY?: number;
}

// enum PointerType {
//   'mouse',
//   'pen',
//   'touch',
//   '',
// }

export class DomEvents {
  private static registeredPointers = 0;
  private static mSamplePointerCoords: Array<number[]> = [];

  private static registerPointer(): number {
    return ++this.registeredPointers;
  }

  private static touchstart(touch: Touch): TouchEvent {
    const touches = [];
    for (let i = 0; i < this.mSamplePointerCoords.length; i++) {
      const [identifier, clientX, clientY] = this.mSamplePointerCoords[i];
      touches.push(
        new Touch({
          identifier,
          clientX,
          clientY,
          // Not keeping track of individual targets
          target: touch.target,
        }),
      );
    }
    touches.push(touch);
    this.mSamplePointerCoords.push([
      touch.identifier,
      touch.clientX,
      touch.clientY,
    ]);
    const event = new TouchEvent('touchstart', {
      changedTouches: [touch],
      touches,
    });

    return event;
  }

  private static touchmove(touch: Touch): TouchEvent {
    this.mSamplePointerCoords[touch.identifier] = [
      touch.clientX,
      touch.clientY,
    ];

    const touches = [];
    for (let i = 0; i < this.mSamplePointerCoords.length; i++) {
      const [clientX, clientY] = this.mSamplePointerCoords[i];
      touches.push(
        new Touch({
          identifier: i + 1,
          clientX,
          clientY,
          // Not keeping track of individual targets
          target: touch.target,
        }),
      );
    }

    const event = new TouchEvent('touchmove', {
      changedTouches: [touch],
      touches,
    });

    return event;
  }

  private static touchend(touch: Touch): TouchEvent {
    const touches = [];

    for (let i = 0; i < this.mSamplePointerCoords.length; i++) {
      const [identifier, clientX, clientY] = this.mSamplePointerCoords[i];

      if (identifier === touch.identifier) {
        // Flag item to be removed
        this.mSamplePointerCoords[i] = null;
        continue;
      }

      touches.push(
        new Touch({
          identifier,
          clientX,
          clientY,
          // Not keeping track of individual targets
          target: touch.target,
        }),
      );
    }
    this.mSamplePointerCoords = this.mSamplePointerCoords.filter(Boolean);

    const event = new TouchEvent('touchend', {
      changedTouches: [touch],
      touches,
    });

    return event;
  }

  private static pointerdown(event: MouseEvent): MouseEvent;
  private static pointerdown(event: PointerEvent): PointerEvent;
  private static pointerdown(
    event: MouseEvent | PointerEvent,
  ): MouseEvent | PointerEvent {
    let id = 1;
    if (event instanceof PointerEvent) {
      id = event.pointerId;
    }
    this.mSamplePointerCoords.push([id, event.clientX, event.clientY]);
    return event;
  }

  // private static pointermove(event: MouseEvent): MouseEvent;
  // private static pointermove(event: PointerEvent): PointerEvent;
  // private static pointermove(event: MouseEvent | PointerEvent): MouseEvent | PointerEvent {
  //   let id = 1;
  //   if (event instanceof PointerEvent) {
  //     id = event.pointerId;
  //   }
  // }

  // private static getOther;

  public static Pointer = class {
    public toolType: string;
    public id: number;
    public target: HTMLElement;

    constructor(
      type: 'mouse' | 'pen' | 'touch' | '' = '',
      target: HTMLElement,
    ) {
      this.toolType = type;
      this.id = DomEvents.registerPointer();
      this.target = target;
    }

    touchstart(payload: EventPayload): TouchEvent {
      const touch = new Touch({
        ...payload,
        identifier: this.id,
        target: this.target,
      });

      return DomEvents.touchstart(touch);
    }

    pointerdown(payload: EventPayload): PointerEvent {
      const event: PointerEvent = new PointerEvent('pointerdown', {
        ...payload,
        pointerId: this.id,
        pointerType: this.toolType,
      });

      return DomEvents.pointerdown(event) as PointerEvent;
    }

    mousedown(payload: EventPayload): MouseEvent {
      const event: MouseEvent = new MouseEvent('mousedown', payload);

      return DomEvents.pointerdown(event) as MouseEvent;
    }

    touchmove(payload: EventPayload): TouchEvent {
      const touch = new Touch({
        ...payload,
        identifier: this.id,
        target: this.target,
      });

      return DomEvents.touchmove(touch);
    }

    pointermove(payload: EventPayload): PointerEvent {
      const event: PointerEvent = new PointerEvent('pointermove', {
        ...payload,
        pointerId: this.id,
        pointerType: this.toolType,
      });

      // return DomEvents.pointermove(event) as PointerEvent;
      return event;
    }

    mousemove(payload: EventPayload): MouseEvent {
      const event: MouseEvent = new MouseEvent('mousemove', payload);

      // return DomEvents.pointermove(event);
      return event;
    }

    touchend(payload: EventPayload): TouchEvent {
      const touch = new Touch({
        ...payload,
        identifier: this.id,
        target: this.target,
      });

      return DomEvents.touchend(touch);
    }
  };
}
