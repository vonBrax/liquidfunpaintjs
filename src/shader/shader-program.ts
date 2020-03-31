// import shader;
// import util.FileHelper;
import { state } from '../state';
import { Log } from '../util/functionsHelper';
import { AssetManager } from '../util/asset-manager';
import { FileHelper } from '../util/file-helper';

class ParamInfo {
  mName: string;
  mSize: number;
  mType: number;
  mLocation: WebGLUniformLocation;

  constructor(
    name: string,
    size: number,
    type: number,
    location: WebGLUniformLocation,
  ) {
    this.mName = name;
    this.mSize = size;
    this.mType = type;
    this.mLocation = location;
  }
}

/**
 * Provides shader utilities for OpenGLES 2.0.
 * Also provides a container for OpenGL shaders, and various methods to help
 * with loading attributes, uniforms, and setting them.
 */
export class ShaderProgram {
  protected static TAG = 'ShaderProgram';

  // Set to 3 because that's the max we need for
  // glGetActiveUniform or the like.
  private static MAX_NUM_PARAMS = 3;

  // Vertex and fragment programs loaded from the assets/shaders folder
  private static SHADER_DIRECTORY = 'shaders';
  private static VERTEX_SHADER_EXTENSION = 'glslv';
  private static FRAGMENT_SHADER_EXTENSION = 'glslf';
  private static COMPILED_SHADERS: Map<string, WebGLShader> = new Map<
    string,
    WebGLShader
  >();

  /// Member variables
  protected mProgram: WebGLProgram;
  private mVSName: string = null;
  private mFSName: string = null;
  private mVertexAttributes: Map<string, ParamInfo> = new Map<
    string,
    ParamInfo
  >();
  private mUniforms: Map<string, ParamInfo> = new Map<string, ParamInfo>();

  /// Temp variables for getting OpenGL params
  /// We have this because we might query params during runtime and we can
  /// reuse this object for all such calls.
  private static sGlParams: number[] = Array<number>(
    ShaderProgram.MAX_NUM_PARAMS,
  );

  /// Static helper methods

  /**
   * Helper function for checking OpenGL errors
   * Warning: this is slow on runtime. It is provided as a convenience during
   * debugging.
   * @param glFunction
   */
  private static checkGlError(glFunction: string): void {
    let error: number;
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    while ((error = gl.getError()) !== gl.NO_ERROR) {
      Log.e(ShaderProgram.TAG, glFunction + ': glError ' + error);
    }
  }

  /**
   * Loads a GLSL shader.
   * @return Returns the GLES shader handle
   */
  private static loadShader(
    shaderType: number,
    shaderName: string,
    shaderSource: string,
  ): WebGLShader | number {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    let shaderProg = gl.createShader(shaderType);
    gl.shaderSource(shaderProg, shaderSource);
    gl.compileShader(shaderProg);

    // Check for errors
    if (!gl.getShaderParameter(shaderProg, gl.COMPILE_STATUS)) {
      Log.e(ShaderProgram.TAG, 'Could not compile shader ' + shaderName + ':');
      Log.e(ShaderProgram.TAG, gl.getShaderInfoLog(shaderProg));
      gl.deleteShader(shaderProg);
      shaderProg = 0;
    }

    return shaderProg;
  }

  /**
   * Loads all shader files from the Assets folder
   */
  public static async loadAllShaders(assetMgr: AssetManager): Promise<void> {
    // Clear the map; OpenGLES context could be destroyed while app is in
    // background. We have to reload all the shaders.
    this.COMPILED_SHADERS.clear();
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;

    try {
      const shaderFiles: string[] = await assetMgr.list(this.SHADER_DIRECTORY);
      for (const shaderFile of shaderFiles) {
        const fileContent: string = await FileHelper.loadAsset(
          this.SHADER_DIRECTORY + '/' + shaderFile,
        );

        let shaderProg: WebGLShader | number = 0;
        if (
          shaderFile.substring(shaderFile.lastIndexOf('.') + 1) ===
          this.VERTEX_SHADER_EXTENSION
        ) {
          shaderProg = this.loadShader(
            gl.VERTEX_SHADER,
            shaderFile,
            fileContent,
          );
        } else {
          shaderProg = this.loadShader(
            gl.FRAGMENT_SHADER,
            shaderFile,
            fileContent,
          );
        }

        if (shaderProg !== 0) {
          this.COMPILED_SHADERS.set(shaderFile, shaderProg);
        }
      }
    } catch (ex) {
      Log.e(ShaderProgram.TAG, 'Cannot find shader files!');
    }
  }

