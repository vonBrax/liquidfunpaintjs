export class MotionEvent {
  private static NS_PER_MS = 1000000;
  public static INVALID_POINTER_ID = -1;
  protected static HISTORY_CURRENT = -0x80000000;

  public static ACTION_MASK = 0xff;
  public static ACTION_DOWN = 0;
  public static ACTION_UP = 1;
  public static ACTION_MOVE = 2;
  public static ACTION_CANCEL = 3;
  public static ACTION_OUTSIDE = 4;
  public static ACTION_POINTER_DOWN = 5;
  public static ACTION_POINTER_UP = 6;
  public static ACTION_HOVER_MOVE = 7;
  public static ACTION_SCROLL = 8;
  public static ACTION_HOVER_ENTER = 9;
  public static ACTION_HOVER_EXIT = 10;
  public static ACTION_BUTTON_PRESS = 11;
  public static ACTION_BUTTON_RELEASE = 12;
  public static ACTION_POINTER_INDEX_MASK = 0xff00;
  public static ACTION_POINTER_INDEX_SHIFT = 8;
  // // @Deprecated
  // public static ACTION_POINTER_1_DOWN =
  //   MotionEvent.ACTION_POINTER_DOWN | 0x0000;
  // // @Deprecated
  // public static ACTION_POINTER_2_DOWN =
  //   MotionEvent.ACTION_POINTER_DOWN | 0x0100;
  // // @Deprecated
  // public static ACTION_POINTER_3_DOWN =
  //   MotionEvent.ACTION_POINTER_DOWN | 0x0200;
  // // @Deprecated
  // public static ACTION_POINTER_1_UP = MotionEvent.ACTION_POINTER_UP | 0x0000;
  // // @Deprecated
  // public static ACTION_POINTER_2_UP = MotionEvent.ACTION_POINTER_UP | 0x0100;
  // // @Deprecated
  // public static ACTION_POINTER_3_UP = MotionEvent.ACTION_POINTER_UP | 0x0200;
  // // @Deprecated
  // public static ACTION_POINTER_ID_MASK = 0xff00;
  // // @Deprecated
  public static ACTION_POINTER_ID_SHIFT = 8;
  // public static FLAG_WINDOW_IS_OBSCURED = 0x1;
  // public static FLAG_WINDOW_IS_PARTIALLY_OBSCURED = 0x2;
  // public static FLAG_HOVER_EXIT_PENDING = 0x4;
  // public static FLAG_IS_GENERATED_GESTURE = 0x8;
  // public static FLAG_TAINTED = 0x80000000;
  // public static FLAG_TARGET_ACCESSIBILITY_FOCUS = 0x40000000;
  // public static EDGE_TOP = 0x00000001;
  // public static EDGE_BOTTOM = 0x00000002;
  // public static EDGE_LEFT = 0x00000004;
  // public static EDGE_RIGHT = 0x00000008;
  public static AXIS_X = 0;
  public static AXIS_Y = 1;
  public static AXIS_PRESSURE = 2;
  public static AXIS_SIZE = 3;
  public static AXIS_TOUCH_MAJOR = 4;
  public static AXIS_TOUCH_MINOR = 5;
  public static AXIS_TOOL_MAJOR = 6;
  public static AXIS_TOOL_MINOR = 7;
  public static AXIS_ORIENTATION = 8;
  // public static AXIS_VSCROLL = 9;
  // public static AXIS_HSCROLL = 10;
  // public static AXIS_Z = 11;
  // public static AXIS_RX = 12;
  // public static AXIS_RY = 13;
  // public static AXIS_RZ = 14;
  // public static AXIS_HAT_X = 15;
  // public static AXIS_HAT_Y = 16;
  // public static AXIS_LTRIGGER = 17;
  // public static AXIS_RTRIGGER = 18;
  // public static AXIS_THROTTLE = 19;
  // public static AXIS_RUDDER = 20;
  // public static AXIS_WHEEL = 21;
  // public static AXIS_GAS = 22;
  // public static AXIS_BRAKE = 23;
  // public static AXIS_DISTANCE = 24;
  // public static AXIS_TILT = 25;
  // public static AXIS_SCROLL = 26;
  // public static AXIS_RELATIVE_X = 27;
  // public static AXIS_RELATIVE_Y = 28;
  // public static AXIS_GENERIC_1 = 32;
  // public static AXIS_GENERIC_2 = 33;
  // public static AXIS_GENERIC_3 = 34;
  // public static AXIS_GENERIC_4 = 35;
  // public static AXIS_GENERIC_5 = 36;
  // public static AXIS_GENERIC_6 = 37;
  // public static AXIS_GENERIC_7 = 38;
  // public static AXIS_GENERIC_8 = 39;
  // public static AXIS_GENERIC_9 = 40;
  // public static AXIS_GENERIC_10 = 41;
  // public static AXIS_GENERIC_11 = 42;
  // public static AXIS_GENERIC_12 = 43;
  // public static AXIS_GENERIC_13 = 44;
  // public static AXIS_GENERIC_14 = 45;
  // public static AXIS_GENERIC_15 = 46;
  // public static AXIS_GENERIC_16 = 47;
  public static TOOL_TYPE_UNKNOWN = 0;
  public static TOOL_TYPE_FINGER = 1;
  public static TOOL_TYPE_STYLUS = 2;
  public static TOOL_TYPE_MOUSE = 3;
  public static TOOL_TYPE_ERASER = 4;

  // private deviceId: number;
  // private source: number;
  // private displayId: number;

  private mAction: number;
  // private mActionButton: number;
  private mFlags: number;
  // private mEdgeFlags: number;
  // private mMetaState: number;
  // private mButtonState: number;
  // // private mClassification: MotionClassification;
  private mXOffset: number;
  private mYOffset: number;
  // private mXPrecision: number;
  // private mYPrecision: number;
  // private mDownTime: number;
  private mPointerProperties: Array<PointerProperties> = new Array<PointerProperties>();
  private mSampleEventTimes: Array<number> = new Array<number>();
  private mSamplePointerCoords: Array<PointerCoords> = new Array<PointerCoords>();

  // private static MAX_POINTERS = 16;
  // private static MAX_SAMPLES = 2 ^ 16; // UINT16_MAX
  // private static MAX_POINTER_ID = 31;

  // Naming convention (unless noted otherwise):
  // general public methods are borrowed from:
  // - https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/view/MotionEvent.java
  // - https://cs.android.com/android/platform/superproject/+/master:external/robolectric-shadows/shadows/framework/src/main/java/org/robolectric/shadows/ShadowMotionEvent.java
  // Private native android_view_MotionEvent methods, begin with "_" and taken from:
  // - https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/jni/android_view_MotionEvent.cpp
  // - https://cs.android.com/android/platform/superproject/+/master:external/robolectric-shadows/shadows/framework/src/main/java/org/robolectric/shadows/ShadowMotionEvent.java
  // Private native MotionEvent and InputEvent mehtods, begin with"__" and taken from:
  // - https://cs.android.com/android/platform/superproject/+/master:frameworks/native/libs/input/Input.cpp

  public static obtain(
    eventTime: number,
    action: number,
    xOffset: number,
    yOffset: number,
    pointerCount: number,
    pointerProperties: PointerProperties[],
    pointerCoords: PointerCoords[],
    flags: number,
  ): MotionEvent {
    const ev = new MotionEvent();
    ev._initialize(
      action,
      flags,
      xOffset,
      yOffset,
      eventTime * MotionEvent.NS_PER_MS,
      pointerCount,
      pointerProperties,
      pointerCoords,
    );

    return ev;
  }

  private _initialize(
    action: number,
    flags: number,
    xOffset: number,
    yOffset: number,
    eventTime: number,
    pointerCount: number,
    pointerProperties: PointerProperties[],
    pointerCoords: PointerCoords[],
  ): MotionEvent {
    MotionEvent.validatePointerCount(pointerCount);
    MotionEvent.validatePointerPropertiesArray(pointerProperties, pointerCount);
    MotionEvent.validatePointerCoordsObjArray(pointerCoords, pointerCount);

    for (let i = 0; i < pointerCount; i++) {
      const pointerPropertiesObj: PointerProperties = pointerProperties[i];
      MotionEvent.checkNotNull(pointerPropertiesObj);
      const pointerCoordsObj: PointerCoords = pointerCoords[i];
      MotionEvent.checkNotNull(pointerCoordsObj);
    }

    return this.__initialize(
      action,
      flags,
      xOffset,
      yOffset,
      eventTime,
      pointerCount,
      pointerProperties,
      pointerCoords,
    );
  }

  private __initialize(
    action: number,
    flags: number,
    xOffset: number,
    yOffset: number,
    eventTime: number,
    pointerCount: number,
    pointerProperties: PointerProperties[],
    pointerCoords: PointerCoords[],
  ): MotionEvent {
    this.mAction = action;
    this.mFlags = flags;
    this.mXOffset = xOffset;
    this.mYOffset = yOffset;
    this.mPointerProperties = pointerProperties.slice(0, pointerCount);
    this.mSampleEventTimes = [];
    this.mSamplePointerCoords = [];
    this.__addSample(eventTime, pointerCoords.slice(0, pointerCount));
    return this;
  }

  private __addSample(eventTime: number, pointerCoords: PointerCoords[]): void {
    this.mSampleEventTimes.push(eventTime);
    this.mSamplePointerCoords = this.mSamplePointerCoords.concat(pointerCoords);
  }

  public getAction(): number {
    return this.mAction;
  }

  public getActionMasked(): number {
    return this.mAction & MotionEvent.ACTION_MASK;
  }

  public getActionIndex(): number {
    return (
      (this.mAction & MotionEvent.ACTION_POINTER_INDEX_MASK) >>
      MotionEvent.ACTION_POINTER_INDEX_SHIFT
    );
  }

  public getX(): number;
  public getX(pointerIndex: number): number;
  public getX(pointerIndex = 0): number {
    return this._getAxisValue(
      MotionEvent.AXIS_X,
      pointerIndex,
      MotionEvent.HISTORY_CURRENT,
    );
  }

  public getY(): number;
  public getY(pointerIndex: number): number;
  public getY(pointerIndex = 0): number {
    return this._getAxisValue(
      MotionEvent.AXIS_Y,
      pointerIndex,
      MotionEvent.HISTORY_CURRENT,
    );
  }

  private _getAxisValue(
    axis: number,
    pointerIndex: number,
    historyPos: number,
  ): number {
    const pointerCount: number = this.__getPointerCount();
    MotionEvent.validatePointerIndex(pointerIndex, pointerCount);

    if (historyPos === MotionEvent.HISTORY_CURRENT) {
      return this.__getAxisValue(axis, pointerIndex);
    } else {
      const historySize: number = this.__getHistorySize();
      MotionEvent.validateHistoryPos(historyPos, historySize);
      return this.__getHistoricalAxisValue(axis, pointerIndex, historyPos);
    }
  }

  private __getAxisValue(axis: number, pointerIndex: number): number {
    const value: number = this.__getRawPointerCoords(pointerIndex).getAxisValue(
      axis,
    );
    switch (axis) {
      case MotionEvent.AXIS_X:
        return value + this.mXOffset;
      case MotionEvent.AXIS_Y:
        return value + this.mYOffset;
    }

    return value;
  }

  private __getRawPointerCoords(pointerIndex: number): PointerCoords {
    return this.mSamplePointerCoords[
      this.__getHistorySize() * this.__getPointerCount() + pointerIndex
    ];
  }

  private __getHistoricalAxisValue(
    axis: number,
    pointerIndex: number,
    historicalIndex: number,
  ): number {
    const value = this.__getHistoricalRawPointerCoords(
      pointerIndex,
      historicalIndex,
    ).getAxisValue(axis);

    switch (axis) {
      case MotionEvent.AXIS_X:
        return value + this.mXOffset;
      case MotionEvent.AXIS_Y:
        return value + this.mYOffset;
    }
    return value;
  }

  private __getHistoricalRawPointerCoords(
    pointerIndex: number,
    historicalIndex: number,
  ): PointerCoords {
    return this.mSamplePointerCoords[
      historicalIndex * this.__getPointerCount() + pointerIndex
    ];
  }

  public getHistorySize(): number {
    return this.__getHistorySize();
  }

  private __getHistorySize(): number {
    return this.mSampleEventTimes.length - 1;
  }

  public getHistoricalX(pos: number): number;
  public getHistoricalX(pointerIndex: number, pos: number): number;
  public getHistoricalX(posOrPointerIndex: number, pos?: number): number {
    if (posOrPointerIndex && pos) {
      return this._getAxisValue(MotionEvent.AXIS_X, posOrPointerIndex, pos);
    } else if (posOrPointerIndex) {
      return this._getAxisValue(MotionEvent.AXIS_X, 0, pos);
    }
  }

  public getHistoricalY(pos: number): number;
  public getHistoricalY(pointerIndex: number, pos: number): number;
  public getHistoricalY(posOrPointerIndex: number, pos?: number): number {
    if (posOrPointerIndex && pos) {
      return this._getAxisValue(MotionEvent.AXIS_Y, posOrPointerIndex, pos);
    } else if (posOrPointerIndex) {
      return this._getAxisValue(MotionEvent.AXIS_Y, 0, pos);
    }
  }

  public getPointerCount(): number {
    return this.__getPointerCount();
  }

  private __getPointerCount(): number {
    return this.mPointerProperties.length;
  }

  public getPointerId(pointerIndex: number): number {
    return this._getPointerId(pointerIndex);
  }

  private _getPointerId(pointerIndex: number): number {
    const pointerCount = this.__getPointerCount();
    MotionEvent.validatePointerCount(pointerCount);
    return this.__getPointerId(pointerIndex);
  }

  private __getPointerId(pointerIndex: number): number {
    return this.mPointerProperties[pointerIndex].id;
  }

  public addBatch(eventTime: number, pointerCoords: PointerCoords[]): void {
    this._addBatch(eventTime, pointerCoords);
  }

  private _addBatch(eventTime: number, pointerCoords: PointerCoords[]): void {
    const pointerCount = this.__getPointerCount();
    MotionEvent.validatePointerCoordsObjArray(pointerCoords, pointerCount);
    pointerCoords.forEach((pc) => MotionEvent.checkNotNull(pc));
    this.__addSample(eventTime, pointerCoords);
  }

  private static validatePointerIndex(
    pointerIndex: number,
    pointerCount: number,
  ): void {
    MotionEvent.checkState(
      pointerIndex >= 0 && pointerIndex < pointerCount,
      'pointerIndex out of range',
    );
  }

  private static validateHistoryPos(
    historyPos: number,
    historySize: number,
  ): void {
    MotionEvent.checkState(
      historyPos >= 0 && historyPos < historySize,
      'historyPos out of range',
    );
  }

  private static validatePointerCount(pointerCount: number): void {
    MotionEvent.checkState(
      pointerCount >= 1,
      'pointerCount must be at least 1',
    );
  }

  private static validatePointerPropertiesArray(
    pointerPropertiesObjArray: PointerProperties[],
    pointerCount: number,
  ): void {
    MotionEvent.checkNotNull(
      pointerPropertiesObjArray,
      'pointerProperties array must not be null',
    );
    MotionEvent.checkState(
      pointerPropertiesObjArray.length >= pointerCount,
      'pointerProperties array must be large enough to hold all pointers',
    );
  }

  private static validatePointerCoordsObjArray(
    pointerCoordsObjArray: PointerCoords[],
    pointerCount: number,
  ): void {
    MotionEvent.checkNotNull(
      pointerCoordsObjArray,
      'pointerCoords array must not be null',
    );
    MotionEvent.checkState(
      pointerCoordsObjArray.length >= pointerCount,
      'pointerCoords array must be large enough to hold all pointers',
    );
  }

  private static checkState(condition: boolean, message: string): void {
    if (!condition) {
      throw new Error(message);
    }
  }

  private static checkNotNull(
    objOrArray:
      | PointerProperties
      | PointerProperties[]
      | PointerCoords
      | PointerCoords[],
    message = 'Error: null object',
  ): void {
    if (Array.isArray(objOrArray)) {
      if (!objOrArray.length) {
        throw new Error(message);
      }
    } else if (!objOrArray || !Object.keys(objOrArray).length) {
      throw new Error(message);
    }
  }
}

