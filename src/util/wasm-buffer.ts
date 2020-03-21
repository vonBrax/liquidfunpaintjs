import { state } from '../state';

export declare type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;
// | BigInt64Array
// | BigUint64Array;

export enum ArrayViewType {
  INT8,
  UINT8,
  INT16,
  UINT16,
  INT32,
  UINT32,
  FLOAT32,
  FLOAT64,
}

export interface ParticleBuffer {
  bufferData: TypedArray;
  pointer: number;
  buffer?: WebGLBuffer;
}

export function createBuffer(
  numBytes: number,
  addGLBuffer = false,
  type: ArrayViewType,
): ParticleBuffer {
  // const numBytes = num * 4 * Renderer.MAX_PARTICLE_COUNT;
  const dataPtr = Module._malloc(numBytes);

  const gl: WebGLRenderingContext = state.get('context');

  // const bufferData =
  //   type === 'Uint8'
  //     ? new Uint8Array(Module.HEAPU8.buffer, dataPtr, numBytes)
  //     : new Float32Array(Module.HEAPU8.buffer, dataPtr, numBytes);
  let bufferData;

  switch (type) {
    case ArrayViewType.INT8:
      bufferData = new Int8Array(Module.HEAPU8.buffer, dataPtr, numBytes);
      break;
    case ArrayViewType.UINT8:
      bufferData = new Uint8Array(Module.HEAPU8.buffer, dataPtr, numBytes);
      break;
    case ArrayViewType.INT16:
      bufferData = new Int16Array(Module.HEAPU8.buffer, dataPtr, numBytes);
      break;
    case ArrayViewType.UINT16:
      bufferData = new Uint16Array(Module.HEAPU8.buffer, dataPtr, numBytes);
      break;
    case ArrayViewType.INT32:
      bufferData = new Int32Array(Module.HEAPU8.buffer, dataPtr, numBytes);
      break;
    case ArrayViewType.UINT32:
      bufferData = new Uint32Array(Module.HEAPU8.buffer, dataPtr, numBytes);
      break;
    case ArrayViewType.FLOAT32:
      bufferData = new Float32Array(Module.HEAPU8.buffer, dataPtr, numBytes);
      break;
    case ArrayViewType.FLOAT64:
      bufferData = new Float64Array(Module.HEAPU8.buffer, dataPtr, numBytes);
      break;
    default:
      throw new Error('MISSING!');
  }
  const result: ParticleBuffer = {
    pointer: dataPtr,
    bufferData,
    // bufferData,
  };
  if (addGLBuffer) {
    result.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, result.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
  }

  return result;
  // return new Uint8Array(Module.HEAPU8.buffer, dataPtr, numBytes);
}

export function destroyBuffer(ptr: number): void {
  Module._free(ptr);
}
