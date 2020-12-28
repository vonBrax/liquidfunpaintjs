export type JSONPrimitive = string | number | boolean | null;
export type JSONArray = JSONValue[];
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONValue };

declare global {
  interface EmscriptenModule {
    Draw: typeof LiquidFun.Draw;
    cwrap: typeof cwrap;
    Vec2: typeof Vec2;
    World: typeof LiquidFun.World;
    ParticleColor: typeof LiquidFun.ParticleColor;
    ParticleFlag: typeof LiquidFun.ParticleFlag;
    ParticleGroupDef: typeof LiquidFun.ParticleGroupDef;
    ParticleGroupFlag: typeof LiquidFun.ParticleGroupFlag;
    ParticleSystemDef: typeof LiquidFun.ParticleSystemDef;
    BodyDef: typeof LiquidFun.BodyDef;
    CircleShape: typeof CircleShape;
    PolygonShape: typeof PolygonShape;
    Transform: typeof Transform;
    canvas: HTMLCanvasElement;
    customMessageQueue?: MessageEvent[];
    getValue: (ptr: number, type: string) => number;
    postMessage: Worker['postMessage'];
  }
}

export interface Caipps {
  module?: EmscriptenModule;
  canvas?: HTMLCanvasElement;
  context?: WebGLRenderingContext;
  init?(canvas: HTMLCanvasElement): void;
}
