import { state } from '../state';
import { ByteBuffer } from './byte-buffer';

function createByteBuffer(size: number, data?: number[]): ByteBuffer {
  const buffer = new ByteBuffer(size);
  buffer.nativeOrder();
  buffer.createGLBuffer();
  if (data) {
    const gl = state.get('context') as WebGLRenderingContext;
    const typedArray = new Float32Array(data);
    buffer.put(typedArray);
    buffer.position(0);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.glBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, typedArray, gl.STATIC_DRAW);
  }

  return buffer;
}

/**
 * RenderHelper
 * Data and functions to help with rendering.
 */
export class RenderHelper {
  // Vertex data
  // prettier-ignore
  public static SCREEN_QUAD_VERTEX_DATA = [
    -1.0, -1.0, 0.0, // Position 0
    0.0, 0.0, // TexCoord 0
    -1.0, 1.0, 0.0, // Position 1
    0.0, 1.0, // TexCoord 1
    1.0, 1.0, 0.0, // Position 2
    1.0, 1.0, // TexCoord 2
    1.0, -1.0, 0.0, // Position 3
    1.0, 0.0, // TexCoord 3
  ];
  public static SCREEN_QUAD_NUM_VERTICES = 4;

  // We get the size of the vertex data in floats, and multiply with
  // sizeof(float) which is 4 bytes.
  public static SCREEN_QUAD_VERTEX_STRIDE =
    (RenderHelper.SCREEN_QUAD_VERTEX_DATA.length /
      RenderHelper.SCREEN_QUAD_NUM_VERTICES) *
    4;

  public static SCREEN_QUAD_VERTEX_BUFFER: ByteBuffer = createByteBuffer(
    RenderHelper.SCREEN_QUAD_VERTEX_DATA.length * 4,
    RenderHelper.SCREEN_QUAD_VERTEX_DATA,
  );
}
