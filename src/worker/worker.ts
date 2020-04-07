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

// const activity = new MainActivity(Module.canvas);
// activity.onCreate();

// MainActivity ready
postMessage({ target: 'custom', userData: { type: 'ready' } });

const activity = new MainActivity(Module.canvas);
activity.onCreate();

Module.onCustomMessage = async function (e: MessageEvent): Promise<void> {
  // if (e.data.userData.type === 'event') {
  //   activity.onEvent(e.data.userData.name, e.data.userData.data);
  // }
  const payload = e.data.userData;
  activity.onEvent(payload);
  // switch (payload.type) {
  //   case 'set-gravity':
  //     Renderer.getInstance()
  //       .acquireWorld()
  //       .SetGravity(new Module.Vec2(payload.x, payload.y));
  //     break;
  //   case 'surface-changed':
  //     Renderer.getInstance().onSurfaceChanged(
  //       state.get('context'),
  //       payload.width,
  //       payload.height,
  //     );
  //     break;
  //   case 'set-pixel-ratio':
  //     activity.setPixelRatio(payload.value);
  //     break;
  //   // case 'init-renderer':
  //   //   Renderer.getInstance().init();
  //   //   await Renderer.getInstance().onSurfaceCreated();
  //   //   Renderer.getInstance().onSurfaceChanged(
  //   //     state.get('context'),
  //   //     payload.width,
  //   //     payload.height,
  //   //   );
  //   //   Renderer.getInstance().startSimulation();
  //   //   Renderer.getInstance().onDrawFrame();
  //   //   break;
  //   case 'start-simulation':
  //     Renderer.getInstance().startSimulation();
  //     break;
  //   case 'pause-simulation':
  //     Renderer.getInstance().pauseSimulation();
  //     break;
  //   case 'reset-simulation':
  //     Renderer.getInstance().reset();
  //     break;
  //   case 'set-stats':
  //     state.set('stats', payload.value);
  //     break;
  //   case 'set-debug':
  //     Renderer.DEBUG_DRAW = payload.value;
  //     break;
  //   case 'set-blur':
  //     state.set('blur', payload.value);
  //     break;
  //   default:
  //     console.log(payload);
  //     throw new Error('Invalid message type');
  // }
};
