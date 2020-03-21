import { state } from '../state';
import { TypedArray } from './wasm-buffer';

export class ByteBuffer {
  public glBuffer: WebGLBuffer;
  private buffer: ArrayBuffer;
  private view: DataView;
  private cursor = -1;
  private hostEndianness: string;
  private isLittleEndian = false;

  constructor(size: number) {
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

  getRawBuffer(): ArrayBuffer {
    return this.buffer;
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
    }
  }

  putFloat(float: number): void {
    this.view.setFloat32(this.cursor, float, this.isLittleEndian);
    this.cursor += 4;
  }

  position(): number {
    return this.cursor;
  }

  clear(): void {
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
