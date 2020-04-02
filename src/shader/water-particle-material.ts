import { Log } from '../util/functionsHelper';
import { Material } from './material';
import { ShaderProgram } from './shader-program';
import { Texture } from './texture';
import { state } from '../state';
import { JSONObject } from '../util/types';
import { ParticleRenderer } from '../particle-renderer';
import { Renderer } from '../renderer';

// const colorWater = {
//   Lilac: '#dcb8ff',
//   Periwinkle: '#b9b7ff',
//   Cornflower: '#8c9dff',
//   Ocean: '#71a0f0',
//   Cobalt: '#55abff',
//   Aqua: '#63cee4',
//   Teal: '#75ccc7',
//   Seafoam: '#98e1c8',
//   Mist: '#b4e5af',
//   Lime: '#c0eba8',
//   Daffodil: '#e7f39f',
//   Lemon: '#f7eb83',
//   DEFAULT: 'Aqua',
// };

/**
 * ParticleMaterial.
 * This is the particle point sprite material.
 */
export class WaterParticleMaterial extends Material {
  protected static TAG = 'WaterParticleMaterial';
  private static DIFFUSE_TEXTURE_NAME = 'uDiffuseTexture';

  private mParticleSizeScale: number;
  // Parameters for adding in particle weight.
  // 0: Scale - decreases the range of values
  // 1: Range shift - shift the range from [0.0, inf) to [value, inf) so we
  //    get a less abrupt dropoff.
  // 2: Cutoff - values above this will affect color
  private mWeightParams: number[] = Array(3);

  constructor(/* context: Context, */ json: JSONObject) {
    super(new ShaderProgram('water_particle.glslv', 'particle.glslf'));

    // Read in values from the JSON file
    this.mParticleSizeScale = +json.particleSizeScale || 1.0;

    // Scale of weight. This changes values from [0.0, max) to
    // [0.0, max*scale).
    this.mWeightParams[0] = +json.weightScale || 1.0;

    // Range shift. This shifts values from [0.0, max) to
    // [range shift, max + range shift), so we take into account particles
    // with a small weight for a smoother curve.
    this.mWeightParams[1] = +json.weightRangeShift || 0.0;

    // Cutoff. This means particles with a weight less than the cutoff
    // will not have any weight applied.
    this.mWeightParams[2] = +json.weightCutoff || 1.0;

    // Add the water texture that is scrolling
    try {
      const textureName: string = json[
        WaterParticleMaterial.DIFFUSE_TEXTURE_NAME
      ] as string;
      this.addTexture(
        WaterParticleMaterial.DIFFUSE_TEXTURE_NAME,
        new Texture({ assetName: textureName }),
      );
    } catch (ex) {
      Log.e(
        WaterParticleMaterial.TAG,
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

    // Specific uniforms to this material
    gl.uniform1f(
      this.getUniformLocation('uPointSize'),
      Math.max(
        1.0,
        this.mParticleSizeScale *
          ParticleRenderer.FB_SIZE *
          (Renderer.PARTICLE_RADIUS /
            // Renderer.getInstance().sRenderWorldHeight
            max),
      ),
    );
    gl.uniform3fv(
      this.getUniformLocation('uWeightParams'),
      new Float32Array(this.mWeightParams),
    );
  }
}
