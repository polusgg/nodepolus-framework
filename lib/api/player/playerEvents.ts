import { PlayerColor, PlayerPet, PlayerHat, PlayerSkin, DeathReason } from "../../types/enums";
import { TextComponent } from "../text";
import { Vector2 } from "../../types";
import { Vent } from "../game";
import { Player } from ".";

export type PlayerEvents = {
  murdered: Player;
  moved: {
    position: Vector2;
    velocity: Vector2;
  };
  nameChanged: TextComponent;
  colorChanged: PlayerColor;
  petChanged: PlayerPet;
  hatChanged: PlayerHat;
  skinChanged: PlayerSkin;
  voted: Player | undefined;
  chat: TextComponent;
  enterVent: Vent;
  exitVent: Vent;
  killed: DeathReason;
};
