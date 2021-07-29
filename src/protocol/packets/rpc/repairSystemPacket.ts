import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { Level, RpcPacketType, SystemType } from "../../../types/enums";
import { BaseRpcPacket } from ".";
import {
  DecontaminationAmount,
  ElectricalAmount,
  HeliSabotageAmount,
  MedbayAmount,
  MiraCommunicationsAmount,
  NormalCommunicationsAmount,
  OxygenAmount,
  PolusDoorsAmount,
  ReactorAmount,
  RepairAmount,
  SabotageAmount,
  SecurityAmount,
  SubmergedSecurityAmount,
} from "./repairSystem/amounts";
import { SubmergedSpawnInAmount } from "./repairSystem/amounts/submergedSpawnInAmount";
import { SubmergedElevatorAmount } from "./repairSystem/amounts/submergedElevatorAmount";

/**
 * RPC Packet ID: `0x1c` (`28`)
 */
export class RepairSystemPacket extends BaseRpcPacket {
  protected amount: RepairAmount;

  constructor(
    public system: SystemType,
    public playerControlNetId: number,
    public amountByte: number,
    public level: Level,
  ) {
    super(RpcPacketType.RepairSystem);

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
        if (this.level == Level.Airship) {
          return HeliSabotageAmount.deserialize(this.amountByte);
        }

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
        if (this.level == Level.Polus || this.level == Level.Airship || this.level == Level.Submerged) {
          return PolusDoorsAmount.deserialize(this.amountByte);
        }

        throw new Error(`Received RepairSystem for Doors on a level other than Polus`);
      case SystemType.Sabotage:
        return SabotageAmount.deserialize(this.amountByte);
      case SystemType.Decontamination:
      case SystemType.Decontamination2:
        return DecontaminationAmount.deserialize(this.amountByte);
      case SystemType.SubmergedSpawnIn:
        return SubmergedSpawnInAmount.deserialize(this.amountByte);
      case SystemType.SubmergedElevatorEastLeft:
      case SystemType.SubmergedElevatorEastRight:
      case SystemType.SubmergedElevatorWestLeft:
      case SystemType.SubmergedElevatorWestRight:
      case SystemType.SubmergedElevatorService:
        return SubmergedElevatorAmount.deserialize();
      case SystemType.SubmergedSecuritySabotage:
        return SubmergedSecurityAmount.deserialize(this.amountByte);
      default:
        throw new Error(`Attempted to parse RepairSystem amount for unimplemented SystemType ${this.system} (${SystemType[this.system]}) on level ${this.level} (${Level[this.level]})`);
    }
  }

  clone(): RepairSystemPacket {
    const packet = new RepairSystemPacket(this.system, this.playerControlNetId, this.amountByte, this.level);

    packet.amount = this.amount.clone();

    return packet;
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.system)
      .writePackedUInt32(this.playerControlNetId)
      .writeObject(this.amount);
  }

  getAmount(): RepairAmount {
    return this.amount;
  }

  updateAmount(): this {
    this.amount = this.parseAmount();

    return this;
  }
}
