import { PlayerColor, PlayerHat, PlayerPet, PlayerSkin } from "../../types/enums";
import { TextComponent } from "../text";
import { Task } from "../game";

export interface PlayerInstance {
  getId(): number;

  getName(): TextComponent;

  getColor(): PlayerColor;

  getHat(): PlayerHat;

  getPet(): PlayerPet;

  getSkin(): PlayerSkin;

  isImpostor(): boolean;

  isDead(): boolean;

  getTasks(): Task[];

  isScanning(): boolean;

  setName(name: TextComponent | string): this;

  setColor(color: PlayerColor): this;

  setHat(hat: PlayerHat): this;

  setPet(pet: PlayerPet): this;

  setSkin(skin: PlayerSkin): this;

  kill(): this;

  murder(player: PlayerInstance): this;

  revive(): this;

  sendChat(message: string): this;
}
