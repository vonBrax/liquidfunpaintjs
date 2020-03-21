const state = new Map();
const canvasId = 'canvas';

const canvas: HTMLCanvasElement = document.getElementById(
  canvasId,
) as HTMLCanvasElement;
const gl = canvas.getContext('webgl');
state.set('context', gl);

export { state };
