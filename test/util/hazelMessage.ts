import test from "ava";

import { MessageReader, MessageWriter } from "../../lib/util/hazelMessage";

test("reads a boolean", (t) => {
  const buf = MessageReader.fromMessage("0200010100", true);

  t.true(buf.readBoolean());
  t.false(buf.readBoolean());
  t.false(buf.hasBytesLeft());
});

test("writes a boolean", (t) => {
  const buf = new MessageWriter();

  buf.writeBoolean(true);
  buf.writeBoolean(false);

  t.is(buf.buffer.toString("hex"), "0100");
  t.is(buf.length, 2);
});

test("reads an int8", (t) => {
  const buf = MessageReader.fromMessage("0400017ff05680", true);

  t.is(buf.readSByte(), 127);
  t.is(buf.readSByte(), -16);
  t.is(buf.readSByte(), 86);
  t.is(buf.readSByte(), -128);
  t.false(buf.hasBytesLeft());
});

test("writes an int8", (t) => {
  const buf = new MessageWriter();

  buf.writeSByte(127);
  buf.writeSByte(-16);
  buf.writeSByte(86);
  buf.writeSByte(-128);

  t.is(buf.buffer.toString("hex"), "7ff05680");
  t.is(buf.length, 4);
});

test("reads a uint8", (t) => {
  const buf = MessageReader.fromMessage("030001fff056", true);

  t.is(buf.readByte(), 255);
  t.is(buf.readByte(), 240);
  t.is(buf.readByte(), 86);
  t.false(buf.hasBytesLeft());
});

test("writes a uint8", (t) => {
  const buf = new MessageWriter();

  buf.writeByte(255);
  buf.writeByte(240);
  buf.writeByte(86);

  t.is(buf.buffer.toString("hex"), "fff056");
  t.is(buf.length, 3);
});

test("reads an int16", (t) => {
  const buf = MessageReader.fromMessage("080001ff7ff0f056560080", true);

  t.is(buf.readInt16(), 32767);
  t.is(buf.readInt16(), -3856);
  t.is(buf.readInt16(), 22102);
  t.is(buf.readInt16(), -32768);
  t.false(buf.hasBytesLeft());
});

test("writes an int16", (t) => {
  const buf = new MessageWriter();

  buf.writeInt16(32767);
  buf.writeInt16(-3856);
  buf.writeInt16(22102);
  buf.writeInt16(-32768);

  t.is(buf.buffer.toString("hex"), "ff7ff0f056560080");
  t.is(buf.length, 8);
});

test("reads a uint16", (t) => {
  const buf = MessageReader.fromMessage("060001fffff0f05656", true);

  t.is(buf.readUInt16(), 65535);
  t.is(buf.readUInt16(), 61680);
  t.is(buf.readUInt16(), 22102);
  t.false(buf.hasBytesLeft());
});

test("writes a uint16", (t) => {
  const buf = new MessageWriter();

  buf.writeUInt16(65535);
  buf.writeUInt16(61680);
  buf.writeUInt16(22102);

  t.is(buf.buffer.toString("hex"), "fffff0f05656");
  t.is(buf.length, 6);
});

test("reads an int32", (t) => {
  const buf = MessageReader.fromMessage("100001ffffff7ff0f0f0f05656565600000080", true);

  t.is(buf.readInt32(), 2147483647);
  t.is(buf.readInt32(), -252645136);
  t.is(buf.readInt32(), 1448498774);
  t.is(buf.readInt32(), -2147483648);
  t.false(buf.hasBytesLeft());
});

test("writes an int32", (t) => {
  const buf = new MessageWriter();

  buf.writeInt32(2147483647);
  buf.writeInt32(-252645136);
  buf.writeInt32(1448498774);
  buf.writeInt32(-2147483648);

  t.is(buf.buffer.toString("hex"), "ffffff7ff0f0f0f05656565600000080");
  t.is(buf.length, 16);
});

test("reads a uint32", (t) => {
  const buf = MessageReader.fromMessage("0c0001fffffffff0f0f0f056565656", true);

  t.is(buf.readUInt32(), 4294967295);
  t.is(buf.readUInt32(), 4042322160);
  t.is(buf.readUInt32(), 1448498774);
  t.false(buf.hasBytesLeft());
});

test("writes a uint32", (t) => {
  const buf = new MessageWriter();

  buf.writeUInt32(4294967295);
  buf.writeUInt32(4042322160);
  buf.writeUInt32(1448498774);

  t.is(buf.buffer.toString("hex"), "fffffffff0f0f0f056565656");
  t.is(buf.length, 12);
});

test("reads a float32", (t) => {
  const buf = MessageReader.fromMessage("0c000100401cc600401c460000803f", true);

  t.is(buf.readFloat32(), -10000);
  t.is(buf.readFloat32(), 10000);
  t.is(buf.readFloat32(), 1);
  t.false(buf.hasBytesLeft());
});

test("writes a float32", (t) => {
  const buf = new MessageWriter();

  buf.writeFloat32(-10000);
  buf.writeFloat32(10000);
  buf.writeFloat32(1);

  t.is(buf.buffer.toString("hex"), "00401cc600401c460000803f");
  t.is(buf.length, 12);
});

