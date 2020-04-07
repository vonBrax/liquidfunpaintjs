import { ShaderProgram } from './shader-program';
import { Texture } from './texture';
import { Log } from '../util/log';
import { state } from '../state';

/**
 * Defines which component types are accepted.
 * OpenGL ES simply has these as global constants but we want to type check.
 * According to some sources (not benchmarked), enums can take up space
 * and are slower. Investigate these if we see related performance issues.
 */
class AttrComponentType {
  private mGlComponentType: number;

  constructor(glComponentType: number) {
    this.mGlComponentType = glComponentType;
  }

  public static BYTE(): AttrComponentType {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new AttrComponentType(gl.BYTE);
  }

  public static UNSIGNED_BYTE(): AttrComponentType {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new AttrComponentType(gl.UNSIGNED_BYTE);
  }

  public static SHORT(): AttrComponentType {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new AttrComponentType(gl.SHORT);
  }

  public static UNSIGNED_SHORT(): AttrComponentType {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new AttrComponentType(gl.UNSIGNED_SHORT);
  }

  public static FLOAT(): AttrComponentType {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new AttrComponentType(gl.FLOAT);
  }

  public getGlType(): number {
    return this.mGlComponentType;
  }
}

/**
 * Defines which blend types are accepted.
 * OpenGL ES simply has these as global constants but we want to type check.
 */
class BlendFactor {
  private mGlBlendFactor: number;

  constructor(glBlendFactor: number) {
    this.mGlBlendFactor = glBlendFactor;
  }

  public static ZERO(): BlendFactor {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new BlendFactor(gl.ZERO);
  }

  public static ONE(): BlendFactor {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new BlendFactor(gl.ONE);
  }

  public static SRC_COLOR(): BlendFactor {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new BlendFactor(gl.SRC_COLOR);
  }

  public static ONE_MINUS_SRC_COLOR(): BlendFactor {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new BlendFactor(gl.ONE_MINUS_SRC_COLOR);
  }

  public static DST_COLOR(): BlendFactor {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new BlendFactor(gl.DST_COLOR);
  }

  public static ONE_MINUS_DST_COLOR(): BlendFactor {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new BlendFactor(gl.ONE_MINUS_DST_COLOR);
  }

  public static SRC_ALPHA(): BlendFactor {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new BlendFactor(gl.SRC_ALPHA);
  }

  public static ONE_MINUS_SRC_ALPHA(): BlendFactor {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new BlendFactor(gl.ONE_MINUS_SRC_ALPHA);
  }

  public static DST_ALPHA(): BlendFactor {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new BlendFactor(gl.DST_ALPHA);
  }

  public static ONE_MINUS_DST_ALPHA(): BlendFactor {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new BlendFactor(gl.ONE_MINUS_DST_ALPHA);
  }

  public static CONSTANT_COLOR(): BlendFactor {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new BlendFactor(gl.CONSTANT_COLOR);
  }

  public static ONE_MINUS_CONSTANT_COLOR(): BlendFactor {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new BlendFactor(gl.ONE_MINUS_CONSTANT_COLOR);
  }

  public static CONSTANT_ALPHA(): BlendFactor {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new BlendFactor(gl.CONSTANT_ALPHA);
  }

  public static ONE_MINUS_CONSTANT_ALPHA(): BlendFactor {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new BlendFactor(gl.ONE_MINUS_CONSTANT_ALPHA);
  }

  public getGlType(): number {
    return this.mGlBlendFactor;
  }
}

/**
 * A class for defining the specific attribute's extra info
 * like type, stride, etc
 */
export class AttributeInfo {
  mName: string;
  mNumComponents: number;
  mComponentType: AttrComponentType;
  mComponentSize: number;
  mNormalized: boolean;
  mStride: number;
  mLocation: number;

  constructor(
    name: string,
    numComponents: number,
    componentType: AttrComponentType,
    componentSize: number,
    normalized: boolean,
    stride: number,
    location: number,
    tag: string,
  ) {
    this.mName = name;
    this.mNumComponents = numComponents;
    this.mComponentType = componentType;
    this.mComponentSize = componentSize;
    this.mNormalized = normalized;
    this.mStride = stride;
    this.mLocation = location;

    if (location < 0) {
      Log.e(
        tag,
        'Invalid vertex attribute location ' +
          name +
          '! Is the name spelled correctly?',
      );
    }
  }
}

/**
 * A class for storing render states to be set at the beginning of render.
 */
class RenderState {
  mEnableBlend = false;
  // These defaults are the OpenGL defaults
  mBlendColorSFactor: BlendFactor = BlendFactor.ONE();
  mBlendColorDFactor: BlendFactor = BlendFactor.ZERO();
}

/**
 * A layer on top of ShaderProgram to store specific parameters to be reused.
 * It stores render states and textures that we will set in conjunction with
 * a specific ShaderProgram -- allowing the ShaderProgram to be reused with
 * different parameters.
 */
export class Material {
  protected static TAG = 'Material';
  public static AttrComponentType = AttrComponentType;
  public static BlendFactor = BlendFactor;
  public static AttributeInfo = AttributeInfo;

  /// Member variables
  protected mShader: ShaderProgram = null;
  private mVertexAttributes: Map<string, AttributeInfo> = new Map<
    string,
    AttributeInfo
  >();
  private mTextures: Map<string, Texture> = new Map<string, Texture>();
  private mRenderState: RenderState = new RenderState();

