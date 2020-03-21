import {
  Material,
  ParticleMaterial,
  Texture,
  WaterParticleMaterial,
} from './shader';
import { ScreenRenderer } from './screen-renderer';
import { RenderSurface, AndroidColor } from './render-surface';
import { Renderer } from './renderer';
import { TextureRenderer } from './texture-renderer';
import { state } from './state';
import { mat4, vec3 } from 'gl-matrix';
import { JSONObject } from './util/types';
import { Log } from './util/functionsHelper';
import { FileHelper } from './util/file-helper';
import { BlurRenderer } from './blur-renderer';
import {
  createBuffer,
  destroyBuffer,
  ParticleBuffer,
  ArrayViewType,
} from './util/wasm-buffer';
import { Tool, ToolType } from './tool/tool';

// declare type TypedArray =
//   | Int8Array
//   | Uint8Array
//   | Uint8ClampedArray
//   | Int16Array
//   | Uint16Array
//   | Int32Array
//   | Uint32Array
//   | Float32Array
//   | Float64Array
//   | BigInt64Array
//   | BigUint64Array;

// function _arrayToHeap(typedArray: TypedArray): TypedArray {
//   const numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;
//   const ptr = Module._malloc(numBytes);
//   const heapBytes = new Uint8Array(Module.HEAPU8.buffer, ptr, numBytes);
//   heapBytes.set(new Uint8Array(typedArray.buffer));
//
//   return heapBytes;
// }

// function _freeArray(heapBytes: TypedArray): void {
//   Module._free(heapBytes.byteOffset);
// }

// interface ParticleBuffer {
//   bufferData: TypedArray;
//   pointer: number;
//   buffer: WebGLBuffer;
// }

// function createBuffer(num = 1): ParticleBuffer {
//   const numBytes = num * 4 * Renderer.MAX_PARTICLE_COUNT;
//   const dataPtr = Module._malloc(numBytes);

//   const gl: WebGLRenderingContext = state.get('context');

//   // const bufferData =
//   //   type === 'Uint8'
//   //     ? new Uint8Array(Module.HEAPU8.buffer, dataPtr, numBytes)
//   //     : new Float32Array(Module.HEAPU8.buffer, dataPtr, numBytes);

//   return {
//     pointer: dataPtr,
//     bufferData: new Float32Array(Module.HEAPU8.buffer, dataPtr, numBytes),
//     // bufferData,
//     buffer: gl.createBuffer(),
//   };
//   // return new Uint8Array(Module.HEAPU8.buffer, dataPtr, numBytes);
// }

// function destroyBuffer(ptr: number): void {
//   Module._free(ptr);
// }

/**
 * Renderer to draw particle water, objects, and wall. It draws particles as
 * fluid (or objects) by following three steps:
 * 1) Draws particles to a texture
 * 2) Blurs it out
 * 3) Applies threshold.
 * This only executes on the GLSurfaceView thread.
 */
export class ParticleRenderer {
  protected static TAG = 'PtlRenderer';
  private static JSON_FILE = 'materials/particlerenderer.json';
  private static PAPER_MATERIAL_NAME = 'paper';
  private static DIFFUSE_TEXTURE_NAME = 'uDiffuseTexture';

  // Framebuffer for the particles to render on.
  public static FB_SIZE = 256;

  private mWaterParticleMaterial: WaterParticleMaterial;
  private mParticleMaterial: ParticleMaterial;
  private mBlurRenderer: BlurRenderer;
  private mWaterScreenRenderer: ScreenRenderer;
  private mScreenRenderer: ScreenRenderer;
  private mPaperTexture: Texture;

  private mRenderSurface: RenderSurface[] = Array(2);
  private mTransformFromTexture: mat4 = mat4.create(); // = Array(16);
  private mTransformFromWorld: mat4 = mat4.create();

