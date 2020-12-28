// Import entrypoint class
// import { MainActivity } from './main-activity';
// import { Renderer } from './renderer';
// import { state } from './state';
// import { MotionEvent } from './motion-event';
// import { Tool, ToolType } from './tool/tool';
// import { Controller } from './controller';
// import { WaterTool } from './tool/water-tool';
// import { RigidTool } from './tool/rigid-tool';
import { MainActivity } from './main-activity';
import {
  MotionEvent,
  PointerCoords,
  PointerProperties,
  ModulePromise,
} from '@lfpjs/common';
import { state } from './state';

console.log('WORKER');

ModulePromise.then((Module: EmscriptenModule) => {
  postMessage({ msg: 'ready' });
  // const activity = new MainActivity(Module.canvas);
  // activity.onCreate();

  // MainActivity ready
  // postMessage({ target: 'custom', userData: { type: 'ready' } });

  let activity: MainActivity;

  self.onmessage = function (e: MessageEvent): void {
    // if (e.data.userData.type === 'event') {
    //   activity.onEvent(e.data.userData.name, e.data.userData.data);
    // }
    const messageType = e.data.msg || e.data.type;

    switch (messageType) {
      case 'ready': {
        postMessage({ msg: 'ready' });
        break;
      }
      case 'start':
        {
          Module.canvas = e.data.canvas;
          Module.canvas.getBoundingClientRect = () => e.data.boundingClientRect;
          state.set(
            'context',
            Module.canvas.getContext('webgl2', { alpha: false }),
          );
          activity = new MainActivity(Module.canvas, Module);
          activity.onCreate();
          Module.postMessage = postMessage;
          activity.onEvent({
            type: 'set-pixel-ratio',
            value: e.data.devicePixelRatio,
          });
        }
        break;

      case 'motionevent': {
        const [
          pointerCount,
          sampleCount,
          action,
          offsetX,
          offsetY,
          ...rest
        ] = e.data.value;
        const MAX_POINTERS = 16;
        const MAX_SAMPLES = 2 ^ 16; // UINT16_MAX
        if (
          pointerCount === 0 ||
          pointerCount > MAX_POINTERS ||
          sampleCount === 0 ||
          sampleCount > MAX_SAMPLES
        ) {
          throw new Error(
            `BAD VALUE - Pointer count: ${pointerCount}, Sample count ${sampleCount}`,
          );
        }
        const mPointerProperties = [];
        for (let i = 0; i < pointerCount; i++) {
          const pp = new PointerProperties();
          pp.id = rest.shift();
          pp.toolType = rest.shift();
          mPointerProperties.push(pp);
        }
        let count = sampleCount;
        const mSampleEventTimes = [];
        let event;
        while (count > 0) {
          count--;
          const timeStamp = rest.shift();
          mSampleEventTimes.push(timeStamp);
          const mPointerCoords = [];
          for (let i = 0; i < pointerCount; i++) {
            const pc = new PointerCoords();
            pc.readFromParcel(rest);
            mPointerCoords.push(pc);
          }
          if (event) {
            event.addBatch(timeStamp, mPointerCoords);
          } else {
            event = MotionEvent.obtain(
              timeStamp,
              action,
              offsetX,
              offsetY,
              pointerCount,
              mPointerProperties,
              mPointerCoords,
              0,
            );
          }
        }
        if (!activity) {
          throw new Error('Activity is undefined');
        }
        activity.onTouch(event);
        break;
      }

      default:
        // console.warn('Unknown message type: ' + messageType);
        if (!activity) {
          throw new Error('Activity is undefined');
        }
        activity.onEvent(e.data);
    }
  };
});