function bitCount32(u: number): number {
  // https://blogs.msdn.microsoft.com/jeuge/2005/06/08/bit-fiddling-3/
  const uCount = u - ((u >> 1) & 0o33333333333) - ((u >> 2) & 0o11111111111);
  return ((uCount + (uCount >> 3)) & 0o30707070707) % 63;
}

function bitCount(n: number): number {
  let bits = 0;
  while (n !== 0) {
    bits += bitCount32(n | 0);
    n /= 0x100000000;
  }
  return bits;
}

/**
 * Transfer object for pointer coordinates.
 *
 * Objects of this type can be used to specify the pointer coordinates when
 * creating new {@link MotionEvent} objects and to query pointer coordinates
 * in bulk.
 *
 * Refer to {@link InputDevice} for information about how different kinds of
 * input devices and sources represent pointer coordinates.
 */
// export class PointerCoordsOld {
//   // private static MAX_AXES = 30;

//   private static INITIAL_PACKED_AXIS_VALUES = 8;
//   // @UnsupportedAppUsage
//   private mPackedAxisBits: number;
//   // @UnsupportedAppUsage
//   private mPackedAxisValues: number[];

//   public x: number;
//   public y: number;
//   public pressure: number;
//   public size: number;
//   public touchMajor: number;
//   public touchMinor: number;
//   public toolMajor: number;
//   public toolMinor: number;
//   public orientation: number;

