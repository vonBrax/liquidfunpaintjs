export type JSONPrimitive = string | number | boolean | null;
export type JSONArray = JSONValue[];
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONValue };

declare global {
  interface EmscriptenModule {
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
    canvas: HTMLCanvasElement;
    customMessageQueue?: MessageEvent[];
  }
}

export interface Caipps {
  module?: EmscriptenModule;
  canvas?: HTMLCanvasElement;
  context?: WebGLRenderingContext;
  init?(canvas: HTMLCanvasElement): void;
}
