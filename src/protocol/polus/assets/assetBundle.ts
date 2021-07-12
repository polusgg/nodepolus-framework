import { AssetBundleDeclaration } from "../../../types/assetBundleDeclaration";
import { Asset } from "./asset";
import got from "got";

const prefixUrl = "https://client-assetbundles.polus.gg";
const fetchAssetBundleApi = got.extend({ prefixUrl });

export class AssetBundle {
  protected static readonly cache: Map<string, AssetBundle> = new Map();
  protected readonly contents: Asset[] = [];

  protected constructor(protected readonly declaration: AssetBundleDeclaration, protected readonly address: string) {
    for (let i = 0; i < declaration.assets.length; i++) {
      const assetDeclaration = declaration.assets[i];

      assetDeclaration.id = declaration.assetBundleId + 1 + i;
      this.contents.push(new Asset(this, assetDeclaration));
    }
  }

  static async load(fileName: string): Promise<AssetBundle> {
    if (this.cache.has(fileName)) {
      return this.cache.get(fileName)!;
    }

    const { body } = await fetchAssetBundleApi<string>(`${fileName}/${fileName}.json`);

    const bundle = new AssetBundle(JSON.parse(body) as AssetBundleDeclaration, `${prefixUrl}/${fileName}/${fileName}`);

    this.cache.set(fileName, bundle);

    return bundle;
  }

  static loadFromCache(fileName: string): AssetBundle | undefined {
    return this.cache.get(fileName)!;
  }

  static loadSafeFromCache(fileName: string): AssetBundle {
    const res = this.loadFromCache(fileName);

    if (res === undefined) {
      throw new Error("Attempted to load asset bundle from cache, that was not cached");
    }

    return res;
  }

  getId(): number {
    return this.declaration.assetBundleId;
  }

  getContents(): Asset[] {
    return this.contents;
  }

  getAsset(...path: string[]): Asset | undefined {
    const pathFormatted = path.join("/");

    for (let i = 0; i < this.contents.length; i++) {
      const asset = this.contents[i];

      if (asset.getPath().join("/") === pathFormatted) {
        return asset;
      }
    }
  }

  getSafeAsset(...path: string[]): Asset {
    const result = this.getAsset(...path);

    if (result !== undefined) {
      return result;
    }

    throw new Error(`Could not find asset: ${path.join("/")}`);
  }

  readDirectory(...path: string[]): string[] {
    const result: string[][] = [];

    for (let i = 0; i < this.contents.length; i++) {
      const asset = this.contents[i];
      const assetPath = asset.getPath();

      let thisAssetValid = true;

      for (let j = 0; j < assetPath.length; j++) {
        if (assetPath[j] !== path[j]) {
          thisAssetValid = false;
          break;
        }
      }

      if (thisAssetValid) {
        result.push(assetPath);
      }
    }

    return [...new Set(result.map(r => r[0]))];
  }

  getAddress(): string {
    return this.address;
  }

  getHash(): string {
    return this.declaration.hash;
  }
}
