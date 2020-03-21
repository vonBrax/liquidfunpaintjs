import { mat4, vec3 } from 'gl-matrix';
import { ShaderProgram } from './shader/shader-program';
import { Material, AttributeInfo } from './shader/material';
import { Texture } from './shader/texture';
import { Renderer } from './renderer';
// import { Color } from './util/types';
import { state } from './state';
// import { Module } from './util/types';
import { ByteBuffer } from './util/byte-buffer';
import { TypedArray } from './util/wasm-buffer';

// const _module: LFEmscriptenModule = window.Module as LFEmscriptenModule;
// const { Draw } = _module;
// declare const Module: LFEmscriptenModule;

// const Draw: Draw = Module.Draw;

/**
 * @todo
 * Instantiate the Draw class from embind:
 * const DerivedClass = Module.Draw.extend("Draw", {
 *  DrawPolygon: function() {},
 * ...etc
 * })
 *
 * const instance = new DerivedClass();
 */

/**
 * DebugRenderer for LiquidFun, extending the b2Draw class.
 */
export class DebugRenderer {
  private static DEBUG_CAPACITY = 20000;
  private static DEBUG_OPACITY = 0.8;
  private static DEBUG_AXIS_SCALE = 0.3;

  private mTransformFromWorld: mat4 = mat4.create();

  // Shaders, materials, and per-frame buffers for debug drawing
  // We cache all draw*() calls initiated from LiquidFun into buffers, then
  // draw all of them at once in draw() to be more efficient.
  private mPolygonShader: ShaderProgram;
  private mPolygonMaterial: Material;
  private mPolygonPositionBuffer: ByteBuffer;
  private mPolygonColorBuffer: ByteBuffer;
  private mPolygonPositionAttr: AttributeInfo;
  private mPolygonColorAttr: AttributeInfo;

  private mCircleShader: ShaderProgram;
  private mCircleMaterial: Material;
  private mCirclePositionBuffer: ByteBuffer;
  private mCircleColorBuffer: ByteBuffer;
  private mCirclePointSizeBuffer: ByteBuffer;
  private mCirclePositionAttr: AttributeInfo;
  private mCircleColorAttr: AttributeInfo;
  private mCirclePointSizeAttr: AttributeInfo;

  private mLineShader: ShaderProgram;
  private mLineMaterial: Material;
  private mLinePositionBuffer: ByteBuffer;
  private mLineColorBuffer: ByteBuffer;
  private mLinePositionAttr: AttributeInfo;
  private mLineColorAttr: AttributeInfo;

  // public drawFlags: number;

  constructor() {
    // super();
    // const newDraw = new Module.Draw();
    // for (const k in newDraw) {
    //   if (Object.prototype.hasOwnProperty.call(newDraw, k)) {
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //     // @ts-ignore
    //     this[k] = newDraw[k];
    //   } else {
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //     // @ts-ignore
    //     this.__proto__[k] = newDraw[k];
    //   }
    // }
    // // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // // @ts-ignore
    // this.b2Draw = newDraw;
    // console.log(newDraw);
    this.bindMethods();

    // this.mPolygonPositionBuffer = gl.createBuffer();
    this.mPolygonPositionBuffer = new ByteBuffer(DebugRenderer.DEBUG_CAPACITY);
    this.mPolygonPositionBuffer.nativeOrder();
    this.mPolygonPositionBuffer.createGLBuffer();

    // this.mPolygonColorBuffer = gl.createBuffer();
    this.mPolygonColorBuffer = new ByteBuffer(DebugRenderer.DEBUG_CAPACITY);
    this.mPolygonColorBuffer.nativeOrder();
    this.mPolygonColorBuffer.createGLBuffer();

    // this.mCirclePositionBuffer = gl.createBuffer();
    this.mCirclePositionBuffer = new ByteBuffer(DebugRenderer.DEBUG_CAPACITY);
    this.mCirclePositionBuffer.nativeOrder();
    this.mCirclePositionBuffer.createGLBuffer();

    // this.mCircleColorBuffer = gl.createBuffer();
    this.mCircleColorBuffer = new ByteBuffer(DebugRenderer.DEBUG_CAPACITY);
    this.mCircleColorBuffer.nativeOrder();
    this.mCircleColorBuffer.createGLBuffer();

    // this.mCirclePointSizeBuffer = gl.createBuffer();
    this.mCirclePointSizeBuffer = new ByteBuffer(DebugRenderer.DEBUG_CAPACITY);
    this.mCirclePointSizeBuffer.nativeOrder();
    this.mCirclePointSizeBuffer.createGLBuffer();

    // this.mLinePositionBuffer = gl.createBuffer();
    this.mLinePositionBuffer = new ByteBuffer(DebugRenderer.DEBUG_CAPACITY);
    this.mLinePositionBuffer.nativeOrder();
    this.mLinePositionBuffer.createGLBuffer();

    // this.mLineColorBuffer = gl.createBuffer();
    this.mLineColorBuffer = new ByteBuffer(DebugRenderer.DEBUG_CAPACITY);
    this.mLineColorBuffer.nativeOrder();
    this.mLineColorBuffer.createGLBuffer();
  }

