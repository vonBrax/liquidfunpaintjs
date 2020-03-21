import { state } from '../state';

function createBuffer(data: number[]): WebGLBuffer {
  const gl: WebGL2RenderingContext = state.get(
    'context',
  ) as WebGL2RenderingContext;
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
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

  // public static SCREEN_QUAD_VERTEX_BUFFER(): WebGLBuffer {
  //   return createBuffer(RenderHelper.SCREEN_QUAD_VERTEX_DATA);
  // }
  public static SCREEN_QUAD_VERTEX_BUFFER: WebGLBuffer = createBuffer(
    RenderHelper.SCREEN_QUAD_VERTEX_DATA,
  );
}
