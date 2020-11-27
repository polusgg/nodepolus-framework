import { MessageReader, MessageWriter } from "../util/hazelMessage";

export interface GameOptionsDataV1 {
  length: 41;
  version: 1;
  maxPlayers: number;
  language: boolean[];
  mapID: number;
  playerSpeedModifier: number;
  crewLightModifier: number;
  impostorLightModifier: number;
  killCooldown: number;
  commonTasks: number;
  longTasks: number;
  shortTasks: number;
  emergencies: number;
  impostorCount: number;
  killDistance: 0 | 1 | 2;
  disussionTime: number;
  votingTime: number;
  isDefault: boolean;
};

export type GameOptionsDataV2 = GameOptionsDataV1 & {
  length: 42;
  version: 2;
  emergencyCooldown: number;
};

export type GameOptionsDataV3 = GameOptionsDataV2 & {
  length: 44;
  version: 3;
  confirmEjects: boolean;
  visualTasks: boolean;
};

export type GameOptionsDataV4 = GameOptionsDataV3 & {
  length: 46;
  version: 4;
  anonymousVoting: boolean;
  taskBarUpdates: 0 | 1 | 2;
};

export type GameOptionsDataInterface = GameOptionsDataV1
                                     | GameOptionsDataV2
                                     | GameOptionsDataV3
                                     | GameOptionsDataV4

export class GameOptionsData {
  constructor(public readonly options: GameOptionsDataInterface) {}
  // TODO: README \/
  // Static method which takes in the options and messagewriter
  // which would make us call `GameOptionsData.serialize(options, writer)`
  // or a class with instance properties so all we have to do is
  // call `options.serialize(writer)`
  static serialize(options: GameOptionsDataInterface, writer: MessageWriter) {
    new GameOptionsData(options).serialize(writer)
  }

  serialize(writer: MessageWriter) {
    writer.writePackedUInt32(this.options.length)
    writer.writeByte(this.options.version)
    writer.writeByte(this.options.maxPlayers)
    writer.writeBitfield(this.options.language.concat(Array(32).fill(false).slice(0, this.options.language.length)))
    writer.writeByte(this.options.mapID)
    writer.writeFloat32(this.options.playerSpeedModifier)
    writer.writeFloat32(this.options.crewLightModifier)
    writer.writeFloat32(this.options.impostorLightModifier)
    writer.writeFloat32(this.options.killCooldown)
    writer.writeByte(this.options.commonTasks)
    writer.writeByte(this.options.longTasks)
    writer.writeByte(this.options.shortTasks)
    writer.writeInt32(this.options.emergencies)
    writer.writeByte(this.options.impostorCount)
    writer.writeByte(this.options.killDistance)
    writer.writeInt32(this.options.disussionTime)
    writer.writeInt32(this.options.votingTime)
    writer.writeBoolean(this.options.isDefault)
    if(this.options.version >= 2) {
      writer.writeByte((<GameOptionsDataV2>this.options).emergencyCooldown)
    }
    if (this.options.version >= 3) {
      writer.writeBoolean((<GameOptionsDataV3>this.options).confirmEjects)
      writer.writeBoolean((<GameOptionsDataV3>this.options).visualTasks)
    }
    if (this.options.version >= 4) {
      writer.writeBoolean((<GameOptionsDataV4>this.options).anonymousVoting)
      writer.writeByte((<GameOptionsDataV4>this.options).taskBarUpdates)
    }
  }

  static deserialize(reader: MessageReader): GameOptionsDataInterface {
    
  }
}