  private bindMethods(): void {
    /**
     * @todo:
     * Bind every method to "this" so we don't
     * need to worry with context when the methods
     * are called from c++
     */
    this._addColorToBuffer = this._addColorToBuffer.bind(this);
    this.addColorToBuffer = this.addColorToBuffer.bind(this);
    this.DrawPolygon = this.DrawPolygon.bind(this);
    this.DrawSolidPolygon = this.DrawSolidPolygon.bind(this);
    this.DrawCircle = this.DrawCircle.bind(this);
    this.DrawSolidCircle = this.DrawSolidCircle.bind(this);
    this.DrawParticles = this.DrawParticles.bind(this);
    this.addSegmentPoint = this.addSegmentPoint.bind(this);
    this.DrawSegment = this.DrawSegment.bind(this);
    this.DrawTransform = this.DrawTransform.bind(this);
  }

  // Helper functions for adding color to a ByteBuffer
  private _addColorToBuffer(
    buffer: ByteBuffer,
    r: number,
    g: number,
    b: number,
  ): void {
    // const data = [r, g, b, DebugRenderer.DEBUG_OPACITY];
    // const gl: WebGL2RenderingContext = state.get(
    //   'context',
    // ) as WebGL2RenderingContext;
    // gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
    buffer.put(r * 255);
    buffer.put(g * 255);
    buffer.put(b * 255);
    buffer.put(DebugRenderer.DEBUG_OPACITY * 255);
    if (!r) {
      console.log('FUCK!');
      console.log(r);
    }
  }

  private addColorToBuffer(buffer: ByteBuffer, color: Color): void {
    this._addColorToBuffer(buffer, color.r, color.g, color.b);
  }

  // Override
  public DrawPolygon(
    // vertices: number[],
    vertices: Vec2[] | number | TypedArray,
    vertexCount: number,
    color: Color,
  ): void {
    console.assert(vertexCount === 4, 'Invalid vertexCount, investigate');
    // This is equivalent to drawing lines with the same color at each
    // vertex
    const elementSize = 8; // bytes. We are dealing with 2 floats per vertex
    if (!Array.isArray(vertices)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const ptr = vertices.$$.ptr;
      // const view = new Float32Array(Module.HEAPU8.buffer, ptr, vertexCount);
      // const view = getValue(ptr)
      const temp = [];
      for (let i = 0; i < vertexCount; i++) {
        // Hopefully we will get the pointer that points to
        // the vec2 object
        // const vec: Vec2 = (getValue(ptr + i * 4, 'i32') as unknown) as Vec2;
        // temp.push(vec.x);
        // temp.push(vec.y);
        temp.push(getValue(ptr + i * 4 + i * 4, 'float'));
        temp.push(getValue(ptr + i * 4 + (i * 4 + 4), 'float'));
      }
      vertices = new Float32Array(temp);
    }
    this.mLinePositionBuffer.put(
      vertices as Float32Array,
      0 * elementSize,
      elementSize,
    );
    this.mLinePositionBuffer.put(
      vertices as Float32Array,
      1 * elementSize,
      elementSize,
    );

    this.mLinePositionBuffer.put(
      vertices as Float32Array,
      1 * elementSize,
      elementSize,
    );
    this.mLinePositionBuffer.put(
      vertices as Float32Array,
      2 * elementSize,
      elementSize,
    );

    this.mLinePositionBuffer.put(
      vertices as Float32Array,
      2 * elementSize,
      elementSize,
    );
    this.mLinePositionBuffer.put(
      vertices as Float32Array,
      3 * elementSize,
      elementSize,
    );

    this.mLinePositionBuffer.put(
      vertices as Float32Array,
      3 * elementSize,
      elementSize,
    );
    this.mLinePositionBuffer.put(
      vertices as Float32Array,
      0 * elementSize,
      elementSize,
    );

    const addColorToBuffer =
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      this.addColorToBuffer || this.jsObj.addColorToBuffer;

    for (let i = 0; i < 8; ++i) {
      addColorToBuffer(this.mLineColorBuffer, color);
    }
  }

