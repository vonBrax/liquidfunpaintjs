import { mat4, vec3 } from 'gl-matrix';
import { Material } from './shader/material';
import { ShaderProgram } from './shader/shader-program';
import { Texture } from './shader/texture';
import { Renderer } from './renderer';
import { state } from './state';
import { ByteBuffer } from './util/byte-buffer';

/**
 * Renderer to draw textures.
 */
export class TextureRenderer {
  private mTextureShader: ShaderProgram;
  private mTextureMaterial: Material;

  // Temporary variables for drawing purposes
  private uvTransform: mat4 = mat4.create();

  private mPositionBuffer: ByteBuffer;
  private mTexCoordBuffer: ByteBuffer;

  private static INSTANCE: TextureRenderer = new TextureRenderer();

  constructor() {
    this.mPositionBuffer = new ByteBuffer(8 * 4);
    this.mPositionBuffer.nativeOrder();
    this.mPositionBuffer.createGLBuffer();

    const data = [0, 0, 1, 0, 0, 1, 1, 1];
    this.mTexCoordBuffer = new ByteBuffer(8 * 4);
    this.mTexCoordBuffer.nativeOrder();
    this.mTexCoordBuffer.createGLBuffer();
    this.mTexCoordBuffer.put(new Float32Array(data));

    // Buffer data once for the texCoordBuffer
    const gl = state.get('context') as WebGLRenderingContext;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer.glBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.mTexCoordBuffer.getRawBuffer()),
      gl.STATIC_DRAW,
    );
  }

  /**
   * @return The singleton.
   */
  public static getInstance(): TextureRenderer {
    return this.INSTANCE;
  }

  /**
   * Inform the renderer that the surface is created or recreated.
   */
  public onSurfaceCreated(): void {
    this.mTextureShader = new ShaderProgram('texture.glslv', 'texture.glslf');

    this.mTextureMaterial = new Material(this.mTextureShader);
    this.mTextureMaterial.addAttribute(
      'aPosition',
      2,
      Material.AttrComponentType.FLOAT(),
      4,
      false,
      0,
    );
    this.mTextureMaterial.addAttribute(
      'aTexCoord',
      2,
      Material.AttrComponentType.FLOAT(),
      4,
      false,
      0,
    );
    this.mTextureMaterial.setBlendFunc(
      Material.BlendFactor.ONE(),
      Material.BlendFactor.ONE_MINUS_SRC_ALPHA(),
    );
  }

  /**
   * Draw a texture within a rectangle, with default params.
   *
   * @param texture A texture to draw
   * @param transform Matrix to transform to screen coordinates
   * @param left Left coordinate of a rectangle to draw the texture within
   * @param bottom Bottom coordinate of a rectangle to draw the texture within
   * @param right Right coordinate of a rectangle to draw the texture within
   * @param top Top coordinate of a rectangle to draw the texture within
   */

  /**
   * Draw a texture within a rectangle.
   *
   * @param texture A texture to draw
   * @param inTransform Matrix to transform from the coordinate system to
   *                  the OpenGL screen one
   * @param inUvTransform Matrix for UV transformations.
   * @param left Left coordinate of a rectangle to draw the texture within
   * @param bottom Bottom coordinate of a rectangle to draw the texture within
   * @param right Right coordinate of a rectangle to draw the texture within
   * @param top Top coordinate of a rectangle to draw the texture within
   * @param alphaScale The alpha scale to apply to the alpha of the texture
   * @param noScale If true, we will scale UVs to keep the aspect ratio and
   *                size of the texture for tiling
   */
  public drawTexture(
    texture: Texture,
    inTransform: mat4,
    left: number,
    bottom: number,
    right: number,
    top: number,
    inUvTransform: mat4 = Renderer.MAT4X4_IDENTITY,
    alphaScale = 1.0,
    noScale = false,
  ): void {
    const gl: WebGLRenderingContext = state.get(
      'context',
    ) as WebGLRenderingContext;

    this.setRect(left, bottom, right, top);

    this.uvTransform = mat4.clone(inUvTransform);

    if (noScale) {
      console.log('%c NO SCALE', 'color: red');
      // We first calculate the actual screen dimensions to be drawn.
      // left/bottom/right/top spans [-1, 1], so (right - left) / 2 will
      // give us the % of Renderer.sScreenWidth we will be drawing on.
      // Then we calculate the ratio of the texture's width to the
      // previous value to get how much the texture's UVs should be
      // scaled. The UV will be scaled inverse proportionally.
      const widthUvScale: number =
        (((right - left) / 2) * Renderer.getInstance().sScreenWidth) /
        texture.getWidth();
      const heightUvScale: number =
        (((top - bottom) / 2) * Renderer.getInstance().sScreenHeight) /
        texture.getHeight();

      const v3 = vec3.fromValues(widthUvScale, heightUvScale, 1);
      mat4.scale(this.uvTransform, this.uvTransform, v3);
    }

    this.mTexCoordBuffer.rewind();
    this.mPositionBuffer.rewind();

    this.mTextureMaterial.beginRender();

    // We set our own texture here to be bound
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture.getTextureId());

    // Set attribute arrays
    this.mTextureMaterial.setVertexAttributeBuffer(
      'aPosition',
      this.mPositionBuffer.glBuffer,
      0,
    );
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.mPositionBuffer.getRawBuffer()),
      gl.STATIC_DRAW,
    );

    this.mTextureMaterial.setVertexAttributeBuffer(
      'aTexCoord',
      this.mTexCoordBuffer.glBuffer,
      0,
    );

    // Set uniforms
    // Set texture uniform explicitly here because it is passed in
    gl.uniform1i(
      this.mTextureMaterial.getUniformLocation('uDiffuseTexture'),
      0,
    );
    gl.uniformMatrix4fv(
      this.mTextureMaterial.getUniformLocation('uMvpTransform'),
      false,
      inTransform,
    );
    gl.uniformMatrix4fv(
      this.mTextureMaterial.getUniformLocation('uUvTransform'),
      false,
      this.uvTransform,
    );
    gl.uniform1f(
      this.mTextureMaterial.getUniformLocation('uAlphaScale'),
      alphaScale,
    );

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    this.mTextureMaterial.endRender();
  }

  private setRect(
    left: number,
    bottom: number,
    right: number,
    top: number,
  ): void {
    const data = new Float32Array([
      left,
      bottom,
      right,
      bottom,
      left,
      top,
      right,
      top,
    ]);
    this.mPositionBuffer.position(0);
    this.mPositionBuffer.put(data);
  }
}