//   /**
//    * Creates a pointer coords object with all axes initialized to zero.
//    */
//   constructor();
//   constructor(other: PointerCoords);
//   constructor(other?: PointerCoords) {
//     if (other) {
//       this.copyFrom(other);
//     }
//   }

//   // @UnsupportedAppUsage
//   public static createArray(size: number): PointerCoords[] {
//     const array: PointerCoords[] = new Array<PointerCoords>(size);
//     for (let i = 0; i < size; i++) {
//       array[i] = new PointerCoords();
//     }
//     return array;
//   }

//   public clear(): void {
//     this.mPackedAxisBits = 0;

//     this.x = 0;
//     this.y = 0;
//     this.pressure = 0;
//     this.size = 0;
//     this.touchMajor = 0;
//     this.touchMinor = 0;
//     this.toolMajor = 0;
//     this.toolMinor = 0;
//     this.orientation = 0;
//   }

//   public copyFrom(other: PointerCoords): void {
//     const bits: number = other.mPackedAxisBits;
//     this.mPackedAxisBits = bits;
//     if (bits != 0) {
//       const otherValues: number[] = other.mPackedAxisValues;
//       // const count: number = Long.bitCount(bits);
//       const count: number = bitCount(bits);
//       let values: number[] = this.mPackedAxisValues;
//       if (values == null || count > values.length) {
//         values = Array(otherValues.length);
//         this.mPackedAxisValues = values;
//       }
//       // System.arraycopy(otherValues, 0, values, 0, count);
//       for (let i = 0; i < count; i++) {
//         values[i] = otherValues[i];
//       }
//     }

