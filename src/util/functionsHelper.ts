// export const extend = function(child, parent) {
//   Object.setPrototypeOf(child, parent);

//   function __() {
//     this.constructor = child;
//   }

//   if (parent === null) {
//     child.prototype = Object.create(parent);
//   } else {
//     __.prototype = parent.prototype;
//     child.prototype = new __();
//   }
// };

// export function log(name, msg, error) {
//   if (error === true) {
//     return console.log(`%c [${name}] - ${msg}`, 'color:red');
//   } else if (!error) {
//     return console.log(`[${name}] - ${msg}`);
//   }

//   switch (error) {
//     case 'd':
//     case 'debug':
//       console.log(`%c [${name}] - ${msg}`, 'color:green');
//   }
// }

export class Log {
  public static e(tag: string, message: string): void {
    console.log(`%c [${tag}] - ${message}`, 'color: red');
  }
  public static d(tag: string, message: string): void {
    console.log(`%c [${tag}] - ${message}`, 'color: blue');
  }
}

export function getMousePosition(evt: PointerEvent): any {
  let pageX = evt.pageX;
  let pageY = evt.pageY;
  if (pageX === undefined) {
    pageX =
      evt.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
    pageY =
      evt.clientY +
      document.body.scrollTop +
      document.documentElement.scrollTop;
  }

  const rect = (evt.target as HTMLElement).getBoundingClientRect();
  const offsetX = evt.clientX - rect.left;
  const offsetY = evt.clientY - rect.top;

  return {
    client: { x: evt.clientX, y: evt.clientY }, // relative to the viewport
    screen: { x: evt.screenX, y: evt.screenY }, // relative to the physical screen
    offset: { x: offsetX, y: offsetY }, // relative to the event target
    page: { x: pageX, y: pageY }, // relative to the html document
  };
}

interface DebounceOptions {
  leading?: boolean;
  maxWait?: number;
  trailing?: boolean;
  useRAF?: boolean;
}

export function debounce(
  func: () => {},
  wait = 0,
  options?: DebounceOptions,
): any {
  const leading = !!options.leading;
  const maxing = 'maxWait' in options;
  const maxWait = maxing ? Math.max(options.maxWait || 0, wait) : undefined;
  const trailing = 'trailing' in options ? options.trailing : undefined;

  const useRAF =
    options.useRAF && typeof window.requestAnimationFrame === 'function';

  let lastInvokeTime = 0;
  let lastArgs: any;
  let lastThis: any;
  let result: any;
  let timerId: number;
  let lastCallTime: number;

  function invokeFunc(time: number): any {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = null;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function startTimer(pendingFunc: () => {}, wait: number): number {
    if (useRAF) {
      window.cancelAnimationFrame(timerId);
      return window.requestAnimationFrame(pendingFunc);
    }

    return window.setTimeout(pendingFunc, wait);
  }

  function cancelTimer(id: number): void {
    if (useRAF) {
      return window.cancelAnimationFrame(id);
    }
    clearTimeout(id);
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    );
  }

  function trailingEdge(time: number): any {
    timerId = null;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = null;

    return result;
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function timerExpired(): any {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }

    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time));
  }

  function leadingEdge(time: number): any {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the traling edge.
    timerId = startTimer(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function cancel(): void {
    if (timerId !== null) {
      cancelTimer(timerId);
    }

    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = null;
  }

  function flush(): any {
    return timerId === null ? result : trailingEdge(Date.now());
  }

  function pending(): boolean {
    return timerId !== null;
  }

  function debounced(...args: any[]): any {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === null) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timerId === null) {
      timerId = startTimer(timerExpired, wait);
    }

    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced;
}

export function throttle(
  func: any,
  wait?: number,
  options?: DebounceOptions,
): any {
  const leading = options.leading || true;
  const trailing = options.trailing || true;

  return debounce(func, wait, { leading, trailing, maxWait: wait });
}
