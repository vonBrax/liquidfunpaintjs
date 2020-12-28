import { Material } from './material';
import { ShaderProgram } from './shader-program';
import { Texture } from './texture';
import { Renderer } from '../renderer';
import { ParticleRenderer } from '../particle-renderer';
import { Log } from '../util/log';
import { state } from '../state';
import { JSONObject } from '@lfpjs/common';

/**
 * ParticleMaterial.
 * This is the particle point sprite material.
 */
export class ParticleMaterial extends Material {
  protected static TAG = 'ParticleMaterial';
  private static DIFFUSE_TEXTURE_NAME = 'uDiffuseTexture';

  private mParticleSizeScale: number;

  constructor(json: JSONObject) {
    super(new ShaderProgram('particle.glslv', 'particle.glslf'));

    // Read in values from the JSON file
    this.mParticleSizeScale = Number(json.particleSizeScale || 1.0);

    // Add the water texture that is scrolling
    try {
      const textureName = json[ParticleMaterial.DIFFUSE_TEXTURE_NAME] as string;
      this.addTexture(
        ParticleMaterial.DIFFUSE_TEXTURE_NAME,
        new Texture({ assetName: textureName }),
      );
    } catch (ex) {
      Log.e(
        ParticleMaterial.TAG,
        'Missing point sprite texture!\n' + ex.message,
      );
    }
  }

  public beginRender(): void {
    super.beginRender();
    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;

    const max = Math.max(
      Renderer.getInstance().sRenderWorldWidth,
      Renderer.getInstance().sRenderWorldHeight,
    );

    const num =
      this.mParticleSizeScale *
      ParticleRenderer.FB_SIZE *
      Renderer.PARTICLE_RADIUS;

    gl.uniform1f(
      this.getUniformLocation('uPointSize'),
      Math.max(1.0, (num * 1.5) / max),
    );

    // Specific uniforms to this material
    // gl.uniform1f(
    //   this.getUniformLocation('uPointSize'),
    //   Math.max(
    //     1.0,
    //     this.mParticleSizeScale *
    //       ParticleRenderer.FB_SIZE *
    //       (Renderer.PARTICLE_RADIUS /
    //         // Renderer.getInstance().sRenderWorldHeight
    //         max),
    //   ),
    // );
  }
}
