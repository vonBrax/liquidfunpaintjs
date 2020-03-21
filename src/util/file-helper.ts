// import * as fs from 'fs';

export class FileHelper {
  public static async loadAsset(fileName: string): Promise<string> {
    let fileContent = null;
    try {
      fileContent = await fetch(`/static/${fileName}`).then(res => res.text());
    } catch (ex) {
      console.error(ex);
      return null;
    }
    return fileContent;
  }

  public static async loadBitmap(fileName: string): Promise<HTMLImageElement> {
    // try {
    //   const imageBlob: Blob = await fetch(`/static/${fileName}`).then(res =>
    //     res.blob(),
    //   );
    //   return createImageBitmap(imageBlob);
    // } catch (ex) {
    //   console.error(ex);
    //   return null;
    // }
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = function() {
        resolve(image);
      };
      image.onerror = function(e) {
        reject(e);
      };
      image.src = `/static/${fileName}`;
    });
  }
}
