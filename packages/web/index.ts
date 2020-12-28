import { Caipps, ModulePromise } from '@lfpjs/common';
import { MotionEventListener } from './event-pipe';
// import { DomEvents } from './dom-events';
// import MyWorker from 'worker-loader!@lfpjs/worker';
import MyWorker from 'worker-loader!@lfpjs/worker/lib/index.js';

declare global {
  interface Window {
    __caipps__: Caipps;
  }
}

const canvas: HTMLCanvasElement = document.getElementById(
  'canvas',
) as HTMLCanvasElement;
const log = document.getElementById('log');
// let listener: MotionEventListener;

function registerListeners(worker: Worker): void {
  // pipeCanvasEvents(
  //   ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'],
  //   // (ev: Event) => activity.onEvent(ev.type, ev),
  // );

  const play = document.getElementById('play');
  if (play) {
    play.addEventListener('click', () => {
      worker.postMessage({ type: 'start-simulation' });
    });
  }

  const pause = document.getElementById('pause');
  if (pause) {
    pause.addEventListener('click', () => {
      worker.postMessage({ type: 'pause-simulation' });
    });
  }

  const reset = document.getElementById('reset');
  if (reset) {
    reset.addEventListener('click', () => {
      worker.postMessage({ type: 'reset-simulation' });
    });
  }

  const info = document.getElementById('info');
  if (info) {
    info.addEventListener('change', (evt) => {
      const target = evt.target as HTMLInputElement;
      if (target.value === 'stats' && !target.checked && log) {
        log.textContent = '';
      }
      worker.postMessage({
        type: 'set-' + target.value,
        value: target.checked,
      });
    });
  }

  const tools = document.getElementById('tools');
  if (tools) {
    tools.addEventListener('change', (evt) => {
      const target = evt.target as HTMLInputElement;
      worker.postMessage({
        type: 'set-tool',
        value: target.value.toUpperCase(),
      });
    });
  }

  const colors = document.getElementById('colors');
  if (colors) {
    colors.addEventListener('change', (evt) => {
      const target = evt.target as HTMLInputElement;
      worker.postMessage({
        type: 'set-color',
        value: parseInt(target.value, 16),
      });
    });
  }

  /**
   * @todo
   * Throttle resize listener
   */
  window.addEventListener('resize', () => {
    const width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
    const height = Math.floor(canvas.height * window.devicePixelRatio);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    worker.postMessage({
      type: 'resize',
      width,
      height,
    });
  });
}

// function sleep(time: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, time));
// }

// async function startAnimation(): Promise<void> {
//   const pointer1 = new DomEvents.Pointer('touch', canvas);
//   const pointer2 = new DomEvents.Pointer('touch', canvas);

//   listener.simulate(
//     pointer1.touchstart({
//       clientX: 10,
//       clientY: 10,
//     }),
//   );

//   const width = canvas.clientWidth;
//   listener.simulate(
//     pointer2.touchstart({
//       clientX: width - 10,
//       clientY: 10,
//     }),
//   );

//   const MAX = 300;
//   for (let i = 0; i < MAX; i++) {
//     listener.simulate(
//       pointer1.touchmove({
//         clientX: 10,
//         clientY: 10 + i * 2,
//       }),
//     );

//     await sleep(10);

//     listener.simulate(
//       pointer2.touchmove({
//         clientX: width - 10,
//         clientY: 10 + i * 2,
//       }),
//     );
//     await sleep(10);
//   }

//   listener.simulate(
//     pointer2.touchend({
//       clientX: width - 10,
//       clientY: MAX + 10,
//     }),
//   );

//   sleep(10);

//   listener.simulate(
//     pointer1.touchend({
//       clientX: 10,
//       clientY: MAX + 10,
//     }),
//   );
// }

ModulePromise.then((Module: EmscriptenModule): void => {
  // const filename = 'worker.js';
  Module.canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const offscreen = Module.canvas.transferControlToOffscreen();

  if (Module.customMessageQueue.length) {
    throw new Error(
      'Found custom message queue (' +
        Module.customMessageQueue.length +
        '). Use of custom message is deprecated.',
    );
  }

  // return [Module, offscreen];
  // const worker = new Worker(filename);
  const worker = new MyWorker();
  // listener = new MotionEventListener(canvas, worker);
  new MotionEventListener(canvas, worker);

  worker.onmessage = function (e: MessageEvent): void {
    const messageType = e.data.msg || e.data.type;
    switch (messageType) {
      case 'ready': {
        worker.postMessage(
          {
            msg: 'start',
            canvas: offscreen,
            width: Module.canvas.width,
            height: Module.canvas.height,
            boundingClientRect: Module.canvas.getBoundingClientRect(),
            devicePixelRatio: window.devicePixelRatio,
          },
          [offscreen],
        );
        registerListeners(worker);
        // setTimeout(startAnimation, 5000);
        break;
      }
      case 'log': {
        if (log) {
          log.textContent = e.data.value;
        }
      }
    }
  };

  if (Module.customMessageQueue) {
    while (Module.customMessageQueue.length) {
      const event = Module.customMessageQueue.shift();
      if (event) {
        // Module.onCustomMessage(event);
        worker.onmessage(event);
      }
    }
  }
});
