import { Caipps } from './util/types';

declare global {
  interface Window {
    __caipps__: Caipps;
  }
}

const canvas: HTMLCanvasElement = document.getElementById(
  'canvas',
) as HTMLCanvasElement;

function registerListeners(): void {
  document.getElementById('play').addEventListener('click', () => {
    postCustomMessage({ type: 'event', name: 'play' });
  });
  document.getElementById('pause').addEventListener('click', () => {
    postCustomMessage({ type: 'event', name: 'pause' });
  });
  document.getElementById('reset').addEventListener('click', () => {
    postCustomMessage({ type: 'event', name: 'reset' });
  });
  document.getElementById('info').addEventListener('change', evt => {
    const target = evt.target as HTMLInputElement;
    if (target.value === 'stats' && !target.checked) {
      document.getElementById('log').textContent = '';
    }
    postCustomMessage({
      type: 'event',
      name: target.value,
      checked: target.checked,
    });
  });

  document.getElementById('tools').addEventListener('change', evt => {
    const target = evt.target as HTMLInputElement;
    postCustomMessage({
      type: 'event',
      name: target.value.toUpperCase(),
    });
  });

  document.getElementById('colors').addEventListener('change', evt => {
    const target = evt.target as HTMLInputElement;
    const checked: HTMLInputElement = document
      .getElementById('tools')
      .querySelector(':checked');
    postCustomMessage({
      type: 'event',
      name: checked.value.toUpperCase(),
      color: parseInt(target.value, 16),
    });
  });

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
      type: 'event',
      name: 'resize',
      data: { width, height, pixelRatio: window.devicePixelRatio },
    });
  });
}

Module.onCustomMessage = function(event: MessageEvent): void {
  if (event.data.userData.type === 'ready') {
    registerListeners();
  } else if (event.data.userData.type === 'log') {
    document.getElementById('log').textContent = event.data.userData.value;
  }
};
if (Module.customMessageQueue) {
  while (Module.customMessageQueue.length) {
    const event = Module.customMessageQueue.shift();
    Module.onCustomMessage(event);
  }
}