test("reads a packed int32", (t) => {
  const buf = MessageReader.fromMessage("090001dcfcffff0f45a08a20", true);

  t.is(buf.readPackedInt32(), -420);
  t.is(buf.readPackedInt32(), 69);
  t.is(buf.readPackedInt32(), 525600);
  t.false(buf.hasBytesLeft());
});

test("writes a packed int32", (t) => {
  const buf = new MessageWriter();

  buf.writePackedInt32(-420);
  buf.writePackedInt32(69);
  buf.writePackedInt32(525600);

  t.is(buf.buffer.toString("hex"), "dcfcffff0f45a08a20");
  t.is(buf.length, 9);
});

test("reads a packed uint32", (t) => {
  const buf = MessageReader.fromMessage("090001dcfcffff0f45a08a20", true);

  t.is(buf.readPackedUInt32(), 4294966876);
  t.is(buf.readPackedUInt32(), 69);
  t.is(buf.readPackedUInt32(), 525600);
  t.false(buf.hasBytesLeft());
});

test("writes a packed uint32", (t) => {
  const buf = new MessageWriter();

  buf.writePackedUInt32(4294966876);
  buf.writePackedUInt32(69);
  buf.writePackedUInt32(525600);

  t.is(buf.buffer.toString("hex"), "dcfcffff0f45a08a20");
  t.is(buf.length, 9);
});

test("reads a string", (t) => {
  const buf = MessageReader.fromMessage(
    "3604010548656c6c6f8008202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202cd094d0bcd0b8d182d180d0b8d0b920d098d0b2d0b0d0bdd0bed0b2d0b8d18720d09fd0b5d182d180d0bed0b200",
    true
  );

  t.is(buf.readString(), "Hello");
  t.is(buf.readString(), " ".repeat(1024));
  t.is(buf.readString(), "Дмитрий Иванович Петров");
  t.is(buf.readString(), "");
  t.false(buf.hasBytesLeft());
});

test("writes a string", (t) => {
  const buf = new MessageWriter();

  buf.writeString("Hello");
  buf.writeString(" ".repeat(1024));
  buf.writeString("Дмитрий Иванович Петров");
  buf.writeString("");

  t.is(
    buf.buffer.toString("hex"),
    "0548656c6c6f8008202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202cd094d0bcd0b8d182d180d0b8d0b920d098d0b2d0b0d0bdd0bed0b2d0b8d18720d09fd0b5d182d180d0bed0b200"
  );
  t.is(buf.length, 1078);
});

test("reads bytes", (t) => {
  const buf = MessageReader.fromMessage("0200010a0b", true);

  t.is(buf.readBytes(2).buffer.toString("hex"), "0a0b");
});

test("writes bytes", (t) => {
  const buf = new MessageWriter();

  buf.writeBytes([0, 1, 2, 3]);

  t.is(buf.buffer.toString("hex"), "00010203");
});

test("reads a message", (t) => {
  let buf = MessageReader.fromMessage("12003205000104736f6d6507000206737472696e67", true);

  t.is(buf.length, 0x0012);
  t.is(buf.tag, 0x32);

  let one = buf.readMessage();
  let two = buf.readMessage();

  t.truthy(one);
  t.is(one!.length, 0x05);
  t.is(one!.tag, 0x01);
  t.is(one!.readString(), "some");
  t.false(one!.hasBytesLeft());

  t.truthy(two);
  t.is(two!.length, 0x07);
  t.is(two!.tag, 0x02);
  t.is(two!.readString(), "string");
  t.false(two!.hasBytesLeft());

  t.false(buf.hasBytesLeft());
});

test("writes a message", (t) => {
  let buf = new MessageWriter();

  buf.startMessage(0x32);
  buf.startMessage(0x01);
  buf.writeString("some");
  buf.endMessage();
  buf.startMessage(0x02);
  buf.writeString("string");
  buf.endMessage();
  buf.endMessage();

  t.is(buf.buffer.toString("hex"), "12003205000104736f6d6507000206737472696e67");
});

test("reads a bitfield", (t) => {
  let buf = MessageReader.fromRawBytes("6e", true);

  t.deepEqual(buf.readBitfield(), [
    false,
    true,
    true,
    false,
    true,
    true,
    true,
    false
  ]);
  t.false(buf.hasBytesLeft());
});

test("writes a bitfield", (t) => {
  let buf = new MessageWriter();

  buf.writeBitfield([
    false,
    true,
    true,
    false,
    true,
    true,
    true,
    false
  ]);

  t.is(buf.buffer.toString("hex"), "6e");
});

test("reads a long bitfield", (t) => {
  let buf = MessageReader.fromRawBytes('a52e', true);

  t.deepEqual(buf.readBitfield(16), [
    true,
    false,
    true,
    false,
    false,
    true,
    false,
    true,
    false,
    false,
    true,
    false,
    true,
    true,
    true,
    false,
  ]);
  t.false(buf.hasBytesLeft());
});

test("writes a long bitfield", (t) => {
  let buf = new MessageWriter();

  buf.writeBitfield([
    true,
    false,
    true,
    false,
    false,
    true,
    false,
    true,
    false,
    false,
    true,
    false,
    true,
    true,
    true,
    false,
  ]);

  t.is(buf.buffer.toString("hex"), "a52e");
});
