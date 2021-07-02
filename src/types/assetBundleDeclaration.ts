import { SoundType } from "./enums/soundType";

export enum AssetType {
  Other,
  Audio,
}

export type AudioAssetDetails = {
  audioType: SoundType;
  sampleRate: number;
  samples: number;
};

export type BaseAssetDeclaration = {
  id: number;
  path: string;
  type: AssetType;
};

export type AudioAssetDeclaration = BaseAssetDeclaration & {
  type: AssetType.Audio;
  details: AudioAssetDetails;
};

export type AssetDeclaration = BaseAssetDeclaration | AudioAssetDeclaration;

export type AssetBundleDeclaration = {
  assetBundleId: number;
  hash: string;
  assets: AssetDeclaration[];
};
