export class AssetManager {
  list(dir: string): Promise<string[]> {
    return fetch(`/${dir}`)
      .then(res => res.json())
      .then(res => res.data);
  }
}
