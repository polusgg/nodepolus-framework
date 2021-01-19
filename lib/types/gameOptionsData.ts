import { KillDistance, Language, Level, TaskBarUpdate } from "./enums";
import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { Bitfield } from "./bitfield";

const VERSIONS = [1, 2, 3, 4];

const LENGTHS = [41, 42, 44, 46];

export class GameOptionsData {
  constructor(
    public version: number = 4,
    public maxPlayers: number = 10,
    public languages: Language[] = [Language.Other],
    public levels: Level[] = [Level.TheSkeld],
    public playerSpeedModifier: number = 1.0,
    public crewmateLightModifier: number = 1.0,
    public impostorLightModifier: number = 1.5,
    public killCooldown: number = 45.0,
    public commonTaskCount: number = 1,
    public longTaskCount: number = 1,
    public shortTaskCount: number = 2,
    public emergencyMeetingCount: number = 1,
    public impostorCount: number = 1,
    public killDistance: KillDistance = KillDistance.Medium,
    public discussionTime: number = 15,
    public votingTime: number = 120,
    public isDefault: boolean = true,
    public emergencyCooldown: number = 15,
    public confirmEjects: boolean = true,
    public visualTasks: boolean = true,
    public anonymousVoting: boolean = false,
    public taskBarUpdates: TaskBarUpdate = TaskBarUpdate.Always,
  ) {}

  static isVersionSupported(version: number): boolean {
    return VERSIONS.includes(version);
  }

  static isExpectedLength(version: number, length: number): boolean {
    return LENGTHS[version - 1] == length;
  }

  static deserialize(reader: MessageReader, isSearching: boolean = false): GameOptionsData {
    const bytes = reader.readBytesAndSize();
    const version = bytes.readByte();

    if (!GameOptionsData.isVersionSupported(version)) {
      throw new Error(`Invalid GameOptionsData version: ${version}`);
    }

    const expectedLength = LENGTHS[version - 1];

    if (!GameOptionsData.isExpectedLength(version, bytes.getLength())) {
      throw new Error(`Invalid GameOptionsData length for version ${version}: expected ${expectedLength} but got ${bytes.getLength()}`);
    }

    return new GameOptionsData(
      version,
      bytes.readByte(),
      Bitfield.fromNumber(bytes.readUInt32(), 32).asNumbers<Language>(),
      isSearching
        ? Bitfield.fromNumber(bytes.readByte(), 8).asNumbers<Level>()
        : [bytes.readByte()],
      bytes.readFloat32(),
      bytes.readFloat32(),
      bytes.readFloat32(),
      bytes.readFloat32(),
      bytes.readByte(),
      bytes.readByte(),
      bytes.readByte(),
      bytes.readUInt32(),
      bytes.readByte(),
      bytes.readByte() as KillDistance,
      bytes.readUInt32(),
      bytes.readUInt32(),
      bytes.readBoolean(),
      version > 1 ? bytes.readByte() : 15,
      version > 2 ? bytes.readBoolean() : true,
      version > 2 ? bytes.readBoolean() : true,
      version > 3 ? bytes.readBoolean() : false,
      version > 3 ? bytes.readByte() as TaskBarUpdate : TaskBarUpdate.Always,
    );
  }

  serialize(writer: MessageWriter, isSearching: boolean = false): void {
    writer.writePackedUInt32(LENGTHS[this.version - 1]);
    writer.writeByte(this.version);
    writer.writeByte(this.maxPlayers);
    writer.writeUInt32(this.languages.reduce((a, b) => a | b));
    writer.writeByte(isSearching ? this.levels.reduce((a, b) => a | b) : this.levels[0]);
    writer.writeFloat32(this.playerSpeedModifier);
    writer.writeFloat32(this.crewmateLightModifier);
    writer.writeFloat32(this.impostorLightModifier);
    writer.writeFloat32(this.killCooldown);
    writer.writeByte(this.commonTaskCount);
    writer.writeByte(this.longTaskCount);
    writer.writeByte(this.shortTaskCount);
    writer.writeInt32(this.emergencyMeetingCount);
    writer.writeByte(this.impostorCount);
    writer.writeByte(this.killDistance);
    writer.writeInt32(this.discussionTime);
    writer.writeInt32(this.votingTime);
    writer.writeBoolean(this.isDefault);

    if (this.version > 1) {
      writer.writeByte(this.emergencyCooldown);
    }

    if (this.version > 2) {
      writer.writeBoolean(this.confirmEjects);
      writer.writeBoolean(this.visualTasks);
    }

    if (this.version > 3) {
      writer.writeBoolean(this.anonymousVoting);
      writer.writeByte(this.taskBarUpdates);
    }
  }
}