//     this.x = other.x;
//     this.y = other.y;
//     this.pressure = other.pressure;
//     this.size = other.size;
//     this.touchMajor = other.touchMajor;
//     this.touchMinor = other.touchMinor;
//     this.toolMajor = other.toolMajor;
//     this.toolMinor = other.toolMinor;
//     this.orientation = other.orientation;
//   }

//   /**
//    * Gets the value associated with the specified axis.
//    *
//    * @param axis The axis identifier for the axis value to retrieve.
//    * @return The value associated with the axis, or 0 if none.
//    *
//    * @see MotionEvent#AXIS_X
//    * @see MotionEvent#AXIS_Y
//    */
//   public getAxisValue(axis: number): number {
//     switch (axis) {
//       case MotionEvent.AXIS_X:
//         return this.x;
//       case MotionEvent.AXIS_Y:
//         return this.y;
//       case MotionEvent.AXIS_PRESSURE:
//         return this.pressure;
//       case MotionEvent.AXIS_SIZE:
//         return this.size;
//       case MotionEvent.AXIS_TOUCH_MAJOR:
//         return this.touchMajor;
//       case MotionEvent.AXIS_TOUCH_MINOR:
//         return this.touchMinor;
//       case MotionEvent.AXIS_TOOL_MAJOR:
//         return this.toolMajor;
//       case MotionEvent.AXIS_TOOL_MINOR:
//         return this.toolMinor;
//       case MotionEvent.AXIS_ORIENTATION:
//         return this.orientation;
//       default: {
//         if (axis < 0 || axis > 63) {
//           throw new RangeError('Axis out of range: ' + axis);
//         }
//         const bits: number = this.mPackedAxisBits;
//         const axisBit: number = 0x8000000000000000 >>> axis;
//         if ((bits & axisBit) == 0) {
//           return 0;
//         }
//         const index: number = bitCount(bits & ~(0xffffffffffffffff >>> axis));
//         return this.mPackedAxisValues[index];
//       }
//     }
//   }

