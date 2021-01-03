import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { Level, SystemType } from "../../../types/enums";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";
import {
  DecontaminationAmount,
  ElectricalAmount,
  MedbayAmount,
  MiraCommunicationsAmount,
  NormalCommunicationsAmount,
  OxygenAmount,
  PolusDoorsAmount,
  ReactorAmount,
  RepairAmount,
  SabotageAmount,
  SecurityAmount,
} from "./repairSystem/amounts";

export class RepairSystemPacket extends BaseRPCPacket {
  public readonly amount: RepairAmount;

  constructor(
    public readonly system: SystemType,
    public readonly playerControlNetId: number,
    public readonly amountByte: number,
    public readonly level: Level,
  ) {
    super(RPCPacketType.RepairSystem);

    this.amount = this.parseAmount();
  }

  static deserialize(reader: MessageReader, level?: Level): RepairSystemPacket {
    if (level === undefined) {
      throw new Error("Attempted to deserialize RepairSystem without a level");
    }

    return new RepairSystemPacket(
      reader.readByte(),
      reader.readPackedUInt32(),
      reader.readByte(),
      level,
    );
  }

  parseAmount(): RepairAmount {
    switch (this.system) {
      case SystemType.Reactor:
      case SystemType.Laboratory:
        return ReactorAmount.deserialize(this.amountByte);
      case SystemType.Electrical:
        return ElectricalAmount.deserialize(this.amountByte);
      case SystemType.Oxygen:
        return OxygenAmount.deserialize(this.amountByte);
      case SystemType.Medbay:
        return MedbayAmount.deserialize(this.amountByte);
      case SystemType.Security:
        return SecurityAmount.deserialize(this.amountByte);
      case SystemType.Communications:
        return this.level == Level.MiraHq
          ? MiraCommunicationsAmount.deserialize(this.amountByte)
          : NormalCommunicationsAmount.deserialize(this.amountByte);
      case SystemType.Doors:
        if (this.level == Level.Polus) {
          return PolusDoorsAmount.deserialize(this.amountByte);
        }

        throw new Error(`Received RepairSystem for Doors on a level other than Polus`);
      case SystemType.Sabotage:
        return SabotageAmount.deserialize(this.amountByte);
      case SystemType.Decontamination:
      case SystemType.Decontamination2:
        return DecontaminationAmount.deserialize(this.amountByte);
      default:
        throw new Error(`Attempted to parse RepairSystem amount for unimplemented SystemType ${this.system} (${SystemType[this.system]}) on level ${this.level} (${Level[this.level]})`);
    }
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeByte(this.system)
      .writePackedUInt32(this.playerControlNetId)
      .writeByte(this.amount.serialize());
  }
}
