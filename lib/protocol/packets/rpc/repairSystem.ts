import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SystemType } from "../../../types/systemType";
import { BaseRPCPacket } from "../basePacket";
import { Level } from "../../../types/level";
import { RPCPacketType } from "../types";

export interface RepairAmount {
  serialize(): number;
}

export enum ReactorAction {
  PlacedHand = 0x40,
  RemovedHand = 0x20,
  Repaired = 0x10,
}

export class ReactorAmount implements RepairAmount {
  constructor(
    public readonly consoleId: number,
    public readonly action: ReactorAction,
  ) {}

  static deserialize(amount: number): ReactorAmount {
    let action = ReactorAction.PlacedHand;

    if ((amount & ReactorAction.RemovedHand) == ReactorAction.RemovedHand) {
      action = ReactorAction.RemovedHand;
    } else if ((amount & ReactorAction.Repaired) == ReactorAction.Repaired) {
      action = ReactorAction.Repaired;
    }

    return new ReactorAmount(amount & 3, action);
  }

  serialize(): number {
    return this.consoleId | this.action;
  }
}

export class ElectricalAmount implements RepairAmount {
  constructor(
    public readonly switchIndex: number,
  ) {}

  static deserialize(amount: number): ElectricalAmount {
    return new ElectricalAmount(amount);
  }

  serialize(): number {
    return this.switchIndex;
  }
}

export enum OxygenAction {
  Completed = 0x40,
  Repaired = 0x10,
}

export class OxygenAmount implements RepairAmount {
  constructor(
    public readonly consoleId: number,
    public readonly action: OxygenAction,
  ) {}

  static deserialize(amount: number): OxygenAmount {
    let action = OxygenAction.Completed;

    if ((amount & OxygenAction.Completed) == OxygenAction.Completed) {
      action = OxygenAction.Completed;
    } else if ((amount & OxygenAction.Repaired) == OxygenAction.Repaired) {
      action = OxygenAction.Repaired;
    }

    return new OxygenAmount(amount & 3, action);
  }

  serialize(): number {
    return this.consoleId | this.action;
  }
}

export enum MedbayAction {
  EnteredQueue = 0x80,
  LeftQueue = 0x40,
}

export class MedbayAmount implements RepairAmount {
  constructor(
    public readonly playerId: number,
    public readonly action: MedbayAction,
  ) {}

  static deserialize(amount: number): MedbayAmount {
    return new MedbayAmount(
      amount & 0x1f,
      (amount & MedbayAction.EnteredQueue) == MedbayAction.EnteredQueue
        ? MedbayAction.EnteredQueue
        : MedbayAction.LeftQueue,
    );
  }

  serialize(): number {
    return this.playerId | this.action;
  }
}

export class SecurityAmount implements RepairAmount {
  constructor(
    public readonly isViewingCameras: boolean,
  ) {}

  static deserialize(amount: number): SecurityAmount {
    return new SecurityAmount(amount == 1);
  }

  serialize(): number {
    return this.isViewingCameras ? 1 : 0;
  }
}

export class NormalCommunicationsAmount implements RepairAmount {
  constructor(
    public readonly isRepaired: boolean,
  ) {}

  static deserialize(amount: number): NormalCommunicationsAmount {
    return new NormalCommunicationsAmount(amount == 0);
  }

  serialize(): number {
    return this.isRepaired ? 1 : 0;
  }
}

export class SabotageAmount implements RepairAmount {
  constructor(
    public readonly system: SystemType,
  ) {}

  static deserialize(amount: number): SabotageAmount {
    return new SabotageAmount(amount);
  }

  serialize(): number {
    return this.system;
  }
}

export enum MiraCommunicationsAction {
  OpenedConsole = 0x40,
  ClosedConsole = 0x20,
  EnteredCode = 0x10,
}

export class MiraCommunicationsAmount implements RepairAmount {
  constructor(
    public readonly consoleId: number,
    public readonly action: MiraCommunicationsAction,
  ) {}

  static deserialize(amount: number): MiraCommunicationsAmount {
    let action = MiraCommunicationsAction.OpenedConsole;

    if ((amount & MiraCommunicationsAction.ClosedConsole) == MiraCommunicationsAction.ClosedConsole) {
      action = MiraCommunicationsAction.ClosedConsole;
    } else if ((amount & MiraCommunicationsAction.EnteredCode) == MiraCommunicationsAction.EnteredCode) {
      action = MiraCommunicationsAction.EnteredCode;
    }

    return new MiraCommunicationsAmount(amount & 0xf, action);
  }

  serialize(): number {
    return this.consoleId | this.action;
  }
}

export class DecontaminationAmount implements RepairAmount {
  constructor(
    public readonly isEntering: boolean,
    public readonly isHeadingUp: boolean,
  ) {}

  static deserialize(amount: number): DecontaminationAmount {
    return new DecontaminationAmount(
      amount == 1 || amount == 2,
      amount == 1 || amount == 3,
    );
  }

  serialize(): number {
    return this.isEntering
      ? (this.isHeadingUp ? 1 : 2)
      : (this.isHeadingUp ? 3 : 4);
  }
}

export class PolusDoorsAmount implements RepairAmount {
  constructor(
    public readonly doorId: number,
  ) {}

  static deserialize(amount: number): PolusDoorsAmount {
    return new PolusDoorsAmount(amount & 0x1f);
  }

  serialize(): number {
    return this.doorId | 0x40;
  }
}

export type Amounts = ReactorAmount
| ElectricalAmount
| OxygenAmount
| MedbayAmount
| SecurityAmount
| NormalCommunicationsAmount
| SabotageAmount
| MiraCommunicationsAmount
| DecontaminationAmount
| PolusDoorsAmount;

export class RepairSystemPacket extends BaseRPCPacket {
  public readonly amount: Amounts;

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
    if (!level && level !== 0) {
      throw new Error("Attempted to deserialize RepairSystem without a level");
    }

    return new RepairSystemPacket(
      reader.readByte(),
      reader.readPackedUInt32(),
      reader.readByte(),
      level,
    );
  }

  parseAmount(): Amounts {
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