  // @Override
  public DrawSolidPolygon(
    // vertices: number[],
    vertices: Vec2[] | number | TypedArray,
    vertexCount: number,
    color: Color,
  ): void {
    console.assert(vertexCount === 4, 'Invalid vertexCount, investigate.');
    if (!Array.isArray(vertices)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const ptr = vertices.$$.ptr;
      const temp = [];
      for (let i = 0; i < vertexCount; i++) {
        // Hopefully we will get the pointer that points to
        // the vec2 object
        // const vec: Vec2 = (getValue(ptr + i * 4, 'i32') as unknown) as Vec2;
        // temp.push(vec.x);
        // temp.push(vec.y);
        temp.push(getValue(ptr + i * 4 + i * 4, 'float'));
        temp.push(getValue(ptr + i * 4 + (i * 4 + 4), 'float'));
      }
      vertices = new Float32Array(temp);
    }
    // Create 2 triangles from the vertices. Not using TRIANGLE_FAN due to
    // batching. Could optimize using TRIANGLE_STRIP.
    // 0, 1, 2, 3 -> (0, 1, 2), (0, 2, 3)
    const elementSize = 8; // We are dealing with 2 floats per vertex

    this.mPolygonPositionBuffer.put(
      vertices as Float32Array,
      0 * elementSize,
      elementSize,
    );
    this.mPolygonPositionBuffer.put(
      vertices as Float32Array,
      1 * elementSize,
      elementSize,
    );
    this.mPolygonPositionBuffer.put(
      vertices as Float32Array,
      2 * elementSize,
      elementSize,
    );

    this.mPolygonPositionBuffer.put(
      vertices as Float32Array,
      0 * elementSize,
      elementSize,
    );
    this.mPolygonPositionBuffer.put(
      vertices as Float32Array,
      2 * elementSize,
      elementSize,
    );
    this.mPolygonPositionBuffer.put(
      vertices as Float32Array,
      3 * elementSize,
      elementSize,
    );

    const addColorToBuffer =
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      this.addColorToBuffer || this.jsObj.addColorToBuffer;

    for (let i = 0; i < 6; ++i) {
      addColorToBuffer(this.mPolygonColorBuffer, color);
    }
  }

  // @Override
  public DrawCircle(center: Vec2, radius: number, color: Color): void {
    console.log('draw circle');
    this.mCirclePositionBuffer.putFloat(center.x);
    this.mCirclePositionBuffer.putFloat(center.y);
    console.log(center.x, center.y);

    const addColorToBuffer =
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      this.addColorToBuffer || this.jsObj.addColorToBuffer;

    addColorToBuffer(this.mCircleColorBuffer, color);

    const pointSize = Math.max(
      1.0,
      Renderer.getInstance().sScreenWidth *
        ((2.0 * radius) / Renderer.getInstance().sRenderWorldWidth),
    );

    this.mCirclePointSizeBuffer.putFloat(pointSize);
  }

  // @Override
  public DrawSolidCircle(
    center: Vec2,
    radius: number,
    axis: Vec2,
    color: Color,
  ): void {
    console.log('Draw solid circle');
    this.DrawCircle(center, radius, color);

    // Draw the axis line
    const centerX = center.x;
    const centerY = center.y;
    this.addSegmentPoint(centerX, centerY, color.r, color.g, color.b);
    this.addSegmentPoint(
      // centerX + radius * axis[0],
      centerX + radius * axis.x,
      // centerY + radius * axis[1],
      centerY + radius * axis.y,
      color.r,
      color.g,
      color.b,
    );
  }

