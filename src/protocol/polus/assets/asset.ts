import { AssetDeclaration, AssetType } from "../../../types/assetBundleDeclaration";
import { AssetBundle } from "./assetBundle";

export class Asset {
  constructor(protected readonly bundle: AssetBundle, protected readonly declaration: AssetDeclaration) {}

  getBundle(): AssetBundle {
    return this.bundle;
  }

  getId(): number {
    return this.declaration.id;
  }

  getPath(): string[] {
    return this.declaration.path.split("/");
  }

  getType(): AssetType {
    return this.declaration.type;
  }
}
