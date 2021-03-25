import { TextComponent } from "../../src/api/text";
import test from "ava";

test("encodes text", t => {
  const text = new TextComponent().add("ABC");

  t.is(text.toString(), "ABC");
});

test("encodes colored text", t => {
  const text = new TextComponent()
    .setColor(255, 0, 128)
    .add("ABC");

  t.is(text.toString(), "[FF0080FF]ABC");
});

test("encodes colored text with alpha channel", t => {
  const text = new TextComponent()
    .setColor(255, 0, 128)
    .setOpacity(64)
    .add("ABC");

  t.is(text.toString(), "[FF008040]ABC");
});

test("encodes split colored text with alpha channel", t => {
  const text = new TextComponent()
    .setColor(255, 0, 128)
    .setOpacity(64)
    .add("ABC")
    .add("XYZ");

  t.is(text.toString(), "[FF008040]ABCXYZ");
});

test("encodes multiple colored texts with alpha channels", t => {
  const text = new TextComponent()
    .setColor(255, 0, 128)
    .setOpacity(64)
    .add("ABC")
    .setColor(48, 72, 91)
    .setOpacity(96)
    .add("XYZ")
    .setOpacity(24)
    .setColor(91, 22, 11);

  t.is(text.toString(), "[FF008040]ABC[30485B60]XYZ");
});

test("encodes links from a string", t => {
  const text = new TextComponent()
    .link("google", "https://www.google.com/");

  t.is(text.toString(), "[https://www.google.com/]google");
});

test("encodes links from a URL object", t => {
  const text = new TextComponent()
    .link("google", new URL("https://www.google.com/"));

  t.is(text.toString(), "[https://www.google.com/]google");
});

test("encodes complex text", t => {
  const text = new TextComponent()
    .link("Google", new URL("https://www.google.com/"))
    .add("Node")
    .reset()
    .reset()
    .reset()
    .add("Polus")
    .setColor(1, 2, 3)
    .add("might")
    .setOpacity(4)
    .add("break")
    .reset()
    .add("who")
    .link("knows", "hsecret: sauce");

  t.is(text.toString(), "[https://www.google.com/]Google[]NodePolus[010203FF]might[01020304]break[]who[hsecret: sauce]knows");
});

test("decodes complex text", t => {
  const text = TextComponent.from("ABC[FF00FF00]Outer[]Empty[https://www.google.com/]link[00FF00FF]Color");

  t.deepEqual(text.getElements(), [
    {
      type: 0,
      content: "ABC",
      color: [255, 255, 255],
      opacity: 255,
    },
    {
      type: 0,
      content: "Outer",
      color: [255, 0, 255],
      opacity: 0,
    },
    {
      type: 2,
    },
    {
      type: 0,
      content: "Empty",
      color: [255, 255, 255],
      opacity: 255,
    },
    {
      type: 1,
      content: "link",
      link: "https://www.google.com/",
    },
    {
      type: 0,
      content: "Color",
      color: [0, 255, 0],
      opacity: 255,
    },
  ]);
});
