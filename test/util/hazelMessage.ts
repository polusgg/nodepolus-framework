import { MessageReader, MessageWriter } from "../../lib/util/hazelMessage";
import test from "ava";

type Example = {
  someString: string;
  someNumber: number;
};

test("reads a boolean", t => {
  const buf = MessageReader.fromMessage("0200010100");

  t.true(buf.readBoolean());
  t.false(buf.readBoolean());
  t.false(buf.hasBytesLeft());
});

test("writes a boolean", t => {
  const buf = new MessageWriter();

  buf.writeBoolean(true);
  buf.writeBoolean(false);

  t.is(buf.buffer.toString("hex"), "0100");
  t.is(buf.length, 2);
});

test("reads an int8", t => {
  const buf = MessageReader.fromMessage("0400017ff05680");

  t.is(buf.readSByte(), 127);
  t.is(buf.readSByte(), -16);
  t.is(buf.readSByte(), 86);
  t.is(buf.readSByte(), -128);
  t.false(buf.hasBytesLeft());
});

test("writes an int8", t => {
  const buf = new MessageWriter();

  buf.writeSByte(127);
  buf.writeSByte(-16);
  buf.writeSByte(86);
  buf.writeSByte(-128);

  t.is(buf.buffer.toString("hex"), "7ff05680");
  t.is(buf.length, 4);
});

test("reads a uint8", t => {
  const buf = MessageReader.fromMessage("030001fff056");

  t.is(buf.readByte(), 255);
  t.is(buf.readByte(), 240);
  t.is(buf.readByte(), 86);
  t.false(buf.hasBytesLeft());
});

test("writes a uint8", t => {
  const buf = new MessageWriter();

  buf.writeByte(255);
  buf.writeByte(240);
  buf.writeByte(86);

  t.is(buf.buffer.toString("hex"), "fff056");
  t.is(buf.length, 3);
});

test("reads an int16", t => {
  const buf = MessageReader.fromMessage("080001ff7ff0f056560080");

  t.is(buf.readInt16(), 32767);
  t.is(buf.readInt16(), -3856);
  t.is(buf.readInt16(), 22102);
  t.is(buf.readInt16(), -32768);
  t.false(buf.hasBytesLeft());
});

test("writes an int16", t => {
  const buf = new MessageWriter();

  buf.writeInt16(32767);
  buf.writeInt16(-3856);
  buf.writeInt16(22102);
  buf.writeInt16(-32768);

  t.is(buf.buffer.toString("hex"), "ff7ff0f056560080");
  t.is(buf.length, 8);
});

test("reads a uint16", t => {
  const buf = MessageReader.fromMessage("060001fffff0f05656");

  t.is(buf.readUInt16(), 65535);
  t.is(buf.readUInt16(), 61680);
  t.is(buf.readUInt16(), 22102);
  t.false(buf.hasBytesLeft());
});

test("writes a uint16", t => {
  const buf = new MessageWriter();

  buf.writeUInt16(65535);
  buf.writeUInt16(61680);
  buf.writeUInt16(22102);

  t.is(buf.buffer.toString("hex"), "fffff0f05656");
  t.is(buf.length, 6);
});

test("reads an int32", t => {
  const buf = MessageReader.fromMessage("100001ffffff7ff0f0f0f05656565600000080");

  t.is(buf.readInt32(), 2147483647);
  t.is(buf.readInt32(), -252645136);
  t.is(buf.readInt32(), 1448498774);
  t.is(buf.readInt32(), -2147483648);
  t.false(buf.hasBytesLeft());
});

test("writes an int32", t => {
  const buf = new MessageWriter();

  buf.writeInt32(2147483647);
  buf.writeInt32(-252645136);
  buf.writeInt32(1448498774);
  buf.writeInt32(-2147483648);

  t.is(buf.buffer.toString("hex"), "ffffff7ff0f0f0f05656565600000080");
  t.is(buf.length, 16);
});

test("reads a uint32", t => {
  const buf = MessageReader.fromMessage("0c0001fffffffff0f0f0f056565656");

  t.is(buf.readUInt32(), 4294967295);
  t.is(buf.readUInt32(), 4042322160);
  t.is(buf.readUInt32(), 1448498774);
  t.false(buf.hasBytesLeft());
});

test("writes a uint32", t => {
  const buf = new MessageWriter();

  buf.writeUInt32(4294967295);
  buf.writeUInt32(4042322160);
  buf.writeUInt32(1448498774);

  t.is(buf.buffer.toString("hex"), "fffffffff0f0f0f056565656");
  t.is(buf.length, 12);
});

test("reads a float32", t => {
  const buf = MessageReader.fromMessage("0c000100401cc600401c460000803f");

  t.is(buf.readFloat32(), -10000);
  t.is(buf.readFloat32(), 10000);
  t.is(buf.readFloat32(), 1);
  t.false(buf.hasBytesLeft());
});

