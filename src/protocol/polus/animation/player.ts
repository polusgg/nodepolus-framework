import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { Bitfield, Mutable, Vector2 } from "../../../types";
import { Palette } from "../../../static";

export class PlayerAnimationKeyframe {
  protected offset: number;
  protected duration: number;
  protected opacity: number;
  protected hatOpacity: number;
  protected petOpacity: number;
  protected skinOpacity: number;
  protected primaryColor: [number, number, number, number] | number[];
  protected secondaryColor: [number, number, number, number] | number[];
  protected tertiaryColor: [number, number, number, number] | number[];
  protected scale: Vector2;
  protected position: Vector2;
  protected angle: number;

  constructor(
    { offset, duration, opacity, hatOpacity, petOpacity, skinOpacity, primaryColor, secondaryColor, tertiaryColor, scale, position, angle }: {
      offset?: number;
      duration: number;
      opacity?: number;
      hatOpacity?: number;
      petOpacity?: number;
      skinOpacity?: number;
      primaryColor?: [number, number, number, number] | number[];
      secondaryColor?: [number, number, number, number] | number[];
      tertiaryColor?: [number, number, number, number] | number[];
      scale?: Vector2;
      position?: Vector2;
      angle?: number;
    },
  ) {
    this.offset = offset ?? 0;
    this.duration = duration;
    opacity = opacity ?? 1;
    this.opacity = opacity;
    this.hatOpacity = hatOpacity ?? opacity;
    this.petOpacity = petOpacity ?? opacity;
    this.skinOpacity = skinOpacity ?? opacity;
    this.primaryColor = primaryColor ?? [...Palette.white()];
    this.secondaryColor = secondaryColor ?? [...Palette.white()];
    this.tertiaryColor = tertiaryColor ?? [...Palette.playerVisor()];
    this.scale = scale ?? Vector2.one();
    this.position = position ?? Vector2.zero();
    this.angle = angle ?? 0;
  }

  static deserialize(reader: MessageReader, enableBits: Bitfield): PlayerAnimationKeyframe {
    const keyframe: {
      offset: number;
      duration: number;
      opacity: number;
      hatOpacity: number;
      petOpacity: number;
      skinOpacity: number;
      primaryColor: [number, number, number, number] | number[];
      secondaryColor: [number, number, number, number] | number[];
      tertiaryColor: [number, number, number, number] | number[];
      scale: Vector2;
      position: Vector2;
      angle: number;
    } = {
      offset: reader.readPackedUInt32(),
      duration: reader.readPackedUInt32(),
      opacity: 1,
      hatOpacity: 1,
      petOpacity: 1,
      skinOpacity: 1,
      primaryColor: Palette.white() as Mutable<[number, number, number, number]>,
      secondaryColor: Palette.white() as Mutable<[number, number, number, number]>,
      tertiaryColor: Palette.white() as Mutable<[number, number, number, number]>,
      scale: Vector2.one(),
      position: Vector2.zero(),
      angle: 0,
    };

    if (enableBits.has(0)) {
      keyframe.opacity = reader.readFloat32();
    }

    if (enableBits.has(1)) {
      keyframe.hatOpacity = reader.readFloat32();
    }

    if (enableBits.has(2)) {
      keyframe.petOpacity = reader.readFloat32();
    }

    if (enableBits.has(3)) {
      keyframe.skinOpacity = reader.readFloat32();
    }

    if (enableBits.has(4)) {
      keyframe.primaryColor = [reader.readByte(), reader.readByte(), reader.readByte(), reader.readByte()];
    }

    if (enableBits.has(5)) {
      keyframe.secondaryColor = [reader.readByte(), reader.readByte(), reader.readByte(), reader.readByte()];
    }

    if (enableBits.has(6)) {
      keyframe.tertiaryColor = [reader.readByte(), reader.readByte(), reader.readByte(), reader.readByte()];
    }

    if (enableBits.has(7)) {
      keyframe.scale = reader.readVector2();
    }

    if (enableBits.has(8)) {
      keyframe.position = reader.readVector2();
    }

    if (enableBits.has(9)) {
      keyframe.angle = reader.readFloat32();
    }

    return new PlayerAnimationKeyframe(keyframe);
  }