//   public setAxisValue(axis: number, value: number): void {
//     switch (axis) {
//       case MotionEvent.AXIS_X:
//         this.x = value;
//         break;
//       case MotionEvent.AXIS_Y:
//         this.y = value;
//         break;
//       case MotionEvent.AXIS_PRESSURE:
//         this.pressure = value;
//         break;
//       case MotionEvent.AXIS_SIZE:
//         this.size = value;
//         break;
//       case MotionEvent.AXIS_TOUCH_MAJOR:
//         this.touchMajor = value;
//         break;
//       case MotionEvent.AXIS_TOUCH_MINOR:
//         this.touchMinor = value;
//         break;
//       case MotionEvent.AXIS_TOOL_MAJOR:
//         this.toolMajor = value;
//         break;
//       case MotionEvent.AXIS_TOOL_MINOR:
//         this.toolMinor = value;
//         break;
//       case MotionEvent.AXIS_ORIENTATION:
//         this.orientation = value;
//         break;
//       default: {
//         if (axis < 0 || axis > 63) {
//           throw new RangeError('Axis out of range: ' + axis);
//         }
//         const bits: number = this.mPackedAxisBits;
//         const axisBit: number = 0x8000000000000000 >>> axis;
//         const index: number = bitCount(bits & ~(0xffffffffffffffff >>> axis));
//         let values: number[] = this.mPackedAxisValues;
//         if ((bits & axisBit) == 0) {
//           if (values == null) {
//             values = new Array(PointerCoords.INITIAL_PACKED_AXIS_VALUES);
//             this.mPackedAxisValues = values;
//           } else {
//             const count: number = bitCount(bits);
//             if (count < values.length) {
//               if (index != count) {
//                 // System.arraycopy(values, index, values, index + 1,
//                 //         count - index);
//                 for (let i = index; i < count - index; i++) {
//                   values[i + 1] = values[i];
//                 }
//               }
//             } else {
//               const newValues: number[] = new Array(count * 2);
//               // System.arraycopy(values, 0, newValues, 0, index);
//               for (let i = index; i < values.length; i++) {
//                 newValues[i] = values[i];
//               }
//               // System.arraycopy(values, index, newValues, index + 1,
//               //         count - index);
//               for (let i = index; i < count - index; i++) {
//                 newValues[i + 1] = values[i];
//               }
//               values = newValues;
//               this.mPackedAxisValues = values;
//             }
//           }
//           this.mPackedAxisBits = bits | axisBit;
//         }
//         values[index] = value;
//       }
//     }
//   }
// }