  private mParticleColorBuffer: ParticleBuffer;
  private mParticlePositionBuffer: ParticleBuffer;
  private mParticleWeightBuffer: ParticleBuffer;

  private mParticleRenderList: ParticleGroup[] = Array(256);

  constructor() {
    // const gl: WebGL2RenderingContext = state.get(
    //   'context',
    // ) as WebGL2RenderingContext;
    // this.mParticlePositionBuffer = gl.createBuffer();
    // this.mParticleColorBuffer = gl.createBuffer();
    // this.mParticleWeightBuffer = gl.createBuffer();
    this.mParticlePositionBuffer = createBuffer(
      2 * 4 * Renderer.MAX_PARTICLE_COUNT,
      true,
      ArrayViewType.FLOAT32,
    );
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.mParticlePositionBuffer.buffer);
    // gl.bufferData(
    //   gl.ARRAY_BUFFER,
    //   this.mParticlePositionBuffer.bufferData,
    //   gl.STATIC_DRAW,
    // );

    this.mParticleColorBuffer = createBuffer(
      1 * 4 * Renderer.MAX_PARTICLE_COUNT,
      true,
      ArrayViewType.UINT8,
    );
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.mParticleColorBuffer.buffer);
    // gl.bufferData(
    //   gl.ARRAY_BUFFER,
    //   this.mParticleColorBuffer.bufferData,
    //   gl.STATIC_DRAW,
    // );

    this.mParticleWeightBuffer = createBuffer(
      1 * 4 * Renderer.MAX_PARTICLE_COUNT,
      true,
      ArrayViewType.FLOAT32,
    );
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.mParticleWeightBuffer.buffer);
    // gl.bufferData(
    //   gl.ARRAY_BUFFER,
    //   this.mParticleWeightBuffer.bufferData,
    //   gl.STATIC_DRAW,
    // );
  }

  /**
   * Once per frame operations
   */
  public update(dt: number): void {
    // console.log('[Particle-renderer] - update: ' + dt);
  }

  /**
   * This should only execute on the GLSurfaceView thread.
   */
  public draw(): void {
    // Per frame resets of buffers
    // mParticlePositionBuffer.rewind();
    // mParticleColorBuffer.rewind();
    // mParticleWeightBuffer.rewind();
    this.mParticleRenderList = [];

    const ps: ParticleSystem = Renderer.getInstance().acquireParticleSystem();
    //const buffer = new ArrayBuffer(8);
    //const view = new Int8Array(buffer);

    try {
      const gl: WebGL2RenderingContext = state.get(
        'context',
      ) as WebGL2RenderingContext;
      // const size = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE);

      const worldParticleCount = ps.GetParticleCount();
      // console.log(worldParticleCount);

      // grab the most current particle buffers
      ps.CopyPositionBuffer(
        // ps,
        0,
        worldParticleCount,
        this.mParticlePositionBuffer.pointer,
        //view,
        2 * 4 * Renderer.MAX_PARTICLE_COUNT,
      );
      ps.CopyColorBuffer(
        0,
        worldParticleCount,
        this.mParticleColorBuffer.pointer,
        1 * 4 * Renderer.MAX_PARTICLE_COUNT,
      );
      ps.CopyWeightBuffer(
        0,
        worldParticleCount,
        this.mParticleWeightBuffer.pointer,
        1 * 4 * Renderer.MAX_PARTICLE_COUNT,
      );

      // gl.bindBuffer(gl.ARRAY_BUFFER, this.mParticlePositionBuffer.buffer);
      // gl.bufferData(
      //   gl.ARRAY_BUFFER,
      //   this.mParticlePositionBuffer.bufferData,
      //   gl.DYNAMIC_DRAW,
      // );

      // gl.bindBuffer(gl.ARRAY_BUFFER, this.mParticleColorBuffer.buffer);
      // gl.bufferData(
      //   gl.ARRAY_BUFFER,
      //   this.mParticleColorBuffer.bufferData,
      //   gl.STATIC_DRAW,
      // );

      // gl.bindBuffer(gl.ARRAY_BUFFER, this.mParticleWeightBuffer.buffer);
      // gl.bufferData(
      //   gl.ARRAY_BUFFER,
      //   this.mParticleWeightBuffer.bufferData,
      //   gl.STATIC_DRAW,
      // );

      gl.clearColor(0, 0, 0, 0);

      // Draw the particles
      this.drawParticles();

      // gl.bindFramebuffer(gl.FRAMEBUFFER, 0);
      // gl.bindFramebuffer(gl.FRAMEBUFFER, state.get('frameBuffers')[0]);
      // gl.bindFramebuffer(gl.FRAMEBUFFER, this.mRenderSurface[0].getBuffer());
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      gl.viewport(
        0,
        0,
        Renderer.getInstance().sScreenWidth,
        Renderer.getInstance().sScreenHeight,
      );

      // Draw the paper texture.
      TextureRenderer.getInstance().drawTexture(
        this.mPaperTexture,
        Renderer.MAT4X4_IDENTITY,
        -1,
        -1,
        1,
        1,
      );

      // Copy the water particles to screen
      this.mWaterScreenRenderer.draw(this.mTransformFromTexture);

      // Copy the other particles to screen
      this.mScreenRenderer.draw(this.mTransformFromTexture);
    } catch (e) {
      console.error(e);
    } finally {
      Renderer.getInstance().releaseParticleSystem();
    }
  }

  private drawParticles(): void {
    this.drawWaterParticles();
    this.drawNonWaterParticles();
  }

  /**
   * Issue the correct draw call for the ParticleGroup that is passed in.
   */
  private drawParticleGroup(pg: ParticleGroup): void {
    // Get the buffer offsets
    const instanceOffset = pg.GetBufferIndex();
    const particleCount = pg.GetParticleCount();
    // console.log(instanceOffset);
    // if (particleCount === 5) {
    //   console.log('%c WE GOT IT', 'color: green');
    //   console.log(this.mParticlePositionBuffer.bufferData.slice(0, 30));
    //   // console.log(this.mParticleColorBuffer.bufferData);
    //   // console.log(this.mParticleWeightBuffer.bufferData);
    // }

    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;

    // Draw!
    gl.drawArrays(gl.POINTS, instanceOffset, particleCount);
  }

  /**
   * Draw all the water particles, and save all the other particle groups
   * into a list. We draw these to temp mRenderSurface[0].
   */
  private drawWaterParticles(): void {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    // Draw all water particles to temp render surface 0
    this.mRenderSurface[0].beginRender(gl.COLOR_BUFFER_BIT);

    this.mWaterParticleMaterial.beginRender();

    // Set attribute arrays
    this.mWaterParticleMaterial.setVertexAttributeBuffer(
      'aPosition',
      this.mParticlePositionBuffer.buffer,
      0,
      this.mParticlePositionBuffer.bufferData,
    );
    this.mWaterParticleMaterial.setVertexAttributeBuffer(
      'aColor',
      this.mParticleColorBuffer.buffer,
      0,
      this.mParticleColorBuffer.bufferData,
      true,
    );
    this.mWaterParticleMaterial.setVertexAttributeBuffer(
      'aWeight',
      this.mParticleWeightBuffer.buffer,
      0,
      this.mParticleWeightBuffer.bufferData,
    );

    // Set uniforms
    gl.uniformMatrix4fv(
      this.mWaterParticleMaterial.getUniformLocation('uTransform'),
      false,
      this.mTransformFromWorld,
    );

    // Go through each particle group
    const ps: ParticleSystem = Renderer.getInstance().acquireParticleSystem();
    try {
      let currGroup: ParticleGroup = ps.GetParticleGroupList();

      while (currGroup != null) {
        // Only draw water particles in this pass; queue other groups
        if (
          currGroup.GetGroupFlags() ===
          Tool.getTool(ToolType.WATER).getParticleGroupFlags()
          // Tool.getTool(Tool.ToolType.WATER).getParticleGroupFlags()
        ) {
          this.drawParticleGroup(currGroup);
          // console.log(this.mParticleColorBuffer.bufferData);
        } else {
          this.mParticleRenderList.push(currGroup);
        }

        currGroup = currGroup.GetNext();
      }
    } finally {
      Renderer.getInstance().releaseParticleSystem();
    }

    this.mWaterParticleMaterial.endRender();

    this.mRenderSurface[0].endRender();

    this.mBlurRenderer.draw(
      this.mRenderSurface[0].getTexture(),
      this.mRenderSurface[0],
    );
  }

  /**
   * Draw all saved ParticleGroups to temp mRenderSurface[1].
   */
  private drawNonWaterParticles(): void {
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    // Draw all non-water particles to temp render surface 1
    this.mRenderSurface[1].beginRender(gl.COLOR_BUFFER_BIT);

    this.mParticleMaterial.beginRender();

    // Set attribute arrays
    this.mParticleMaterial.setVertexAttributeBuffer(
      'aPosition',
      this.mParticlePositionBuffer.buffer,
      0,
    );
    this.mParticleMaterial.setVertexAttributeBuffer(
      'aColor',
      this.mParticleColorBuffer.buffer,
      0,
    );

    // Set uniforms
    gl.uniformMatrix4fv(
      this.mParticleMaterial.getUniformLocation('uTransform'),
      false,
      this.mTransformFromWorld,
    );

    // const ps: ParticleSystem = Renderer.getInstance().acquireParticleSystem();
    Renderer.getInstance().acquireParticleSystem();
    try {
      // Go through all the particleGroups in the render list
      for (const currGroup of this.mParticleRenderList) {
        this.drawParticleGroup(currGroup);
      }
    } finally {
      Renderer.getInstance().releaseParticleSystem();
    }

    this.mParticleMaterial.endRender();

    this.mRenderSurface[1].endRender();
    this.mBlurRenderer.draw(
      this.mRenderSurface[1].getTexture(),
      this.mRenderSurface[1],
    );
  }

  public onSurfaceChanged(width: number, height: number): void {
    let xRatio = 1;
    let yRatio = 1;

    if (width < height) {
      xRatio = width / height;
    } else {
      yRatio = height / width;
    }

    // Set up the transform
    // const ratio: number = height / width;
    mat4.fromScaling(
      this.mTransformFromTexture,
      vec3.fromValues(1 / xRatio, 1 / yRatio, 1),
    );
    // Matrix.setIdentityM(mTransformFromTexture, 0);
    // Matrix.scaleM(mTransformFromTexture, 0, 1, 1 / ratio, 1);

    mat4.fromTranslation(
      this.mTransformFromWorld,
      vec3.fromValues(-xRatio, -yRatio, 0),
    );
    mat4.scale(
      this.mTransformFromWorld,
      this.mTransformFromWorld,
      vec3.fromValues(
        (2.0 * xRatio) / Renderer.getInstance().sRenderWorldWidth,
        (2 * yRatio) / Renderer.getInstance().sRenderWorldHeight,
        1,
      ),
    );
    // Matrix.setIdentityM(mTransformFromWorld, 0);
    // Matrix.translateM(mTransformFromWorld, 0, -1, -ratio, 0);
    // Matrix.scaleM(
    //         mTransformFromWorld,
    //         0,
    //         2f / Renderer.getInstance().sRenderWorldWidth,
    //         2 * ratio / Renderer.getInstance().sRenderWorldHeight,
    //         1);
  }

  public async onSurfaceCreated(/* context: Context */): Promise<void> {
    // Create the render surfaces
    for (let i = 0; i < this.mRenderSurface.length; i++) {
      this.mRenderSurface[i] = new RenderSurface(
        ParticleRenderer.FB_SIZE,
        ParticleRenderer.FB_SIZE,
      );
      this.mRenderSurface[i].setClearColor(AndroidColor.argb(0, 255, 255, 255));
      // this.mRenderSurface[i].setClearColor(
      //   255 / 255,
      //   255 / 255,
      //   255 / 255,
      //   0 / 255,
      // );
    }

    // Create the blur renderer
    this.mBlurRenderer = new BlurRenderer();

    // Read in our specific json file
    const materialFile: string = await FileHelper.loadAsset(
      // context.getAssets(),
      ParticleRenderer.JSON_FILE,
    );
    try {
      const json: JSONObject = JSON.parse(materialFile);

      // Water particle material. We are utilizing the position and color
      // buffers returned from LiquidFun directly.
      this.mWaterParticleMaterial = new WaterParticleMaterial(
        // context,
        json.waterParticlePointSprite as JSONObject,
      );

      // Initialize attributes specific to this material
      this.mWaterParticleMaterial.addAttribute(
        'aPosition',
        2,
        Material.AttrComponentType.FLOAT(),
        4,
        false,
        0,
      );
      this.mWaterParticleMaterial.addAttribute(
        'aColor',
        4,
        Material.AttrComponentType.UNSIGNED_BYTE(),
        1,
        true,
        0,
      );
      this.mWaterParticleMaterial.addAttribute(
        'aWeight',
        1,
        Material.AttrComponentType.FLOAT(),
        1,
        false,
        0,
      );
      this.mWaterParticleMaterial.setBlendFunc(
        Material.BlendFactor.ONE(),
        Material.BlendFactor.ONE_MINUS_SRC_ALPHA(),
      );

      // Non-water particle material. We are utilizing the position and
      // color buffers returned from LiquidFun directly.
      this.mParticleMaterial = new ParticleMaterial(
        // context,
        json.otherParticlePointSprite as JSONObject,
      );

      // Initialize attributes specific to this material
      this.mParticleMaterial.addAttribute(
        'aPosition',
        2,
        Material.AttrComponentType.FLOAT(),
        4,
        false,
        0,
      );
      this.mParticleMaterial.addAttribute(
        'aColor',
        4,
        Material.AttrComponentType.UNSIGNED_BYTE(),
        1,
        true,
        0,
      );
      this.mParticleMaterial.setBlendFunc(
        Material.BlendFactor.ONE(),
        Material.BlendFactor.ONE_MINUS_SRC_ALPHA(),
      );

      // Scrolling texture when we copy water particles from FBO to screen
      this.mWaterScreenRenderer = new ScreenRenderer(
        // context,
        json.waterParticleToScreen as JSONObject,
        this.mRenderSurface[0].getTexture(),
      );

      // Scrolling texture when we copy water particles from FBO to screen
      this.mScreenRenderer = new ScreenRenderer(
        // context,
        json.otherParticleToScreen as JSONObject,
        this.mRenderSurface[1].getTexture(),
      );

      // Texture for paper
      const materialData: JSONObject = json[
        ParticleRenderer.PAPER_MATERIAL_NAME
      ] as JSONObject;
      const textureName = materialData[
        ParticleRenderer.DIFFUSE_TEXTURE_NAME
      ] as string;
      this.mPaperTexture = new Texture(
        // context,
        { assetName: textureName },
      );
    } catch (ex) {
      Log.e(
        ParticleRenderer.TAG,
        'Cannot parse ' + ParticleRenderer.JSON_FILE + '\n' + ex.message,
      );
    }
  }

  public reset(): void {
    // const gl: WebGL2RenderingContext = state.get(
    //   'context',
    // ) as WebGL2RenderingContext;
    // this.mParticlePositionBuffer = gl.createBuffer();
    // this.mParticleColorBuffer = gl.createBuffer();
    // this.mParticleWeightBuffer = gl.createBuffer();
  }
}