  serialize(writer: MessageWriter, enableBits: Bitfield): void {
    writer.writePackedUInt32(this.offset);
    writer.writePackedUInt32(this.duration);

    if (enableBits.has(0)) {
      writer.writeFloat32(this.opacity);
    }

    if (enableBits.has(1)) {
      writer.writeFloat32(this.hatOpacity);
    }

    if (enableBits.has(2)) {
      writer.writeFloat32(this.petOpacity);
    }

    if (enableBits.has(3)) {
      writer.writeFloat32(this.skinOpacity);
    }

    if (enableBits.has(4)) {
      writer.writeBytes(this.primaryColor);
    }

    if (enableBits.has(5)) {
      writer.writeBytes(this.secondaryColor);
    }

    if (enableBits.has(6)) {
      writer.writeBytes(this.tertiaryColor);
    }

    if (enableBits.has(7)) {
      writer.writeVector2(this.scale);
    }

    if (enableBits.has(8)) {
      writer.writeVector2(this.position);
    }

    if (enableBits.has(9)) {
      writer.writeFloat32(this.angle);
    }
  }

  getOffset(): number {
    return this.offset;
  }

  getDuration(): number {
    return this.duration;
  }

  getOpacity(): number {
    return this.opacity;
  }

  getHatOpacity(): number {
    return this.hatOpacity;
  }

  getPetOpacity(): number {
    return this.petOpacity;
  }

  getSkinOpacity(): number {
    return this.skinOpacity;
  }

  getPrimaryColor(): [number, number, number, number] {
    return this.primaryColor as [number, number, number, number];
  }

  getSecondaryColor(): [number, number, number, number] {
    return this.secondaryColor as [number, number, number, number];
  }

  getTertiaryColor(): [number, number, number, number] {
    return this.tertiaryColor as [number, number, number, number];
  }

  getScale(): Vector2 {
    return this.scale;
  }

  getPosition(): Vector2 {
    return this.position;
  }

  getAngle(): number {
    return this.angle;
  }

  setOffset(offset: number): this {
    this.offset = offset;

    return this;
  }

  setDuration(duration: number): this {
    this.duration = duration;

    return this;
  }

  setOpacity(opacity: number): this {
    this.opacity = opacity;

    return this;
  }

  setHatOpacity(opacity: number): this {
    this.hatOpacity = opacity;

    return this;
  }

  setPetOpacity(opacity: number): this {
    this.petOpacity = opacity;

    return this;
  }

  setSkinOpacity(opacity: number): this {
    this.skinOpacity = opacity;

    return this;
  }

  setPrimaryColor(color: [number, number, number, number] | number[]): this {
    this.primaryColor = color;

    return this;
  }

  setSecondaryColor(color: [number, number, number, number] | number[]): this {
    this.secondaryColor = color;

    return this;
  }

  setTertiaryColor(color: [number, number, number, number] | number[]): this {
    this.tertiaryColor = color;

    return this;
  }

  setScale(scale: Vector2): this {
    this.scale = scale;

    return this;
  }

  setPosition(position: Vector2): this {
    this.position = position;

    return this;
  }

  setAngle(angle: number): this {
    this.angle = angle;

    return this;
  }

  clone(): PlayerAnimationKeyframe {
    return new PlayerAnimationKeyframe({
      offset: this.getOffset(),
      angle: this.getAngle(),
      duration: this.getDuration(),
      opacity: this.getOpacity(),
      position: this.getPosition(),
      primaryColor: this.getPrimaryColor(),
      scale: this.getScale(),
      secondaryColor: this.getSecondaryColor(),
      hatOpacity: this.getHatOpacity(),
      petOpacity: this.getPetOpacity(),
      skinOpacity: this.getSkinOpacity(),
      tertiaryColor: this.getTertiaryColor(),
    });
  }
}
