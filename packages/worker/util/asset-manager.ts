export class AssetManager {
  private assets: { [key: string]: string[] } = {
    shaders: [
      'blur.glslf',
      'no_texture.glslf',
      'no_texture.glslv',
      'no_texture_const_color.glslv',
      'particle.glslf',
      'particle.glslv',
      'pointsprite.glslv',
      'screen.glslf',
      'texture.glslf',
      'texture.glslv',
      'water_particle.glslv',
      'x_blur.glslv',
      'y_blur.glslv',
    ],
  };

  list(dir: string): string[] {
    // return fetch(`/${dir}`)
    //   .then((res) => res.json())
    //   .then((res) => res.data);
    return this.assets[dir];
  }
}
