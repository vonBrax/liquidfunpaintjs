declare interface FindContactCheck {
  particleIndex: number;
  comparatorIndex: number;
}

declare interface FindContactInput {
  proxyIndex: number;
  position: Vec2;
}

// enum { NUM_V32_SLOTS = 4 };

// eslint-disable-next-line @typescript-eslint/camelcase
declare function CalculateTags_Simd(
  positions: Vec2,
  count: number,
  inverseDiameter: number,
  outTags: number,
): number;

// eslint-disable-next-line @typescript-eslint/camelcase
declare function FindContactsFromChecks_Simd(
  reordered: FindContactInput,
  checks: FindContactCheck,
  numChecks: number,
  particleDiameterSq: number,
  particleDiameterInv: number,
  flags: number,
  contacts: GrowableBuffer<ParticleContact>,
): void;
