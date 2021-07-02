import { AudioAssetDeclaration } from "../../../types/assetBundleDeclaration";
import { Asset } from "./asset";
import { AssetBundle } from "./assetBundle";

export class AudioAsset extends Asset {
  constructor(protected readonly bundle: AssetBundle, protected readonly declaration: AudioAssetDeclaration) {
    super(bundle, declaration);
  }

  getSampleCount(): number {
    return this.declaration.details.samples;
  }

  getSampleRate(): number {
    return this.declaration.details.sampleRate;
  }

  getDurationSeconds(): number {
    return this.declaration.details.sampleRate / this.declaration.details.samples;
  }

  getDurationMs(): number {
    return this.getDurationSeconds() / 1000;
  }
}
