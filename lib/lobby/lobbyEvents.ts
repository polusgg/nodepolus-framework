import { PlayerColor, PlayerPet, PlayerHat, PlayerSkin } from "../types/enums";
import { BaseInnerNetObject } from "../protocol/entities/types";
import { Connection } from "../protocol/connection";
import { Player } from "../player";
import { Vector2 } from "../types";

export type LobbyEvents = {
  connection: Connection;
  player: Player;
  murder: {
    killer: Player;
    victim: Player;
  };
  chat: {
    clientId: number;
    message: string;
  };
  movement: {
    clientId: number;
    sequenceId: number;
    position: Vector2;
    velocity: Vector2;
  };
  nameChanged: {
    clientId: number;
    newName: string;
  };
  colorChanged: {
    clientId: number;
    newColor: PlayerColor;
  };
  petChanged: {
    clientId: number;
    newPet: PlayerPet;
  };
  hatChanged: {
    clientId: number;
    newHat: PlayerHat;
  };
  skinChanged: {
    clientId: number;
    newSkin: PlayerSkin;
  };
  removed: {
    clientId: number;
  };
  enteredVent: {
    clientId: number;
    ventId: number;
  };
  leftVent: {
    clientId: number;
    ventId: number;
  };
  setInfected: number[];
  despawn: BaseInnerNetObject;
};