  // @Override
  public DrawParticles(
    centers: Vec2[] | number | TypedArray,
    radius: number,
    colors: ParticleColor[] | number | TypedArray,
    count: number,
  ): void {
    if (!Array.isArray(centers) && !Array.isArray(colors)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const ptr = centers.$$.ptr;
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const ptrColors = colors.$$.ptr;
      const temp = [];
      const tempColors = [];

      for (let i = 0; i < count; i++) {
        // Hopefully we will get the pointer that points to
        // the vec2 object
        // const vec: Vec2 = (getValue(ptr + i * 4, 'float') as unknown) as Vec2;
        temp.push(getValue(ptr + i * 4 + i * 4, 'float'));
        temp.push(getValue(ptr + i * 4 + (i * 4 + 4), 'float'));

        // console.log(vec);
        // temp.push(vec.x);
        // temp.push(vec.y);
        tempColors.push(getValue(ptrColors + i, 'i8'));
      }
      centers = new Float32Array(temp);
      colors = new Uint8Array(tempColors);
    }
    // const _centers: ArrayBufferView = centers as ArrayBufferView;
    // const _colors: ArrayBufferView = colors as ArrayBufferView;

    // console.log('%c ==== BEFORE ==== ', 'color: blue');
    // console.log(centers);
    // Draw them as circles
    this.mCirclePositionBuffer.put(centers as Float32Array);
    this.mCircleColorBuffer.put(colors as Uint8Array);

    // console.log('%c ==== AFTER ==== ', 'color: green');
    // console.log(new Float32Array(this.mCirclePositionBuffer.getRawBuffer()));

    const pointSize = Math.max(
      1.0,
      Renderer.getInstance().sScreenWidth *
        ((2.0 * radius) / Renderer.getInstance().sRenderWorldWidth),
    );
    // console.log(Renderer.getInstance().sScreenWidth);
    // console.log(Renderer.getInstance().sRenderWorldWidth);

    for (let i = 0; i < count; ++i) {
      this.mCirclePointSizeBuffer.putFloat(pointSize);
    }
  }

  // Helper function for drawSegment to avoid making too many native objects
  private addSegmentPoint(
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
  ): void {
    this.mLinePositionBuffer.putFloat(x);
    this.mLinePositionBuffer.putFloat(y);
    this._addColorToBuffer(this.mLineColorBuffer, r, g, b);
  }

  // @Override
  public DrawSegment(p1: Vec2, p2: Vec2, color: Color): void {
    const { r, g, b } = color;

    this.addSegmentPoint(p1.x, p1.y, r, g, b);
    this.addSegmentPoint(p2.x, p2.y, r, g, b);
  }

  // @Override
  public DrawTransform(xf: Transform): void {
    // const posX = xf.getPositionX();
    const posX = xf.p.x;
    const posY = xf.GetPositionY();

    const sine = xf.GetRotationSin();
    const cosine = xf.GetRotationCos();

    // X axis -- see b2Vec2::GetXAxis()
    this.addSegmentPoint(posX, posY, 1.0, 0.0, 0.0);
    this.addSegmentPoint(
      posX + DebugRenderer.DEBUG_AXIS_SCALE * cosine,
      posY + DebugRenderer.DEBUG_AXIS_SCALE * sine,
      1.0,
      0.0,
      0.0,
    );

    // Y axis -- see b2Vec2::GetYAxis()
    this.addSegmentPoint(posX, posY, 0.0, 1.0, 0.0);
    this.addSegmentPoint(
      posX + DebugRenderer.DEBUG_AXIS_SCALE * -sine,
      posY + DebugRenderer.DEBUG_AXIS_SCALE * cosine,
      0.0,
      1.0,
      0.0,
    );
  }

