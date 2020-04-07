const state = new Map();
// const canvasId = 'canvas';
// declare let webGLWorker: any;

// state.set('context', webGLWorker);
state.set('context', Module.canvas.getContext('webgl', { alpha: false }));

// const canvas: HTMLCanvasElement = document.getElementById(
//   canvasId,
// ) as HTMLCanvasElement;
// const gl = canvas.getContext('webgl');
// state.set('context', gl);

export { state };