test("writes a float32", t => {
  const buf = new MessageWriter();

  buf.writeFloat32(-10000);
  buf.writeFloat32(10000);
  buf.writeFloat32(1);

  t.is(buf.buffer.toString("hex"), "00401cc600401c460000803f");
  t.is(buf.length, 12);
});

test("reads a packed int32", t => {
  const buf = MessageReader.fromMessage("1a00010001027f8001ff01ffff7fffffffff07ffffffff0f8080808008");

  t.is(buf.readPackedInt32(), 0);
  t.is(buf.readPackedInt32(), 1);
  t.is(buf.readPackedInt32(), 2);
  t.is(buf.readPackedInt32(), 127);
  t.is(buf.readPackedInt32(), 128);
  t.is(buf.readPackedInt32(), 255);
  t.is(buf.readPackedInt32(), 2097151);
  t.is(buf.readPackedInt32(), 2147483647);
  t.is(buf.readPackedInt32(), -1);
  t.is(buf.readPackedInt32(), -2147483648);
  t.false(buf.hasBytesLeft());
});

test("writes a packed int32", t => {
  const buf = new MessageWriter();

  buf.writePackedInt32(0);
  buf.writePackedInt32(1);
  buf.writePackedInt32(2);
  buf.writePackedInt32(127);
  buf.writePackedInt32(128);
  buf.writePackedInt32(255);
  buf.writePackedInt32(2097151);
  buf.writePackedInt32(2147483647);
  buf.writePackedInt32(-1);
  buf.writePackedInt32(-2147483648);

  t.is(buf.buffer.toString("hex"), "0001027f8001ff01ffff7fffffffff07ffffffff0f8080808008");
  t.is(buf.length, 26);
});

test("reads a packed uint32", t => {
  const buf = MessageReader.fromMessage("1a00010001027f8001ff01ffff7fffffffff07ffffffff0f8080808008");

  t.is(buf.readPackedUInt32(), 0);
  t.is(buf.readPackedUInt32(), 1);
  t.is(buf.readPackedUInt32(), 2);
  t.is(buf.readPackedUInt32(), 127);
  t.is(buf.readPackedUInt32(), 128);
  t.is(buf.readPackedUInt32(), 255);
  t.is(buf.readPackedUInt32(), 2097151);
  t.is(buf.readPackedUInt32(), 2147483647);
  t.is(buf.readPackedUInt32(), 4294967295);
  t.is(buf.readPackedUInt32(), 2147483648);
  t.false(buf.hasBytesLeft());
});

test("writes a packed uint32", t => {
  const buf = new MessageWriter();

  buf.writePackedUInt32(0);
  buf.writePackedUInt32(1);
  buf.writePackedUInt32(2);
  buf.writePackedUInt32(127);
  buf.writePackedUInt32(128);
  buf.writePackedUInt32(255);
  buf.writePackedUInt32(2097151);
  buf.writePackedUInt32(2147483647);
  buf.writePackedUInt32(4294967295);
  buf.writePackedUInt32(2147483648);

  t.is(buf.buffer.toString("hex"), "0001027f8001ff01ffff7fffffffff07ffffffff0f8080808008");
  t.is(buf.length, 26);
});

test("reads a string", t => {
  const buf = MessageReader.fromMessage(
    "3604010548656c6c6f8008202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202cd094d0bcd0b8d182d180d0b8d0b920d098d0b2d0b0d0bdd0bed0b2d0b8d18720d09fd0b5d182d180d0bed0b200",
  );

  t.is(buf.readString(), "Hello");
  t.is(buf.readString(), " ".repeat(1024));
  t.is(buf.readString(), "Дмитрий Иванович Петров");
  t.is(buf.readString(), "");
  t.false(buf.hasBytesLeft());
});

test("writes a string", t => {
  const buf = new MessageWriter();

  buf.writeString("Hello");
  buf.writeString(" ".repeat(1024));
  buf.writeString("Дмитрий Иванович Петров");
  buf.writeString("");

  t.is(
    buf.buffer.toString("hex"),
    "0548656c6c6f8008202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202cd094d0bcd0b8d182d180d0b8d0b920d098d0b2d0b0d0bdd0bed0b2d0b8d18720d09fd0b5d182d180d0bed0b200",
  );
  t.is(buf.length, 1078);
});

test("reads bytes", t => {
  const buf = MessageReader.fromMessage("0200010a0b");

  t.is(buf.readBytes(2).buffer.toString("hex"), "0a0b");
});

test("writes bytes", t => {
  const buf = new MessageWriter();

  buf.writeBytes([0, 1, 2, 3]);

  t.is(buf.buffer.toString("hex"), "00010203");
});

