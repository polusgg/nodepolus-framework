import { KillDistance, Language, Level, TaskBarUpdate } from "./enums";
import { MessageReader, MessageWriter } from "../util/hazelMessage";

export interface BaseGameOptionsData {
  maxPlayers: number;
  languages: Language[];
  levels: Level[];
  playerSpeedModifier: number;
  crewLightModifier: number;
  impostorLightModifier: number;
  killCooldown: number;
  commonTasks: number;
  longTasks: number;
  shortTasks: number;
  emergencies: number;
  impostorCount: number;
  killDistance: KillDistance;
  discussionTime: number;
  votingTime: number;
  isDefault: boolean;
}

export interface GameOptionsDataV1 extends BaseGameOptionsData {
  length: 41;
  version: 1;
}

export interface GameOptionsDataV2 extends BaseGameOptionsData {
  length: 42;
  version: 2;
  emergencyCooldown: number;
}

export interface GameOptionsDataV3 extends BaseGameOptionsData {
  length: 44;
  version: 3;
  emergencyCooldown: number;
  confirmEjects: boolean;
  visualTasks: boolean;
}

export interface GameOptionsDataV4 extends BaseGameOptionsData {
  length: 46;
  version: 4;
  emergencyCooldown: number;
  confirmEjects: boolean;
  visualTasks: boolean;
  anonymousVoting: boolean;
  taskBarUpdates: TaskBarUpdate;
}

export type GameOptionsDataInterface = GameOptionsDataV1 | GameOptionsDataV2 | GameOptionsDataV3 | GameOptionsDataV4;

// TODO: Try and get rid of the TS error below
export class GameOptionsData {
  constructor(
    public readonly options: GameOptionsDataInterface,
  ) {}

  static deserialize(reader: MessageReader, isSearching: boolean = false): GameOptionsData {
    const length = reader.readPackedUInt32();

    if (!(length == 41 || length == 42 || length == 44 || length == 46)) {
      throw new Error(`Invalid GameOptionsData length: ${length}`);
    }

    const version = reader.readByte();

    /**
     * We must write  `1 || 2 || 3 || 4` here because a Number
     * can be non-whole, so `ver <= 4 && ver >= 1` would return
     * `true` for `2.5`. Since TypeScript doesn't know `readByte`
     * will always return a whole number, it fails to accept
     * `ver <= 4 && ver >= 1`
     */
    if (!(version == 1 || version == 2 || version == 3 || version == 4)) {
      throw new Error(`Invalid GameOptionsData version: ${version}`);
    }

    const maxPlayers = reader.readByte();
    const languages: Language[] = reader
      .readBitfield(32)
      .reverse()
      .map((bit, index) => bit ? 1 << index : 0)
      .filter(bit => bit);
    const levels: Level[] = isSearching
      ? reader.readBitfield(8)
        .reverse()
        .map((bit, index) => bit ? 1 << index : 0)
        .filter(bit => bit)
      : [reader.readByte()];

    /**
     * Typescript is complaining that opt is missing the properties
     * from GameOptionsDataV4 because they are not being defined
     * inside the object definiton. This is okay because they are being
     * defined in the if-statements below.
     */
    // @ts-expect-error see above
    const opt: GameOptionsDataInterface = {
      length,
      version,
      maxPlayers,
      languages,
      levels,
      playerSpeedModifier: reader.readFloat32(),
      crewLightModifier: reader.readFloat32(),
      impostorLightModifier: reader.readFloat32(),
      killCooldown: reader.readFloat32(),
      commonTasks: reader.readByte(),
      longTasks: reader.readByte(),
      shortTasks: reader.readByte(),
      emergencies: reader.readInt32(),
      impostorCount: reader.readByte(),
      killDistance: reader.readByte(),
      discussionTime: reader.readInt32(),
      votingTime: reader.readInt32(),
      isDefault: reader.readBoolean(),
    };

    // TODO: Cody: refactor to single type/object with defaults for lower versions
    if (opt.version == 2 || opt.version == 3 || opt.version == 4) {
      opt.emergencyCooldown = reader.readByte();
    }

    if (opt.version == 3 || opt.version == 4) {
      opt.confirmEjects = reader.readBoolean();
      opt.visualTasks = reader.readBoolean();
    }

    if (opt.version == 4) {
      opt.anonymousVoting = reader.readBoolean();
      opt.taskBarUpdates = reader.readByte();
    }

    return new GameOptionsData(opt);
  }

  serialize(writer: MessageWriter, isSearching: boolean = false): void {
    writer.writePackedUInt32(this.options.length);
    writer.writeByte(this.options.version);
    writer.writeByte(this.options.maxPlayers);
    writer.writeUInt32(this.options.languages.reduce((a, b) => a | b));
    writer.writeByte(isSearching ? this.options.levels.reduce((a, b) => a | b) : this.options.levels[0]);
    writer.writeFloat32(this.options.playerSpeedModifier);
    writer.writeFloat32(this.options.crewLightModifier);
    writer.writeFloat32(this.options.impostorLightModifier);
    writer.writeFloat32(this.options.killCooldown);
    writer.writeByte(this.options.commonTasks);
    writer.writeByte(this.options.longTasks);
    writer.writeByte(this.options.shortTasks);
    writer.writeInt32(this.options.emergencies);
    writer.writeByte(this.options.impostorCount);
    writer.writeByte(this.options.killDistance);
    writer.writeInt32(this.options.discussionTime);
    writer.writeInt32(this.options.votingTime);
    writer.writeBoolean(this.options.isDefault);

    if (this.options.version > 1) {
      writer.writeByte((this.options as GameOptionsDataV2).emergencyCooldown);
    }

    if (this.options.version > 2) {
      writer.writeBoolean((this.options as GameOptionsDataV3).confirmEjects);
      writer.writeBoolean((this.options as GameOptionsDataV3).visualTasks);
    }

    if (this.options.version > 3) {
      writer.writeBoolean((this.options as GameOptionsDataV4).anonymousVoting);
      writer.writeByte((this.options as GameOptionsDataV4).taskBarUpdates);
    }
  }
}