  public draw(): void {
    const world: World = Renderer.getInstance().acquireWorld();
    try {
      this.resetAllBuffers();

      // This captures everything we need to draw into buffers
      world.DrawDebugData();

      const gl: WebGL2RenderingContext = state.get(
        'context',
      ) as WebGL2RenderingContext;

      // const buffers = state.get('frameBuffers');
      // if (buffers) {
      //   gl.bindFramebuffer(gl.FRAMEBUFFER, buffers[0]);
      // }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(
        0,
        0,
        Renderer.getInstance().sScreenWidth,
        Renderer.getInstance().sScreenHeight,
      );
      this.drawPolygons(this.mTransformFromWorld);
      this.drawCircles(this.mTransformFromWorld);
      this.drawSegments(this.mTransformFromWorld);
    } finally {
      Renderer.getInstance().releaseWorld();
    }
  }

  private drawPolygons(transformFromWorld: mat4): void {
    this.mPolygonMaterial.beginRender();

    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    /**
     * @todo:
     * The following functions calculate the number of elements
     * based on the current buffer position and then dividing
     * by the size of the element * 4. Ex: if buffer is in position
     * 16 and each element has 2 bytes, then the element count is
     * 16 / (2 * 4) = 2.
     * Our implementation here is incorrect (it reads the size of the
     * whole buffer in bytes instead).
     */
    // const numElements: number =
    //   gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE) / (4 * 2);
    const numElements = this.mPolygonPositionBuffer.position() / (4 * 2);

    this.mPolygonMaterial.setVertexAttributeBuffer(
      this.mPolygonPositionAttr,
      this.mPolygonPositionBuffer.glBuffer,
      0,
      new Float32Array(this.mPolygonPositionBuffer.getRawBuffer()),
    );
    this.mPolygonMaterial.setVertexAttributeBuffer(
      this.mPolygonColorAttr,
      this.mPolygonColorBuffer.glBuffer,
      0,
      new Uint8Array(this.mPolygonColorBuffer.getRawBuffer()),
    );

    // Set uniforms
    gl.uniformMatrix4fv(
      this.mPolygonMaterial.getUniformLocation('uTransform'),
      false,
      transformFromWorld,
    );

    gl.drawArrays(gl.TRIANGLES, 0, numElements);

    this.mPolygonMaterial.endRender();
  }

  private drawCircles(transformFromWorld: mat4): void {
    this.mCircleMaterial.beginRender();

    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const numElements = this.mCirclePointSizeBuffer.position() / 4;
    const positionBuffer = new Float32Array(
      this.mCirclePositionBuffer.getRawBuffer(),
    );
    const colorBuffer = new Uint8Array(this.mCircleColorBuffer.getRawBuffer());
    const pointSizeBuffer = new Float32Array(
      this.mCirclePointSizeBuffer.getRawBuffer(),
    );

    const msg = `
      {
        "position": [${positionBuffer[0]},${positionBuffer[1]},${positionBuffer[2]},${positionBuffer[3]},${positionBuffer[4]}],
        "color": [${colorBuffer[0]},${colorBuffer[1]},${colorBuffer[2]},${colorBuffer[3]},${colorBuffer[4]}],
        "pointSize": [${pointSizeBuffer[0]},${pointSizeBuffer[1]},${pointSizeBuffer[2]},${pointSizeBuffer[3]},${pointSizeBuffer[4]}]
      }
    `;
    // console.log(JSON.parse(msg));
    // eslint-disable-next-line
    // @ts-ignore
    this.timeoutID =
      // eslint-disable-next-line
    // @ts-ignore
      this.timeoutID ||
      setTimeout(() => {
        console.clear();
        // eslint-disable-next-line
    // @ts-ignore
        this.timeoutID = null;
      }, 30000);

    this.mCircleMaterial.setVertexAttributeBuffer(
      this.mCirclePositionAttr,
      this.mCirclePositionBuffer.glBuffer,
      0,
      // new Float32Array(this.mCirclePositionBuffer.getRawBuffer()),
      positionBuffer,
    );
    this.mCircleMaterial.setVertexAttributeBuffer(
      this.mCircleColorAttr,
      this.mCircleColorBuffer.glBuffer,
      0,
      this.mCircleColorBuffer.getRawBuffer(),
      true,
    );
    // console.log(new Uint8Array(this.mCircleColorBuffer.getRawBuffer()))
    this.mCircleMaterial.setVertexAttributeBuffer(
      this.mCirclePointSizeAttr,
      this.mCirclePointSizeBuffer.glBuffer,
      0,
      // new Float32Array(this.mCirclePointSizeBuffer.getRawBuffer()),
      pointSizeBuffer,
    );

    // Set uniforms
    gl.uniformMatrix4fv(
      this.mCircleMaterial.getUniformLocation('uTransform'),
      false,
      transformFromWorld,
    );

    gl.drawArrays(gl.POINTS, 0, numElements);

    this.mCircleMaterial.endRender();
  }

  private drawSegments(transformFromWorld: mat4): void {
    this.mLineMaterial.beginRender();

    const gl: WebGL2RenderingContext = state.get(
      'context',
    ) as WebGL2RenderingContext;
    const numElements = this.mLinePositionBuffer.position() / (4 * 2);

    this.mLineMaterial.setVertexAttributeBuffer(
      this.mLinePositionAttr,
      this.mLinePositionBuffer.glBuffer,
      0,
      new Float32Array(this.mLinePositionBuffer.getRawBuffer()),
    );
    this.mLineMaterial.setVertexAttributeBuffer(
      this.mLineColorAttr,
      this.mLineColorBuffer.glBuffer,
      0,
      new Uint8Array(this.mLineColorBuffer.getRawBuffer()),
    );

    // Set uniforms
    gl.uniformMatrix4fv(
      this.mLineMaterial.getUniformLocation('uTransform'),
      false,
      transformFromWorld,
    );

    gl.drawArrays(gl.LINES, 0, numElements);

    this.mLineMaterial.endRender();
  }

  public onSurfaceChanged(): void {
    mat4.fromTranslation(this.mTransformFromWorld, vec3.fromValues(-1, -1, 0));
    mat4.scale(
      this.mTransformFromWorld,
      this.mTransformFromWorld,
      vec3.fromValues(
        2.0 / Renderer.getInstance().sRenderWorldWidth,
        2.0 / Renderer.getInstance().sRenderWorldHeight,
        1.0,
      ),
    );
  }

  public onSurfaceCreated(/* context: Context */): void {
    // Create all the debug materials we need
    this.mPolygonShader = new ShaderProgram(
      'no_texture.glslv',
      'no_texture.glslf',
    );

    this.mPolygonMaterial = new Material(this.mPolygonShader);
    this.mPolygonPositionAttr = this.mPolygonMaterial.addAttribute(
      'aPosition',
      2,
      Material.AttrComponentType.FLOAT(),
      4,
      false,
      0,
    );
    this.mPolygonColorAttr = this.mPolygonMaterial.addAttribute(
      'aColor',
      4,
      Material.AttrComponentType.UNSIGNED_BYTE(),
      1,
      true,
      0,
    );

    this.mPolygonMaterial.setBlendFunc(
      Material.BlendFactor.SRC_ALPHA(),
      Material.BlendFactor.ONE_MINUS_SRC_ALPHA(),
    );

    // Instead of making line segments for circles, we use a texture to allow
    // for higher performance
    this.mCircleShader = new ShaderProgram(
      'pointsprite.glslv',
      'particle.glslf',
    );

    this.mCircleMaterial = new Material(this.mCircleShader);
    this.mCirclePositionAttr = this.mCircleMaterial.addAttribute(
      'aPosition',
      2,
      Material.AttrComponentType.FLOAT(),
      4,
      false,
      0,
    );
    this.mCircleColorAttr = this.mCircleMaterial.addAttribute(
      'aColor',
      4,
      Material.AttrComponentType.UNSIGNED_BYTE(),
      1,
      true,
      0,
    );
    this.mCirclePointSizeAttr = this.mCircleMaterial.addAttribute(
      'aPointSize',
      1,
      Material.AttrComponentType.FLOAT(),
      4,
      false,
      0,
    );

    this.mCircleMaterial.setBlendFunc(
      Material.BlendFactor.SRC_ALPHA(),
      Material.BlendFactor.ONE_MINUS_SRC_ALPHA(),
    );
    this.mCircleMaterial.addTexture(
      'uDiffuseTexture',
      new Texture(
        // context, R.drawable.debug_circle
        { assetName: 'debug_circle.png' },
      ),
    );

    this.mLineShader = new ShaderProgram(
      'no_texture.glslv',
      'no_texture.glslf',
    );

    this.mLineMaterial = new Material(this.mLineShader);
    this.mLinePositionAttr = this.mLineMaterial.addAttribute(
      'aPosition',
      2,
      Material.AttrComponentType.FLOAT(),
      4,
      false,
      0,
    );
    this.mLineColorAttr = this.mLineMaterial.addAttribute(
      'aColor',
      4,
      Material.AttrComponentType.UNSIGNED_BYTE(),
      1,
      true,
      0,
    );

    this.mLineMaterial.setBlendFunc(
      Material.BlendFactor.SRC_ALPHA(),
      Material.BlendFactor.ONE_MINUS_SRC_ALPHA(),
    );
  }

  private resetAllBuffers(): void {
    this.mPolygonPositionBuffer.clear();
    this.mPolygonColorBuffer.clear();

    this.mCirclePositionBuffer.clear();
    this.mCircleColorBuffer.clear();
    this.mCirclePointSizeBuffer.clear();

    this.mLinePositionBuffer.clear();
    this.mLineColorBuffer.clear();
  }
}

// Object.assign(DebugRenderer.prototype, Module.Draw);
// Object.setPrototypeOf(this, Module.Draw.prototype);