test("reads a message", t => {
  const buf = MessageReader.fromMessage("12003205000104736f6d6507000206737472696e67");

  t.is(buf.length, 0x0012);
  t.is(buf.tag, 0x32);

  const one = buf.readMessage();
  const two = buf.readMessage();

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

test("writes a message", t => {
  const buf = new MessageWriter();

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

test("reads a bitfield", t => {
  const buf = MessageReader.fromRawBytes("6e");

  t.deepEqual(buf.readBitfield(), [false, true, true, false, true, true, true, false]);
  t.false(buf.hasBytesLeft());
});

test("writes a bitfield", t => {
  const buf = new MessageWriter();

  buf.writeBitfield([false, true, true, false, true, true, true, false]);

  t.is(buf.buffer.toString("hex"), "6e");
});

test("reads a long bitfield", t => {
  const buf = MessageReader.fromRawBytes("a52e");

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

test("writes a long bitfield", t => {
  const buf = new MessageWriter();

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

test("reads a list of objects", t => {
  const buf = MessageReader.fromMessage("0d000103010000000200000003000000");
  const results = buf.readList(sub => sub.readInt32());

  t.is(results.length, 3);
  t.is(results[0], 1);
  t.is(results[1], 2);
  t.is(results[2], 3);
  t.false(buf.hasBytesLeft());
});

test("writes a list of objects", t => {
  const buf = new MessageWriter();
  const list = [1, 2, 3];

  buf.startMessage(1);
  buf.writeList(list, (writer, item) => writer.writeInt32(item));
  buf.endMessage();

  t.is(buf.buffer.toString("hex"), "0d000103010000000200000003000000");
});

test("reads a list of messages", t => {
  const buf = MessageReader.fromMessage("1300010205000104736f6d6507000206737472696e67", true);
  const results = buf.readMessageList(sub => sub.readString());

  t.is(results.length, 2);
  t.is(results[0], "some");
  t.is(results[1], "string");
  t.false(buf.hasBytesLeft());
});

test("reads a list of typed messages", t => {
  const buf = MessageReader.fromMessage("1d0000020a0000054a656e6e79ed5f84000c0001074d696e7574657320050800", true);
  const results = buf.readMessageList(
    (sub): Example => ({
      someString: sub.readString(),
      someNumber: sub.readUInt32(),
    }),
  );

  t.is(results.length, 2);
  t.is(results[0].someString, "Jenny");
  t.is(results[0].someNumber, 8675309);
  t.is(results[1].someString, "Minutes");
  t.is(results[1].someNumber, 525600);
  t.false(buf.hasBytesLeft());
});

test("writes a list of messages with custom tags", t => {
  const buf = new MessageWriter();
  const items: Example[] = [
    { someString: "Jenny",
      someNumber: 8675309 },
    { someString: "Minutes",
      someNumber: 525600 },
  ];

  buf.startMessage(0);
  buf.writeList(items, (writer, item, idx) => {
    writer.startMessage(idx);
    writer.writeString(item.someString);
    writer.writeUInt32(item.someNumber);
    writer.endMessage();
  });
  buf.endMessage();

  t.is(buf.buffer.toString("hex"), "1d0000020a0000054a656e6e79ed5f84000c0001074d696e7574657320050800");
});

test("writes a list of messages with zeroed tags", t => {
  const buf = new MessageWriter();
  const items: Example[] = [
    { someString: "Jenny",
      someNumber: 8675309 },
    { someString: "Minutes",
      someNumber: 525600 },
  ];

  buf.startMessage(0);
  buf.writeMessageList(items, (writer, item) => {
    writer.writeString(item.someString);
    writer.writeUInt32(item.someNumber);
  });
  buf.endMessage();

  t.is(buf.buffer.toString("hex"), "1d0000020a0000054a656e6e79ed5f84000c0000074d696e7574657320050800");
});

test("reads all child messages", t => {
  const buf = MessageReader.fromMessage("2300010f00030a576f7273742079656172e40700000e000509426573742079656172b1070000");
  const items: Example[] = [];

  buf.readAllChildMessages(child => {
    items.push({
      someString: child.readString(),
      someNumber: child.readUInt32(),
    });
  });

  t.is(items[0].someString, "Worst year");
  t.is(items[0].someNumber, 2020);
  t.is(items[1].someString, "Best year");
  t.is(items[1].someNumber, 1969);
});

test("reads remaining bytes", t => {
  const buf = MessageReader.fromMessage("0d00010600010f68656c6c6f66e6f642");

  const child = buf.readMessage();

  t.false(typeof child == "undefined");
  t.is(child!.readByte(), 15);
  t.is(child!.readRemainingBytes().buffer.toString(), "hello");
  t.false(child!.hasBytesLeft());
  t.is(buf.readUInt32(), 1123477094);
  t.false(buf.hasBytesLeft());
});
