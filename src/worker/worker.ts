// Import entrypoint class
import { MainActivity } from '../main-activity';

/**
 * @todo
 * Pass window.devicePixelRatio from client to worker
 * and then to either MainActivity or Renderer
 */

const activity = new MainActivity(Module.canvas as HTMLCanvasElement);
activity.onCreate();

Module.onCustomMessage = function(e: MessageEvent): void {
  if (e.data.userData.type === 'event') {
    activity.onEvent(
      e.data.userData.name,
      e.data.userData.checked,
      e.data.userData.color,
      e.data.userData.data,
    );
  }
};

// MainActivity ready
postMessage({ target: 'custom', userData: { type: 'ready' } });
