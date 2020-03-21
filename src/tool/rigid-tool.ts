import { Tool, ToolType, ParticleFlag, ParticleGroupFlag } from './tool';

/**
 * Rigid tool
 * We create particle groups per draw, and join them so they act in one piece.
 */
export class RigidTool extends Tool {
  constructor() {
    super(ToolType.RIGID);
    super.registerTool(ToolType.RIGID, this);
    this.mParticleFlags = ParticleFlag.repulsiveParticle;
    this.mParticleGroupFlags =
      ParticleGroupFlag.rigidParticleGroup |
      ParticleGroupFlag.solidParticleGroup;
  }
}