  /**
   * Wrapper for GLES20.glGetProgramiv with a better return interface.
   */
  private static getProgramiv(program: WebGLProgram, pname: number): number {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    this.sGlParams[0] = gl.getProgramParameter(program, pname);
    return this.sGlParams[0];
  }

  /**
   * Wrapper for GLES20.glGetIntegerv with a better return interface.
   */
  private static getIntegerv(pname: number): number {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    this.sGlParams[0] = gl.getParameter(pname);
    return this.sGlParams[0];
  }

  /// Member methods

  constructor(vsName: string, psName: string) {
    this.createProgram(vsName, psName);

    if (this.isShaderCompiled()) {
      this.initAttributes();
      this.initUniforms();
    }
  }

  /**
   * Creates a shader program.
   */
  private createProgram(vsName: string, psName: string): void {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    let program = gl.createProgram();

    // Technically, we could cache the compiled shader,
    // since a lot of shaders might share the same VS or FS. Unless the
    // number of reused shaders get large, there's not much of a gain.
    const vertexShaderProg: WebGLShader = ShaderProgram.COMPILED_SHADERS.get(
      vsName,
    );
    gl.attachShader(program, vertexShaderProg);

    const fragmentShaderProg: WebGLShader = ShaderProgram.COMPILED_SHADERS.get(
      psName,
    );
    gl.attachShader(program, fragmentShaderProg);

    // Check for errors
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      Log.e(
        ShaderProgram.TAG,
        'Could not link shaders ' + vsName + ' and ' + psName + '. OpenGL log:',
      );
      Log.e(ShaderProgram.TAG, gl.getProgramInfoLog(program));
      program = 0;
    }

    this.mVSName = vsName;
    this.mFSName = psName;
    this.mProgram = program;
  }

  public isShaderCompiled(): boolean {
    // const gl: WebGLRenderingContext = state.get(
    //   'context',
    // ) as WebGLRenderingContext;
    // const compiled = gl.getShaderParameter(this.mProgram, gl.COMPILE_STATUS);
    // return this.mProgram > 0;
    // return !!compiled;
    return !!this.mProgram;
  }

  /**
   * Load the attributes from the compiled shader.
   */
  private initAttributes(): void {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    const numAttributes: number = ShaderProgram.getProgramiv(
      this.mProgram,
      gl.ACTIVE_ATTRIBUTES,
    );

    for (let i = 0; i < numAttributes; ++i) {
      const info = gl.getActiveAttrib(this.mProgram, i);
      const location = gl.getAttribLocation(this.mProgram, info.name);

      this.mVertexAttributes.set(
        info.name,
        new ParamInfo(info.name, info.size, info.type, location),
      );
    }
  }

  public getAttributeLocation(name: string): number {
    const attrInfo: ParamInfo = this.mVertexAttributes.get(name);
    if (attrInfo == null) {
      return -1;
    }
    return attrInfo.mLocation as number;
  }

  /**
   * Load uniform info from compiled shader.
   */
  private initUniforms(): void {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    const numUniforms: number = ShaderProgram.getProgramiv(
      this.mProgram,
      gl.ACTIVE_UNIFORMS,
    );

    for (let i = 0; i < numUniforms; ++i) {
      const uniform = gl.getActiveUniform(this.mProgram, i);
      const location = gl.getUniformLocation(this.mProgram, uniform.name);

      this.mUniforms.set(
        uniform.name,
        new ParamInfo(uniform.name, uniform.size, uniform.type, location),
      );
    }
  }

  public getUniformLocation(name: string): WebGLUniformLocation {
    const uniformInfo: ParamInfo = this.mUniforms.get(name);
    if (uniformInfo == null) {
      return -1;
    }
    return uniformInfo.mLocation;
  }

  public beginRender(): void {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    // Only reset the program and bindings if it's not the same one.
    if (ShaderProgram.getIntegerv(gl.CURRENT_PROGRAM) != this.mProgram) {
      gl.useProgram(this.mProgram);
    }
  }

  public endRender(): void {
    // Do nothing
  }

  public toString(): string {
    return 'VS(' + this.mVSName + ') FS(' + this.mFSName + ')';
  }
}
