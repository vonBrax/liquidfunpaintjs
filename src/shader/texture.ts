import { mat3, vec2 } from 'gl-matrix';
import { FileHelper } from '../util/file-helper';
import { state } from '../state';

function isPowerOf2(value: number): boolean {
  return (value & (value - 1)) == 0;
}

/**
 * Defines which component types are accepted.
 * OpenGL ES simply has these as global constants but we want to type check.
 * According to some sources (not benchmarked), enums can take up space
 * and are slower. Investigate these if we see related performance issues.
 */
class WrapParam {
  private mGlComponentType: number;

  constructor(glComponentType: number) {
    this.mGlComponentType = glComponentType;
  }

  // (GLES20.GL_CLAMP_TO_EDGE),
  //   MIRRORED_REPEAT(GLES20.GL_MIRRORED_REPEAT),
  //   REPEAT(GLES20.GL_REPEAT),
  //   DEFAULT(GLES20.GL_CLAMP_TO_EDGE);

  public static CLAMP_TO_EDGE(): WrapParam {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new WrapParam(gl.CLAMP_TO_EDGE);
  }

  public static MIRRORED_REPEAT(): WrapParam {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new WrapParam(gl.MIRRORED_REPEAT);
  }

  public static REPEAT(): WrapParam {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new WrapParam(gl.REPEAT);
  }

  public static DEFAULT(): WrapParam {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    return new WrapParam(gl.CLAMP_TO_EDGE);
  }

  public getGlType(): number {
    return this.mGlComponentType;
  }
}

interface TextureConstructor {
  // context?: Context;
  resourceId?: number;
  assetName?: string;
  scale?: boolean;
  wrapS?: WrapParam;
  wrapT?: WrapParam;
}

function createMatrix(x: number, y: number): mat3 {
  const v2 = vec2.fromValues(x, y);
  return mat3.fromScaling(mat3.create(), v2);
}

/**
 * A texture.
 * Could be created from a drawable or a bitmap image, or as a container for
 * a generated texture id.
 */
export class Texture {
  public static WrapParam: WrapParam;
  private mTextureId: WebGLTexture[] = [];
  private mWidth = 0;
  private mHeight = 0;
  private mName = 'Runtime texture';

  // OpenGL standard has (0,0) as the lower left corner,
  // whereas Android Bitmaps use (0,0) as the upper left corner.
  // We flip images on load to get around this.
  private static Y_FLIP_MATRIX: mat3 = createMatrix(1, -1);

  /**
   * Default constructor.
   * Default params:
   * BitmapFactory.Options.inScale = true
   * GL_TEXTURE_MAG_FILTER = GL_NEAREST
   * GL_TEXTURE_MIN_FILTER = GL_NEAREST
   * GL_TEXTURE_WRAP_* = GL_CLAMP_TO_EDGE
   *
   * @param resourceId Resource ID of a drawable.
   */

  /**
   * Constructor with more parameters for creating a texture.
   * @param resourceId Resource ID of a drawable.
   * @param scale If true, BitmapFactory will scale image. Else it won't.
   */

  /**
   * Load a texture in the assets directory
   * @param assetName
   */

  /**
   * Load a texture in the assets directory
   * @param assetName
   */

  /**
   * Constructor for textures not loaded from resource.
   * Notably texture use for render surfaces.
   */

  constructor(textureConstructor?: TextureConstructor) {
    if (!textureConstructor) {
      this.generateTexture();
    } else {
      const { resourceId, assetName } = textureConstructor;
      let { scale, wrapS, wrapT } = textureConstructor;

      scale = scale || true;
      wrapS = wrapS || WrapParam.DEFAULT();
      wrapT = wrapT || WrapParam.DEFAULT();
      if (resourceId) {
        this.mName = 'TODO'; //context.getResources().getResourceEntryName(resourceId);
        console.log('TEXTURE CONSTRUCTOR');
        this.generateTexture();
        this._loadTexture(/* context,*/ resourceId, scale, wrapS, wrapT);
      } else if (assetName) {
        // console.log('Loading texture: ' + assetName);
        this.mName = assetName;
        this.generateTexture();
        // const gl: WebGLRenderingContext = state.get('context');
        // const pixel = new Uint8Array([0, 0, 255, 255]);
        // gl.texImage2D(
        //   gl.TEXTURE_2D,
        //   0,
        //   gl.RGBA,
        //   1,
        //   1,
        //   0,
        //   gl.RGBA,
        //   gl.UNSIGNED_BYTE,
        //   pixel,
        // );
        FileHelper.loadBitmap(assetName).then(bitmap =>
          this.loadTexture(bitmap, scale, wrapS, wrapT),
        );
      }
    }
  }

  private generateTexture(): void {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    //   gl.genTextures(1, this.mTextureId, 0);
    this.mTextureId[0] = gl.createTexture();

    // Globally storing all textures for debug
    const textures = state.get('textures') || [];
    textures.push(this.mTextureId[0]);
    state.set('textures', textures);
  }

  /**
   * Load the drawable into a texture.
   *
   * @param context Context
   */
  private _loadTexture(
    // context: Context,
    resourceId: number,
    scale: boolean,
    wrapS: WrapParam,
    wrapT: WrapParam,
  ): void {
    /**
     * @todo:
     * Load the image and use the loadTexture method
     * (do not create a bitmap from a byte buffer)
     */
    // const opt: BitmapFactory.Options = new BitmapFactory.Options();
    // opt.inScaled = scale;
    // let bitmap: Bitmap = BitmapFactory.decodeResource(
    //   context.getResources(),
    //   resourceId,
    //   opt,
    // );
    // bitmap = Bitmap.createBitmap(
    //   bitmap,
    //   0,
    //   0,
    //   bitmap.getWidth(),
    //   bitmap.getHeight(),
    //   Texture.Y_FLIP_MATRIX,
    //   false,
    // );
    // Load texture
    // this.loadTexture(bitmap, scale, wrapS, wrapT);
    // bitmap.recycle();
    console.log('%c LOADING TEXTURE NEEDS FIX', 'color: red');
    console.log({ resourceId, scale, wrapS, wrapT });
  }

  /**
   * Load a bitmap image into a texture.
   *
   * @param bitmap A bitmap image to load.
   */
  public loadTexture(
    bitmap: HTMLImageElement,
    scale: boolean,
    wrapS: WrapParam,
    wrapT: WrapParam,
  ): void {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;

    // Set texture properties
    this.mWidth = bitmap.naturalWidth || bitmap.width;
    this.mHeight = bitmap.naturalHeight || bitmap.height;

    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, )
    gl.bindTexture(gl.TEXTURE_2D, this.mTextureId[0]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(this.mWidth) && isPowerOf2(this.mHeight)) {
      // Yes, it'S a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn of mips and set
      // wrapping
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS.getGlType());
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT.getGlType());
    }
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
    // gl.texImage2D(
    //   gl.TEXTURE_2D,
    //   0,
    //   gl.RGBA,
    //   this.mWidth,
    //   this.mHeight,
    //   0,
    //   gl.RGBA,
    //   gl.UNSIGNED_BYTE,
    //   bitmap,
    // );
  }

  /**
   * @return the texture ID.
   */
  public getTextureId(): WebGLTexture {
    return this.mTextureId[0];
  }

  /** Get the width in pixels */
  public getWidth(): number {
    return this.mWidth;
  }

  /** Get the height in pixels */
  public getHeight(): number {
    return this.mHeight;
  }

  public toString(): string {
    return this.mName;
  }
}
