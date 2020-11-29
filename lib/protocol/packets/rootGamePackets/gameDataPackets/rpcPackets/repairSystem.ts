import { MessageWriter, MessageReader } from "../../../../../util/hazelMessage";
import { SystemType } from "../../../../../types/systemType";
import { BaseRPCPacket } from "../../../basePacket";
import { Level } from "../../../../../types/level";
import { RPCPacketType } from "../../../types";

export interface RepairAmount {
  serialize(): number
}

export enum ReactorAction {
  PlacedHand = 0x40,
  RemovedHand = 0x20,
  Repaired = 0x10,
}

export class ReactorAmount implements RepairAmount {
  private constructor(
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
    return this.action | (this.consoleId & 3);
  }
}

export class ElectricalAmount implements RepairAmount {
  private constructor(
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
  private constructor(
    public readonly consoleId: number,
    public readonly action: ReactorAction,
  ) {}

  static deserialize(amount: number): OxygenAmount {
    let action = ReactorAction.PlacedHand;

    if ((amount & ReactorAction.RemovedHand) == ReactorAction.RemovedHand) {
      action = ReactorAction.RemovedHand;
    } else if ((amount & ReactorAction.Repaired) == ReactorAction.Repaired) {
      action = ReactorAction.Repaired;
    }

    return new OxygenAmount(amount & 3, action);
  }

  serialize(): number {
    return 0;
  }
}

export enum MedbayAction {
  EnteredQueue = 0x80,
  LeftQueue = 0x40,
}

export class MedbayAmount implements RepairAmount {
  private constructor(
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
    return 0;
  }
}

export class SecurityAmount implements RepairAmount {
  private constructor(
    public readonly isViewingCameras: boolean,
  ) {}

  static deserialize(amount: number): SecurityAmount {
    return new SecurityAmount(amount == 1);
  }

  serialize(): number {
    return 0;
  }
}

export class NormalCommunicationsAmount implements RepairAmount {
  private constructor(
    public readonly isRepaired: boolean,
  ) {}

  static deserialize(amount: number): NormalCommunicationsAmount {
    return new NormalCommunicationsAmount((amount & 0x80) == 0x80);
  }

  serialize(): number {
    return 0;
  }
}

export class SabotageAmount implements RepairAmount {
  private constructor(
    public readonly system: SystemType,
  ) {}

  static deserialize(amount: number): SabotageAmount {
    return new SabotageAmount(amount);
  }

  serialize(): number {
    return 0;
  }
}

export enum MiraCommunicationsAction {
  OpenedConsole = 0x40,
  ClosedConsole = 0x20,
  EnteredCode = 0x10,
}

export class MiraCommunicationsAmount implements RepairAmount {
  private constructor(
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

    return new MiraCommunicationsAmount(amount & 3, action);
  }

  serialize(): number {
    return 0;
  }
}

export class DecontaminationAmount implements RepairAmount {
  private constructor(
    public readonly doorState: number,
  ) {}

  static deserialize(amount: number): DecontaminationAmount {
    return new DecontaminationAmount(amount);
  }

  serialize(): number {
    return this.doorState;
  }
}

export class PolusDoorsAmount implements RepairAmount {
  private constructor(
    public readonly doorId: number,
  ) {}

  static deserialize(amount: number): PolusDoorsAmount {
    return new PolusDoorsAmount(amount & 0x1f);
  }

  serialize(): number {
    return 0;
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
      case SystemType.Sabotage:
        return SabotageAmount.deserialize(this.amountByte);
      case SystemType.Decontamination:
      case SystemType.Decontamination2:
        return DecontaminationAmount.deserialize(this.amountByte);
      default:
        throw new Error(`Received unhandled RepairSystem for system ${this.system} on level ${this.level}`);
    }
  }

  static deserialize(reader: MessageReader, level?: Level): RepairSystemPacket {
    if (!level) {
      throw new Error("Received RepairSystem without a level");
    }

    return new RepairSystemPacket(
      reader.readByte(),
      reader.readPackedUInt32(),
      reader.readByte(),
      level,
    );
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeByte(this.system)
      .writePackedUInt32(this.playerControlNetId)
      .writeByte(this.amount.serialize());
  }
}
