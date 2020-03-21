export type JSONPrimitive = string | number | boolean | null;
export type JSONArray = JSONValue[];
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONValue };

// export interface ClassHandle<T, U> {
//   clone(): T;
//   delete(): void;
//   deleteLater(): T;
//   isAliasOf(otherClass: U): boolean;
//   isDeleted(): boolean;
// }

declare global {
  interface EmscriptenModule {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Draw: typeof Draw;
    cwrap: typeof cwrap;
    Vec2: typeof Vec2;
    World: typeof World;
    ParticleColor: typeof ParticleColor;
    ParticleFlag: typeof ParticleFlag;
    ParticleGroupDef: typeof ParticleGroupDef;
    ParticleGroupFlag: typeof ParticleGroupFlag;
    ParticleSystemDef: typeof ParticleSystemDef;
    BodyDef: typeof BodyDef;
    CircleShape: typeof CircleShape;
    PolygonShape: typeof PolygonShape;
    Transform: typeof Transform;
  }
}

// export interface LFEmscriptenModule extends EmscriptenModule {
//   // eslint-disable-next-line no-undef
//   cwrap: typeof cwrap;
//   Draw: typeof Draw;
// }

// export declare let Module: LFEmscriptenModule;

export interface Caipps {
  // module: LFEmscriptenModule;
  module: EmscriptenModule;
  canvas: HTMLCanvasElement;
  context: WebGLRenderingContext;

  init(canvas: HTMLCanvasElement): Promise<void>;
}
