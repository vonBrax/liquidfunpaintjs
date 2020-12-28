import { RenderSurface } from './render-surface';
import { Material, ShaderProgram, Texture } from './shader';
import { RenderHelper } from './util/render-helper';
import { state } from './state';

/**
 * BlurRenderer.
 * This is the blur renderer. It takes an input texture, and uses a blur
 * shader to blur it into an output RenderSurface.
 * Blur shader is hard-coded to use gaussian blur, with a sigma or 2.3 and a
 * kernel size of 5.
 */
export class BlurRenderer {
  static TAG = 'BlurRenderer';
  static BLUR_TEXTURE_NAME = 'uBlurTexture';
  // Small intermediate framebuffer since we do want the image to lose a bit
  // of detail and this allows the fragment shader computation to go way
  // faster.
  static FB_SIZE = 128;

  private mBlurSurface: RenderSurface;

  private mXBlurMaterial: Material;
  private mYBlurMaterial: Material;

  constructor(private mModule: EmscriptenModule) {
    this.mXBlurMaterial = new Material(
      new ShaderProgram('x_blur.glslv', 'blur.glslf'),
    );
    this.mYBlurMaterial = new Material(
      new ShaderProgram('y_blur.glslv', 'blur.glslf'),
    );

    this.mXBlurMaterial.addAttribute(
      'aPosition',
      3,
      Material.AttrComponentType.FLOAT(),
      4,
      false,
      RenderHelper.SCREEN_QUAD_VERTEX_STRIDE,
    );

    this.mXBlurMaterial.addAttribute(
      'aTexCoord',
      2,
      Material.AttrComponentType.FLOAT(),
      4,
      false,
      RenderHelper.SCREEN_QUAD_VERTEX_STRIDE,
    );

    this.mYBlurMaterial.addAttribute(
      'aPosition',
      3,
      Material.AttrComponentType.FLOAT(),
      4,
      false,
      RenderHelper.SCREEN_QUAD_VERTEX_STRIDE,
    );

    this.mYBlurMaterial.addAttribute(
      'aTexCoord',
      2,
      Material.AttrComponentType.FLOAT(),
      4,
      false,
      RenderHelper.SCREEN_QUAD_VERTEX_STRIDE,
    );

    this.mBlurSurface = new RenderSurface(
      BlurRenderer.FB_SIZE,
      BlurRenderer.FB_SIZE,
    );
  }

  /**
   * Draw function for the geometry that this class owns.
   */
  public draw(inputTexture: Texture, outputSurface: RenderSurface): void {
    // X-blur: Blur into a temporary surface
    this.mBlurSurface.beginRender(0);
    this.mXBlurMaterial.beginRender();

    // Set the attribute arrays
    this.mXBlurMaterial.setVertexAttributeBuffer(
      'aPosition',
      RenderHelper.SCREEN_QUAD_VERTEX_BUFFER(this.mModule).glBuffer,
      0 * 4,
    );
    this.mXBlurMaterial.setVertexAttributeBuffer(
      'aTexCoord',
      RenderHelper.SCREEN_QUAD_VERTEX_BUFFER(this.mModule).glBuffer,
      3 * 4,
    );

    // Set the input texture
    const gl: WebGLRenderingContext = state.get(
      'context',
    ) as WebGLRenderingContext;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, inputTexture.getTextureId());

    // Set the correct uniforms
    gl.uniform1i(
      this.mXBlurMaterial.getUniformLocation(BlurRenderer.BLUR_TEXTURE_NAME),
      0,
    );
    gl.uniform1f(
      this.mXBlurMaterial.getUniformLocation('uBlurBufferSize'),
      1.0 / BlurRenderer.FB_SIZE,
    );

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    this.mXBlurMaterial.endRender();
    this.mBlurSurface.endRender();

    // Issue a flush call to make sure previous frame buffer commands are
    // send asap, as we are using it in the next render call.
    gl.flush();

    // Y-blur: blur into specified output surface
    outputSurface.beginRender(0);
    this.mYBlurMaterial.beginRender();

    // Set attribute arrays
    this.mYBlurMaterial.setVertexAttributeBuffer(
      'aPosition',
      RenderHelper.SCREEN_QUAD_VERTEX_BUFFER(this.mModule).glBuffer,
      0 * 4,
    );
    this.mYBlurMaterial.setVertexAttributeBuffer(
      'aTexCoord',
      RenderHelper.SCREEN_QUAD_VERTEX_BUFFER(this.mModule).glBuffer,
      3 * 4,
    );

    // Set texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(
      gl.TEXTURE_2D,
      this.mBlurSurface.getTexture().getTextureId(),
    );

    // Set the correct uniform
    gl.uniform1i(
      this.mYBlurMaterial.getUniformLocation(BlurRenderer.BLUR_TEXTURE_NAME),
      0,
    );
    gl.uniform1f(
      this.mYBlurMaterial.getUniformLocation('uBlurBufferSize'),
      1.0 / BlurRenderer.FB_SIZE,
    );

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    this.mYBlurMaterial.endRender();
    outputSurface.endRender();
  }
}