  /// Member methods

  constructor(shader: ShaderProgram) {
    // Don't take the shader if it's not generated correctly
    if (shader && shader.isShaderCompiled()) {
      this.mShader = shader;
    } else {
      throw new Error(
        'ShaderProgram ' +
          shader +
          ' is not valid! Failed to ' +
          'assign to new Material.',
      );
    }
  }

  public addAttribute(
    name: string,
    numComponents: number,
    componentType: AttrComponentType,
    componentSize: number,
    normalized: boolean,
    stride: number,
  ): AttributeInfo {
    const location = this.mShader.getAttributeLocation(name);
    const attr = new AttributeInfo(
      name,
      numComponents,
      componentType,
      componentSize,
      normalized,
      stride,
      location,
      Material.TAG,
    );
    this.mVertexAttributes.set(name, attr);
    return attr;
  }

  public addTexture(textureUniformName: string, texture: Texture): void {
    const gl = this.getWebGLContext();
    this.mTextures.set(textureUniformName, texture);

    if (
      gl.TEXTURE0 + this.mTextures.size >
      gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS
    ) {
      Log.e(
        Material.TAG,
        'Too many textures in material! Failed to add: ' + texture,
      );
    }
  }

  public getWebGLContext(): WebGLRenderingContext {
    const gl: WebGLRenderingContext = state.get(
      'context',
    ) as WebGLRenderingContext;

    return gl;
  }

  public beginRender(): void {
    const gl = this.getWebGLContext();
    this.mShader.beginRender();

    // Set render states
    if (this.mRenderState.mEnableBlend) {
      gl.enable(gl.BLEND);
      gl.blendFunc(
        this.mRenderState.mBlendColorSFactor.getGlType(),
        this.mRenderState.mBlendColorDFactor.getGlType(),
      );
    }

    // enable all vertex attributes we have info on
    for (const attr of this.mVertexAttributes.values()) {
      gl.enableVertexAttribArray(attr.mLocation);
    }

    // enable all textures
    let textureIdx = 0;
    for (const [key, texture] of this.mTextures.entries()) {
      gl.activeTexture(gl.TEXTURE0 + textureIdx);
      gl.bindTexture(gl.TEXTURE_2D, texture.getTextureId());

      // Set the correct uniform
      gl.uniform1i(this.getUniformLocation(key), textureIdx);

      // Get next texture index
      ++textureIdx;
    }
  }

  public endRender(): void {
    const gl = this.getWebGLContext();

    // for (let i = 0; i < this.mTextures.size; ++i) {
    //   gl.activeTexture(gl.TEXTURE0 + i);
    //   // gl.bindTexture(gl.TEXTURE_2D, 0);
    //   gl.bindTexture(gl.TEXTURE_2D, gl.getParameter(gl.ACTIVE_TEXTURE));
    // }

    // disable all textures
    // const textures = state.get('textures');
    // for (const texture of this.mTextures.values()) {
    //   const index = textures.findIndex(
    //     (t: WebGLTexture) => t === texture.getTextureId(),
    //   );

    //   if (index > -1) {
    //     gl.activeTexture(gl.TEXTURE0 + index);
    //     // gl.bindTexture(gl.TEXTURE_2D, value.getTextureId());
    //     // gl.bindTexture(gl.TEXTURE_2D, state.get('textures')[0]);
    //     gl.bindTexture(gl.TEXTURE_2D, null);
    //   }
    //   // i++;
    // }
    for (let i = 0; i < this.mTextures.size; i++) {
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }

    // disable all vertex attributes
    for (const attr of this.mVertexAttributes.values()) {
      gl.disableVertexAttribArray(attr.mLocation);
    }

    // Reset render states
    if (this.mRenderState.mEnableBlend) {
      gl.disable(gl.BLEND);
    }

    this.mShader.endRender();
  }

  public setVertexAttributeBuffer(
    attr: AttributeInfo | string,
    buffer?: WebGLBuffer,
    offset?: number,
  ): void {
    const gl = this.getWebGLContext();
    // buffer.position(offset);
    if (typeof attr === 'string') {
      attr = this.mVertexAttributes.get(attr);
    }

    if (buffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    }

    gl.vertexAttribPointer(
      attr.mLocation,
      attr.mNumComponents,
      attr.mComponentType.getGlType(),
      attr.mNormalized,
      attr.mStride,
      offset,
    );
  }

  /**
   * Provide access to the ShaderProgram function
   */
  public getUniformLocation(name: string): WebGLUniformLocation {
    const location = this.mShader.getUniformLocation(name);
    if (location < 0) {
      Log.e(
        Material.TAG,
        'Invalid uniform location for ' +
          name +
          ' Is the name spelled correctly?',
      );
    }
    return location;
  }

  public setBlendFunc(sFactor: BlendFactor, dFactor: BlendFactor): void {
    // Optimize for (ONE, ZERO) -- that's the same as no blending.
    if (
      sFactor.getGlType() === BlendFactor.ONE().getGlType() &&
      dFactor.getGlType() === BlendFactor.ZERO().getGlType()
    ) {
      this.mRenderState.mEnableBlend = false;
    } else {
      this.mRenderState.mEnableBlend = true;
      this.mRenderState.mBlendColorSFactor = sFactor;
      this.mRenderState.mBlendColorDFactor = dFactor;
    }
  }
}
