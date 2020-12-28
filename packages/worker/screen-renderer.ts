// import { Material } from './shader/material';
// import { Texture } from './shader/texture';
// import { ShaderProgram } from './shader/shader-program';
import { Material, Texture, ShaderProgram } from './shader';
import { JSONObject } from '@lfpjs/common';
import { RenderHelper } from './util/render-helper';
import { state } from './state';
import { mat4 } from 'gl-matrix';

/**
 * ScreenRenderer.
 * Blends a frame buffer as an input onto the final screen.
 */
export class ScreenRenderer {
  private static TAG = 'ScreenRenderer';
  private mMaterial: Material;
  private mAlphaThreshold: number;

  constructor(
    json: JSONObject,
    fboTexture: Texture,
    private mModule: EmscriptenModule,
  ) {
    this.mMaterial = new Material(
      new ShaderProgram('texture.glslv', 'screen.glslf'),
    );

    this.mMaterial.addAttribute(
      'aPosition',
      3,
      Material.AttrComponentType.FLOAT(),
      4,
      false,
      RenderHelper.SCREEN_QUAD_VERTEX_STRIDE,
    );
    this.mMaterial.addAttribute(
      'aTexCoord',
      2,
      Material.AttrComponentType.FLOAT(),
      4,
      false,
      RenderHelper.SCREEN_QUAD_VERTEX_STRIDE,
    );

    // Add the diffuse texture: particle FBO
    this.mMaterial.addTexture('uDiffuseTexture', fboTexture);

    this.mMaterial.setBlendFunc(
      Material.BlendFactor.SRC_ALPHA(),
      Material.BlendFactor.ONE_MINUS_SRC_ALPHA(),
    );

    // Read in values from the JSON file

    // Alpha threshold
    this.mAlphaThreshold = (json.alphaThreshold as number) || 0.0;
  }

  /**
   * Draw function for the geometry that this class owns.
   */
  public draw(transformFromTexture: mat4): void {
    // RenderHelper.SCREEN_QUAD_VERTEX_BUFFER(this.mModule).rewind();

    this.mMaterial.beginRender();

    // Set attribute arrays
    this.mMaterial.setVertexAttributeBuffer(
      'aPosition',
      RenderHelper.SCREEN_QUAD_VERTEX_BUFFER(this.mModule).glBuffer,
      0 * 4, // offset * item size (float32 = 4 bytes)
    );

    this.mMaterial.setVertexAttributeBuffer(
      'aTexCoord',
      RenderHelper.SCREEN_QUAD_VERTEX_BUFFER(this.mModule).glBuffer,
      3 * 4, // offset * item size (float32 = 4 bytes)
    );

    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;

    // Set per draw uniforms
    gl.uniformMatrix4fv(
      this.mMaterial.getUniformLocation('uMvpTransform'),
      false,
      transformFromTexture,
    );
    gl.uniform1f(
      this.mMaterial.getUniformLocation('uAlphaThreshold'),
      this.mAlphaThreshold,
    );

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    this.mMaterial.endRender();
  }
}
