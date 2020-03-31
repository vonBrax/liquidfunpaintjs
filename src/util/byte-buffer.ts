import { state } from '../state';
import { TypedArray } from './wasm-buffer';

export class ByteBuffer {
  public glBuffer: WebGLBuffer;
  private buffer: ArrayBuffer;
  private view: DataView;
  private cursor = -1;
  private hostEndianness: string;
  private isLittleEndian = false;
  private limit = -1;
  private pointer: number;
  private byteLength = 0;

  constructor(size: number) {
    this.limit = size;
    this.buffer = new ArrayBuffer(size);
    this.view = new DataView(this.buffer);
    this.cursor = 0;
    this.hostEndianness = this.getEndianness();
  }

  nativeOrder(): void {
    this.isLittleEndian = this.hostEndianness === 'LE';
  }

  createGLBuffer(): void {
    const gl = state.get('context') as WebGLRenderingContext;
    this.glBuffer = gl.createBuffer();
  }

  createEmbindBuffer(): void {
    this.pointer = Module._malloc(this.limit);
  }

  copyEmbindBuffer(): void {
    this.put(Module.HEAPU8, this.pointer, this.limit);
  }

  sendToEmbind(): void {
    const byteBuffer = new Float32Array(
      this.buffer.slice(this.cursor, this.byteLength),
    );
    const embind = new Float32Array(
      Module.HEAPU8.buffer,
      this.pointer,
      byteBuffer.length,
    );

    console.assert(
      byteBuffer.length === embind.length,
      'Something wrong cloning buffers',
    );
    for (let i = 0; i < embind.length; i++) {
      embind[i] = byteBuffer[i];
    }
  }

  destroyEmbindBuffer(): void {
    Module._free(this.pointer);
  }

  getFloat(): number {
    const value = this.view.getFloat32(this.cursor, this.isLittleEndian);
    this.cursor += 4;
    return value;
  }

  getLimit(): number {
    return this.limit;
  }

  getRawBuffer(): ArrayBuffer {
    return this.buffer;
  }

  getPointer(): number {
    return this.pointer;
  }

  getSize(): number {
    return this.byteLength;
  }

  put(
    src: number | Array<number> | TypedArray,
    offset?: number,
    length?: number,
  ): void {
    // const srcLength = typeof src === 'number' ? 1 : src.length;
    const dataSrc =
      typeof src === 'number' ? [src] : Array.isArray(src) ? src : src.buffer;
    const data = new Uint8Array(dataSrc);

    if (offset !== undefined) {
      if (offset < 0 || offset > data.length) {
        throw new Error('Invalid offset: ' + offset);
      }
    } else {
      offset = 0;
    }

    if (length !== undefined) {
      if (length < 0 || length > data.length - offset) {
        throw new Error('Invalid length: ' + length);
      }
    } else {
      length = data.length - offset;
    }

    for (let i = offset; i < offset + length; i++) {
      this.view.setUint8(this.cursor, data[i]);
      this.cursor += 1;
      this.byteLength += 1;
    }
  }

  putFloat(float: number): void;
  putFloat(index: number, float: number): void;
  putFloat(index: number, float?: number): void {
    if (float === undefined) {
      // Method was called with a value only, no index.
      // The first variable "index" will contain the
      // float value;
      float = index;
      index = this.cursor;
    }
    this.view.setFloat32(index, float, this.isLittleEndian);
    this.cursor += 4;
    this.byteLength += 4;
  }

  position(): number;
  position(index: number): void;
  position(index?: number): number | void {
    if (index !== undefined) {
      this.cursor = index;
      return;
    }
    return this.cursor;
  }

  setSize(bytes: number): void {
    if (bytes < 0 || bytes > this.limit) {
      throw new Error('Invalid size: "' + bytes + '" for limit ' + this.limit);
    }
    this.byteLength = bytes;
  }

  slice(): ArrayBuffer {
    return this.buffer.slice(this.cursor);
  }

  clear(): void {
    this.cursor = 0;
    this.byteLength = 0;
  }

  rewind(): void {
    this.cursor = 0;
  }

  private getEndianness(): string {
    const b = new ArrayBuffer(4);
    const a = new Uint32Array(b);
    const c = new Uint8Array(b);

    a[0] = 0xdeadbeef;

    if (c[0] === 0xef) {
      return 'LE';
    }
    if (c[0] === 0xde) {
      return 'BE';
    }

    throw new Error('Unknown endianness');
  }
}