/**
 * Transfer object for pointer properties.
 *
 * Objects of this type can be used to specify the pointer id and tool type
 * when creating new {@link MotionEvent} objects and to query pointer properties in bulk.
 */
export class PointerProperties {
  public id: number;
  public toolType: number;

  constructor();
  constructor(other: PointerProperties);
  constructor(other?: PointerProperties) {
    if (other) {
      this.copyFrom(other);
    } else {
      this.clear();
    }
  }

  // @UnsupportedAppUsage
  public static createArray(size: number): PointerProperties[] {
    const array: PointerProperties[] = new Array<PointerProperties>(size);
    for (let i = 0; i < size; i++) {
      array[i] = new PointerProperties();
    }
    return array;
  }

  public clear(): void {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.id = MotionEvent.INVALID_POINTER_ID;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.toolType = MotionEvent.TOOL_TYPE_UNKNOWN;
  }

  public copyFrom(other: PointerProperties): void {
    this.id = other.id;
    this.toolType = other.toolType;
  }

  // @Override
  public equals(other: any): boolean;
  public equals(other: PointerProperties): boolean;
  public equals(other: PointerProperties | any): boolean {
    if (other instanceof PointerProperties) {
      return (
        other != null && this.id == other.id && this.toolType == other.toolType
      );
    }

    return false;
  }

