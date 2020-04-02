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
import { Tool, ToolType } from './tool/tool';
import { ByteBuffer } from './util/byte-buffer';

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

  private mParticleColorBuffer: ByteBuffer;
  private mParticlePositionBuffer: ByteBuffer;
  private mParticleWeightBuffer: ByteBuffer;

  private mParticleRenderList: ParticleGroup[] = Array(256);

  constructor() {
    this.mParticlePositionBuffer = new ByteBuffer(
      2 * 4 * Renderer.MAX_PARTICLE_COUNT,
    );
    this.mParticlePositionBuffer.createGLBuffer();
    this.mParticlePositionBuffer.createEmbindBuffer();

    this.mParticleColorBuffer = new ByteBuffer(
      4 * 1 * Renderer.MAX_PARTICLE_COUNT,
    );
    this.mParticleColorBuffer.createGLBuffer();
    this.mParticleColorBuffer.createEmbindBuffer();

    this.mParticleWeightBuffer = new ByteBuffer(
      1 * 4 * Renderer.MAX_PARTICLE_COUNT,
    );
    this.mParticleWeightBuffer.createGLBuffer();
    this.mParticleWeightBuffer.createEmbindBuffer();
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
    this.mParticlePositionBuffer.rewind();
    this.mParticleColorBuffer.rewind();
    this.mParticleWeightBuffer.rewind();
    this.mParticleRenderList = [];

    const ps: ParticleSystem = Renderer.getInstance().acquireParticleSystem();

    try {
      const gl: WebGL2RenderingContext = state.get(
        'context',
      ) as WebGL2RenderingContext;

      const worldParticleCount = ps.GetParticleCount();

      // Grab the most current particle buffers
      if (worldParticleCount > 0) {
        ps.CopyPositionBuffer(
          0,
          worldParticleCount,
          this.mParticlePositionBuffer.getPointer(),
          this.mParticlePositionBuffer.getLimit(),
        );
        // 2 float numbers per particle (x, y)
        this.mParticlePositionBuffer.setSize(2 * 4 * worldParticleCount);

        ps.CopyColorBuffer(
          0,
          worldParticleCount,
          this.mParticleColorBuffer.getPointer(),
          this.mParticleColorBuffer.getLimit(),
        );
        // 4 uint8 numbers per particle (r,g,b,a)
        this.mParticleColorBuffer.setSize(4 * 1 * worldParticleCount);

        ps.CopyWeightBuffer(
          0,
          worldParticleCount,
          this.mParticleWeightBuffer.getPointer(),
          this.mParticleWeightBuffer.getLimit(),
        );
        // 1 float number per particle (weight)
        this.mParticleWeightBuffer.setSize(1 * 4 * worldParticleCount);
      }

      gl.clearColor(0, 0, 0, 0);

      // Draw the particles
      this.drawParticles();

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

    const gl: WebGLRenderingContext = state.get(
      'context',
    ) as WebGLRenderingContext;

    // Draw!
    gl.drawArrays(gl.POINTS, instanceOffset, particleCount);
  }

  /**
   * Draw all the water particles, and save all the other particle groups
   * into a list. We draw these to temp mRenderSurface[0].
   */
  private drawWaterParticles(): void {
    const gl: WebGLRenderingContext = state.get(
      'context',
    ) as WebGLRenderingContext;

    // Draw all water particles to temp render surface 0
    this.mRenderSurface[0].beginRender(gl.COLOR_BUFFER_BIT);
    this.mWaterParticleMaterial.beginRender();

    // Set attribute arrays
    this.mWaterParticleMaterial.setVertexAttributeBuffer(
      'aPosition',
      this.mParticlePositionBuffer.glBuffer,
      0,
    );
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        Module.HEAPU8.buffer,
        this.mParticlePositionBuffer.getPointer(),
        this.mParticlePositionBuffer.getSize() / 4,
      ),
      gl.STATIC_DRAW,
    );

    this.mWaterParticleMaterial.setVertexAttributeBuffer(
      'aColor',
      this.mParticleColorBuffer.glBuffer,
      0,
    );
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array(
        Module.HEAPU8.buffer,
        this.mParticleColorBuffer.getPointer(),
        this.mParticleColorBuffer.getSize(),
      ),
      gl.STATIC_DRAW,
    );

    this.mWaterParticleMaterial.setVertexAttributeBuffer(
      'aWeight',
      this.mParticleWeightBuffer.glBuffer,
      0,
    );
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        Module.HEAPU8.buffer,
        this.mParticleWeightBuffer.getPointer(),
        this.mParticleWeightBuffer.getSize() / 4,
      ),
      gl.STATIC_DRAW,
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
        ) {
          this.drawParticleGroup(currGroup);
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

    if (state.get('blur')) {
      this.mBlurRenderer.draw(
        this.mRenderSurface[0].getTexture(),
        this.mRenderSurface[0],
      );
    }
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
      this.mParticlePositionBuffer.glBuffer,
      0,
    );
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        Module.HEAPU8.buffer,
        this.mParticlePositionBuffer.getPointer(),
        this.mParticlePositionBuffer.getSize() / 4,
      ),
      gl.STATIC_DRAW,
    );

    this.mParticleMaterial.setVertexAttributeBuffer(
      'aColor',
      this.mParticleColorBuffer.glBuffer,
      0,
    );
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array(
        Module.HEAPU8.buffer,
        this.mParticleColorBuffer.getPointer(),
        this.mParticleColorBuffer.getSize(),
      ),
      gl.STATIC_DRAW,
    );

    // Set uniforms
    gl.uniformMatrix4fv(
      this.mParticleMaterial.getUniformLocation('uTransform'),
      false,
      this.mTransformFromWorld,
    );

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

    if (state.get('blur')) {
      this.mBlurRenderer.draw(
        this.mRenderSurface[1].getTexture(),
        this.mRenderSurface[1],
      );
    }
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
    mat4.fromScaling(
      this.mTransformFromTexture,
      vec3.fromValues(1 / xRatio, 1 / yRatio, 1),
    );

    mat4.fromTranslation(
      this.mTransformFromWorld,
      vec3.fromValues(-xRatio, -yRatio, 0),
    );
    mat4.scale(
      this.mTransformFromWorld,
      this.mTransformFromWorld,
      vec3.fromValues(
        2.0 * (xRatio / Renderer.getInstance().sRenderWorldWidth),
        2.0 * (yRatio / Renderer.getInstance().sRenderWorldHeight),
        1.0,
      ),
    );
  }

  public async onSurfaceCreated(): Promise<void> {
    // Create the render surfaces
    for (let i = 0; i < this.mRenderSurface.length; i++) {
      this.mRenderSurface[i] = new RenderSurface(
        ParticleRenderer.FB_SIZE,
        ParticleRenderer.FB_SIZE,
      );
      this.mRenderSurface[i].setClearColor(AndroidColor.argb(0, 255, 255, 255));
    }

    // Create the blur renderer
    this.mBlurRenderer = new BlurRenderer();

    // Read in our specific json file
    const materialFile: string = await FileHelper.loadAsset(
      ParticleRenderer.JSON_FILE,
    );
    try {
      const json: JSONObject = JSON.parse(materialFile);

      // Water particle material. We are utilizing the position and color
      // buffers returned from LiquidFun directly.
      this.mWaterParticleMaterial = new WaterParticleMaterial(
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
        4,
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
        json.waterParticleToScreen as JSONObject,
        this.mRenderSurface[0].getTexture(),
      );

      // Scrolling texture when we copy water particles from FBO to screen
      this.mScreenRenderer = new ScreenRenderer(
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

      this.mPaperTexture = new Texture({ assetName: textureName });
    } catch (ex) {
      Log.e(
        ParticleRenderer.TAG,
        'Cannot parse ' + ParticleRenderer.JSON_FILE + '\n' + ex.message,
      );
    }
  }

  public reset(): void {
    this.mParticlePositionBuffer.clear();
    this.mParticleColorBuffer.clear();
    this.mParticleWeightBuffer.clear();
  }
}
