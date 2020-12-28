// import * as fs from 'fs';

export class FileHelper {
  public static async loadAsset(fileName: string): Promise<string> {
    let fileContent = null;
    try {
      fileContent = await fetch(`/${fileName}`).then((res) => res.text());
    } catch (ex) {
      console.error(ex);
      return null;
    }
    return fileContent;
  }

  public static async loadBitmap(fileName: string): Promise<CanvasImageSource> {
    // public static async loadBitmap(fileName: string): Promise<HTMLImageElement> {
    // try {
    //   const imageBlob: Blob = await fetch(`/static/${fileName}`).then(res =>
    //     res.blob(),
    //   );
    //   return createImageBitmap(imageBlob);
    // } catch (ex) {
    //   console.error(ex);
    //   return null;
    // }
    // return this.loadAndPreMultiplyAlpha(fileName);
    const imageBlob = await fetch(`/${fileName}`).then((r) => r.blob());
    // const img = await createImageBitmap(imageBlob);
    // return img;
    return createImageBitmap(imageBlob);

    // return new Promise((resolve, reject) => {
    //   const image = new Image();
    //   image.onload = function (): void {
    //     resolve(image);
    //   };
    //   image.onerror = function (e: Event): void {
    //     reject(e);
    //   };
    //   image.src = `/static/${fileName}`;
    // });
  }

  /**
   * @todo
   * Premultiplying alpha should not be done client side.
   * Replace image assets and remove this.
   */

  public static async loadAndPreMultiplyAlpha(
    fileName: string,
  ): Promise<CanvasImageSource> {
    console.log('Premultiplying: ' + fileName);
    const imageBlob = await fetch(`/${fileName}`).then((r) => r.blob());
    const img = await createImageBitmap(imageBlob);
    const canvas = new OffscreenCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      const preR = Math.min((a / 255) * r, 255);
      const preG = Math.min((a / 255) * g, 255);
      const preB = Math.min((a / 255) * b, 255);
      data[i] = preR;
      data[i + 1] = preG;
      data[i + 2] = preB;
    }

    ctx.putImageData(imgData, 0, 0);
    const newImageBlob = await canvas.convertToBlob();
    const newImage = await createImageBitmap(newImageBlob);
    return newImage;
    // canvas.convertToBlob().then((blob) => {
    //   const dataUrl = new FileReaderSync().readAsDataURL(blob);
    //   // newImg.src = canvas.toDataURL();
    //   newImg.src = dataUrl;
    // });

    // return new Promise((resolve, reject) => {
    //   // const canvas = document.createElement('canvas');
    //   const canvas = new OffscreenCanvas(0, 0);
    //   const ctx = canvas.getContext('2d');
    //   const image: HTMLImageElement = new Image();
    //   image.onload = function (): void {
    //     const w = image.naturalWidth || image.width;
    //     const h = image.naturalHeight || image.height;
    //     canvas.width = w;
    //     canvas.height = h;
    //     canvas.style.width = w + 'px';
    //     canvas.style.height = h + 'px';
    //     ctx.drawImage((image as unknown) as CanvasImageSource, 0, 0);
    //     const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //     const data = imgData.data;

    //     for (let i = 0; i < data.length; i += 4) {
    //       const r = data[i];
    //       const g = data[i + 1];
    //       const b = data[i + 2];
    //       const a = data[i + 3];
    //       const preR = Math.min((a / 255) * r, 255);
    //       const preG = Math.min((a / 255) * g, 255);
    //       const preB = Math.min((a / 255) * b, 255);
    //       data[i] = preR;
    //       data[i + 1] = preG;
    //       data[i + 2] = preB;
    //     }

    //     ctx.putImageData(imgData, 0, 0);

    //     const newImg = new Image();
    //     newImg.onload = function (): void {
    //       resolve(newImg);
    //     };

    //     image.onerror = function (e: Event): void {
    //       reject(e);
    //     };

    //     canvas.convertToBlob().then((blob) => {
    //       const dataUrl = new FileReaderSync().readAsDataURL(blob);
    //       // newImg.src = canvas.toDataURL();
    //       newImg.src = dataUrl;
    //     });
    //   };

    //   // image.src = `/static/${fileName}`;
    // });
  }
}
