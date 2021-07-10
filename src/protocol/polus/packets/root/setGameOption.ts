import { BaseRootPacket } from "../../../packets/root";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";

export enum GameOptionType {
  NumberValue = 0,
  BooleanValue = 1,
  EnumValue = 2,
}

export class NumberValue {
  constructor(
    public value: number,
    public step: number,
    public lower: number,
    public upper: number,
    public zeroIsInfinity: boolean,
    public suffix: string,
  ) {}
}

export class BooleanValue {
  constructor(
    public value: boolean,
  ) {}
}

export class EnumValue {
  constructor(
    public index: number,
    public options: string[],
  ) {}

  getSelected(): string {
    return this.options[this.index];
  }
}

export class SetGameOption extends BaseRootPacket {
  constructor(
    public sequenceId: number,
    public category: string,
    public priority: number,
    public name: string,
    public value: NumberValue | BooleanValue | EnumValue,
  ) {
    super(0x89);
  }

  static deserialize(reader: MessageReader): SetGameOption {
    const sequenceId = reader.readUInt16();
    const category = reader.readString();
    const priority = reader.readUInt16();
    const name = reader.readString();
    const type = reader.readByte();
    let value: NumberValue | BooleanValue | EnumValue;

    switch (type) {
      case GameOptionType.NumberValue: {
        value = new NumberValue(
          reader.readFloat32(),
          reader.readFloat32(),
          reader.readFloat32(),
          reader.readFloat32(),
          reader.readBoolean(),
          reader.readString(),
        );
        break;
      }
      case GameOptionType.BooleanValue:
        value = new BooleanValue(
          reader.readBoolean(),
        );
        break;
      case GameOptionType.EnumValue: {
        const index = reader.readPackedUInt32();

        const options: string[] = [];

        while (reader.getCursor() < reader.getLength()) {
          options.push(reader.readString());
        }

        value = new EnumValue(
          index,
          options,
        );
        break;
      }
      default:
        throw new Error(`Unexpected game option type: ${type}`);
    }

    return new SetGameOption(sequenceId, category, priority, name, value);
  }

  serialize(writer: MessageWriter): void {
    writer.writeUInt16(this.sequenceId);
    writer.writeString(this.category);
    writer.writeUInt16(this.priority);
    writer.writeString(this.name);

    if (this.value instanceof NumberValue) {
      const value = this.value as NumberValue;

      writer.writeByte(GameOptionType.NumberValue);
      writer.writeFloat32(value.value);
      writer.writeFloat32(value.step);
      writer.writeFloat32(value.lower);
      writer.writeFloat32(value.upper);
      writer.writeBoolean(value.zeroIsInfinity);
      writer.writeString(value.suffix);
    } else if (this.value instanceof BooleanValue) {
      const value = this.value as BooleanValue;

      writer.writeByte(GameOptionType.BooleanValue);
      writer.writeBoolean(value.value);
    } else if (this.value instanceof EnumValue || typeof this.value === "object") {
      const value = this.value as EnumValue;

      writer.writeByte(GameOptionType.EnumValue);
      writer.writePackedUInt32(value.index);

      for (let i = 0; i < this.value.options.length; i++) {
        writer.writeString(this.value.options[i]);
      }
    } else {
      throw new Error(`Unexpected game option type: ${typeof this.value}`);
    }
  }

  clone(): SetGameOption {
    return new SetGameOption(this.sequenceId, this.category, this.priority, this.name, this.value);
  }
}
