import { Asset } from "../../../protocol/polus/assets";

export type WinSound = Asset | WinSoundType;

export enum WinSoundType {
  CustomSound = 0,
  CrewmateWin = 1,
  ImpostorWin = 2,
  Disconnect = 3,
  NoSound = 4,
}
