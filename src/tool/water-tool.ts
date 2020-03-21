import { Tool, ToolType, ParticleFlag, ParticleGroupFlag } from './tool';
import { PointerInfo } from './pointer-info';

/**
 * Water tool
 * We create particle groups per draw, but we don't need to join them.
 * Particle groups are merely used to mimic the shape of a stroke.
 */
export class WaterTool extends Tool {
  private mParticleGroup: ParticleGroup = null;

  constructor() {
    super(ToolType.WATER);
    super.registerTool(ToolType.WATER, this);
    this.mParticleFlags =
      ParticleFlag.waterParticle | ParticleFlag.colorMixingParticle;
    this.mParticleGroupFlags = ParticleGroupFlag.particleGroupCanBeEmpty;
    console.log({
      particleFlags: this.mParticleFlags,
      groupFlags: this.mParticleGroupFlags,
    });
  }

  /**
   * @override
   * @param pInfo The pointer info containing the previous group info
   */
  protected applyTool(pInfo: PointerInfo): void {
    if (this.mParticleGroup != null) {
      console.log('Has this.mParticleGroup');
      pInfo.setParticleGroup(this.mParticleGroup);
    } else if (pInfo.getParticleGroup() != null) {
      console.log('Has pInfo.mParticleGroup');
      this.mParticleGroup = pInfo.getParticleGroup();
    }

    super.applyTool(pInfo);
  }

  /**
   * @override
   */
  protected reset(): void {
    this.mParticleGroup = null;
  }
}
