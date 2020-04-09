import { Caipps } from '../common/types';
// import { MainActivity } from '../worker/main-activity';
// import { MotionEvent } from './motion-event';
// import { Controller } from './controller';

// declare let postCustomMessage: (config: any) => {};

// declare function cloneObject(event: any): any;
declare function postCustomMessage(data: any): void;
declare function pipeCanvasEvents(events: string[], callback?: any): void;

declare global {
  interface Window {
    __caipps__: Caipps;
  }
}

const canvas: HTMLCanvasElement = document.getElementById(
  'canvas',
) as HTMLCanvasElement;
const log = document.getElementById('log');

function registerListeners(): void {
  pipeCanvasEvents(
    ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'],
    // (ev: Event) => activity.onEvent(ev.type, ev),
  );

  const play = document.getElementById('play');
  if (play) {
    play.addEventListener('click', () => {
      postCustomMessage({ type: 'start-simulation' });
    });
  }

  const pause = document.getElementById('pause');
  if (pause) {
    pause.addEventListener('click', () => {
      postCustomMessage({ type: 'pause-simulation' });
    });
  }

  const reset = document.getElementById('reset');
  if (reset) {
    reset.addEventListener('click', () => {
      postCustomMessage({ type: 'reset-simulation' });
    });
  }

  const info = document.getElementById('info');
  if (info) {
    info.addEventListener('change', (evt) => {
      const target = evt.target as HTMLInputElement;
      if (target.value === 'stats' && !target.checked && log) {
        log.textContent = '';
      }
      postCustomMessage({ type: 'set-' + target.value, value: target.checked });
    });
  }

  const tools = document.getElementById('tools');
  if (tools) {
    tools.addEventListener('change', (evt) => {
      const target = evt.target as HTMLInputElement;
      postCustomMessage({
        type: 'set-tool',
        value: target.value.toUpperCase(),
      });
    });
  }

  const colors = document.getElementById('colors');
  if (colors) {
    colors.addEventListener('change', (evt) => {
      const target = evt.target as HTMLInputElement;
      postCustomMessage({
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
    postCustomMessage({
      type: 'resize',
      width,
      height,
    });
  });
}

Module.onCustomMessage = function (event: MessageEvent): void {
  if (event.data.userData.type === 'ready') {
    // const activity = new MainActivity(canvas);
    // activity.onCreate();

    postCustomMessage({
      type: 'set-pixel-ratio',
      value: window.devicePixelRatio,
    });
    registerListeners();
  } else if (event.data.userData.type === 'log' && log) {
    log.textContent = event.data.userData.value;
  }
};

if (Module.customMessageQueue) {
  while (Module.customMessageQueue.length) {
    const event = Module.customMessageQueue.shift();
    if (event) {
      Module.onCustomMessage(event);
    }
  }
}