  // @Override
  public hashCode(): number {
    return this.id | (this.toolType << 8);
  }
}

// export class EventBridge {
//   onEvent(): void {
//     // Whatever
//   }
// }

export class NativeBitSet64 {
  private value: number;

  constructor();
  constructor(value: number);
  constructor(other: NativeBitSet64);
  constructor(valueOrOther?: number | NativeBitSet64) {
    if (!this.value) {
      this.value = 0;
    } else if (typeof valueOrOther === 'number') {
      this.value = valueOrOther;
    } else if (valueOrOther instanceof NativeBitSet64) {
      this.value = valueOrOther.value;
    }
  }

  /** Gets the value associated with a particular bit index. */
  static valueForBit(n: number): number {
    // return 0x8000000000000000 >>> n;
    /**
     * @todo:
     * Use BigInt to allow 64bit operations
     */
    return 0x80000000 >>> n;
  }

  /** Clears the bit set. */
  clear(): void {
    this.value = 0;
  }

  /** Returns the number of marked bits in the set. */
  count(): number {
    let count = 0;
    for (let n = 0; n < 64; n++) {
      if (this.hasBit(n)) {
        count++;
      }
    }
    return count;
  }

  /** Returns true if the bit set does not contain any marked bits. */
  isEmpty(): boolean {
    return this.value === 0;
  }

  /** Returns true if the specified bit is marked. */
  hasBit(n: number): boolean {
    return (this.value & NativeBitSet64.valueForBit(n)) !== 0;
  }

  /** Marks the specified bit. */
  markBit(n: number): void {
    this.value |= NativeBitSet64.valueForBit(n);
  }

  /** Clears the specified bit. */
  clearBit(n: number): void {
    this.value &= ~NativeBitSet64.valueForBit(n);
  }

  /** Finds the first marked bit in the set. Result is undefined if all bits are unmarked. */
  firstMarkedBit(): number {
    for (let n = 0; n < 64; n++) {
      if (this.hasBit(n)) {
        return n;
      }
    }
    return 0;
  }

  /**
   * Finds the first marked bit in the set and clears it. Returns the bit index. Result is undefined
   * if all bits are unmarked.
   */
  clearFirstMarkedBit(): number {
    const n = this.firstMarkedBit();
    this.clearBit(n);
    return n;
  }

  /**
   * Gets the index of the specified bit in the set, which is the number of marked bits that appear
   * before the specified bit.
   */
  getIndexOfBit(n: number): number {
    // return __builtin_popcountll(value & ~(0xffffffffffffffffULL >> n));
    let numMarkedBits = 0;
    for (let i = 0; i < n; i++) {
      if (this.hasBit(i)) {
        numMarkedBits++;
      }
    }
    return numMarkedBits;
  }

  public setValue(l: number): void {
    this.value = l;
  }

  public getValue(): number {
    return this.value;
  }
}

export class PointerCoords {
  private static MAX_AXES = 30;
  private bits: NativeBitSet64 = new NativeBitSet64();

