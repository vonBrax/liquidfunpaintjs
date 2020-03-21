import { Material } from './material';
import { ShaderProgram } from './shader-program';
import { Texture } from './texture';
import { Renderer } from '../renderer';
import { ParticleRenderer } from '../particle-renderer';
import { Log } from '../util/functionsHelper';
import { state } from '../state';
import { JSONObject } from '../util/types';

/**
 * ParticleMaterial.
 * This is the particle point sprite material.
 */
export class ParticleMaterial extends Material {
  protected static TAG = 'ParticleMaterial';
  private static DIFFUSE_TEXTURE_NAME = 'uDiffuseTexture';

  private mParticleSizeScale: number;

  constructor(/* context: Context, */ json: JSONObject) {
    super(new ShaderProgram('particle.glslv', 'particle.glslf'));

    // Read in values from the JSON file
    this.mParticleSizeScale = (json.particleSizeScale || 1.0) as number;

    // Add the water texture that is scrolling
    try {
      const textureName = json[ParticleMaterial.DIFFUSE_TEXTURE_NAME] as string;
      this.addTexture(
        ParticleMaterial.DIFFUSE_TEXTURE_NAME,
        new Texture({ /* context, */ assetName: textureName }),
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
    // Specific uniforms to this material
    gl.uniform1f(
      this.getUniformLocation('uPointSize'),
      Math.max(
        1.0,
        this.mParticleSizeScale *
          ParticleRenderer.FB_SIZE *
          (Renderer.PARTICLE_RADIUS /
            Renderer.getInstance().sRenderWorldHeight),
      ),
    );
  }
}
