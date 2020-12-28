import { Texture } from './shader';
import { state } from './state';
// import { Color } from './util/types';

export class AndroidColor {
  static TRANSPARENT = 0x00000000;
  static BLACK = 0xff000000;

  static red(color: number): number {
    return (color >> 16) & 0xff;
  }

  static green(color: number): number {
    return (color >> 8) & 0xff;
  }

  static blue(color: number): number {
    return color & 0xff;
  }

  static alpha(color: number): number {
    return color >>> 24;
  }

  static argb(alpha: number, red: number, green: number, blue: number): number {
    return (alpha << 24) | (red << 16) | (green << 8) | blue;
  }
}

export class RenderSurface {
  private mFrameBuffer: WebGLFramebuffer;
  private mTexture: Texture;
  private mWidth: number;
  private mHeight: number;
  private mClearColor: number = AndroidColor.TRANSPARENT;

  constructor(width: number, height: number) {
    this.mWidth = width;
    this.mHeight = height;

    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;

    this.mFrameBuffer = gl.createFramebuffer();
    this.mTexture = new Texture();

    // Bind the texture object
    gl.bindTexture(gl.TEXTURE_2D, this.mTexture.getTextureId());

    // Set default filtering modes
    // We could have them pass in through the parameters in the future.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Generate the texture
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      this.mWidth,
      this.mHeight,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.mFrameBuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.mTexture.getTextureId(),
      0,
    );

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error('Failed to initialize framebuffer object ' + status);
    }

    // Bind the screen frame buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  public beginRender(clearMask: number): void {
    const gl: WebGLRenderingContext = state.get(
      'context',
    ) as WebGLRenderingContext;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.mFrameBuffer);
    gl.viewport(0, 0, this.mWidth, this.mHeight);

    if (clearMask !== 0) {
      gl.clearColor(
        AndroidColor.red(this.mClearColor),
        AndroidColor.blue(this.mClearColor),
        AndroidColor.green(this.mClearColor),
        AndroidColor.alpha(this.mClearColor),
      );
      gl.clear(clearMask);
    }
  }

  public endRender(): void {
    const gl: WebGLRenderingContext = state.get(
      'context',
    ) as WebGLRenderingContext;
    // gl.bindFramebuffer(gl.FRAMEBUFFER, 0);
    // gl.bindFramebuffer(gl.FRAMEBUFFER, state.get('frameBuffers')[0]);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  public getTexture(): Texture {
    return this.mTexture;
  }

  public getBuffer(): WebGLFramebuffer {
    return this.mFrameBuffer;
  }

  public setClearColor(color: number): void {
    this.mClearColor = color;
  }
}