  getBits(): NativeBitSet64 {
    return this.bits;
  }

  private values: number[] = new Array(PointerCoords.MAX_AXES);

  public clear(): void {
    this.bits.clear();
  }

  public isEmpty(): boolean {
    return this.bits.isEmpty();
  }

  public getAxisValue(axis: number): number {
    if (axis < 0 || axis > 63 || !this.bits.hasBit(axis)) {
      return 0;
    }

    return this.values[this.bits.getIndexOfBit(axis)];
  }

  public setAxisValue(axis: number, value: number): boolean {
    if (axis < 0 || axis > 63) {
      console.error('Axis out of range');
      return false;
    }

    const index = this.bits.getIndexOfBit(axis);

    if (!this.bits.hasBit(axis)) {
      if (value == 0) {
        return true; // axes with value 0 do not need to be stored
      }

      const count = this.bits.count();
      if (count >= PointerCoords.MAX_AXES) {
        PointerCoords.tooManyAxes(axis);
        return false;
      }

      this.bits.markBit(axis);
      for (let i = count; i > index; i--) {
        this.values[i] = this.values[i - 1];
      }
    }

    this.values[index] = value;
    return true;
  }

  static scaleAxisValue(
    c: PointerCoords,
    axis: number,
    scaleFactor: number,
  ): void {
    const value = c.getAxisValue(axis);
    if (value != 0) {
      c.setAxisValue(axis, value * scaleFactor);
    }
  }

  public scale(scaleFactor: number): void {
    // No need to scale pressure or size since they are normalized.
    // No need to scale orientation since it is meaningless to do so.
    PointerCoords.scaleAxisValue(this, MotionEvent.AXIS_X, scaleFactor);
    PointerCoords.scaleAxisValue(this, MotionEvent.AXIS_Y, scaleFactor);
    PointerCoords.scaleAxisValue(
      this,
      MotionEvent.AXIS_TOUCH_MAJOR,
      scaleFactor,
    );
    PointerCoords.scaleAxisValue(
      this,
      MotionEvent.AXIS_TOUCH_MINOR,
      scaleFactor,
    );
    PointerCoords.scaleAxisValue(
      this,
      MotionEvent.AXIS_TOOL_MAJOR,
      scaleFactor,
    );
    PointerCoords.scaleAxisValue(
      this,
      MotionEvent.AXIS_TOOL_MINOR,
      scaleFactor,
    );
  }

  public applyOffset(xOffset: number, yOffset: number): void {
    this.setAxisValue(MotionEvent.AXIS_X, this.getX() + xOffset);
    this.setAxisValue(MotionEvent.AXIS_Y, this.getY() + yOffset);
  }

  public getX(): number {
    return this.getAxisValue(MotionEvent.AXIS_X);
  }

  public getY(): number {
    return this.getAxisValue(MotionEvent.AXIS_Y);
  }

  public readFromParcel(parcel: number[]): boolean {
    // this.bits.setValue(parcel[0]);
    this.bits.setValue(parcel.shift());
    const count: number = this.bits.count();
    if (count > PointerCoords.MAX_AXES) {
      return false;
    }
    for (let i = 0; i < count; i++) {
      // this.values[i] = parcel[i + 1];
      this.values[i] = parcel.shift();
    }
    return true;
  }

  public writeToParcel(parcel: number[]): boolean {
    parcel.push(this.bits.getValue());
    const count: number = this.bits.count();
    for (let i = 0; i < count; i++) {
      parcel.push(this.values[i]);
    }
    return true;
  }

  public copyFrom(other: PointerCoords): void {
    this.bits = new NativeBitSet64(other.bits);
    const count = this.bits.count();
    for (let i = 0; i < count; i++) {
      this.values[i] = other.values[i];
    }
  }

  private static tooManyAxes(axis: number): void {
    // native code just logs this as warning. Be a bit more defensive for now and throw
    throw new RangeError(
      `Could not set value for axis ${axis} because the PointerCoords structure is full and cannot contain more than ${this.MAX_AXES} axis values.`,
    );
  }
}
