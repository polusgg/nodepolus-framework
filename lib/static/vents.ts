import { Level, SystemType } from "../types/enums";
import { LevelVent, Vector2 } from "../types";

const VENTS_THE_SKELD: readonly LevelVent[] = [
  { id: 0, name: "In Admin", system: SystemType.Admin, position: new Vector2(0, 0) },
  { id: 1, name: "In the right hallway", system: SystemType.Hallway, position: new Vector2(0, 0) },
  { id: 2, name: "In the Cafeteria", system: SystemType.Cafeteria, position: new Vector2(0, 0) },
  { id: 3, name: "In Electrical", system: SystemType.Electrical, position: new Vector2(0, 0) },
  { id: 4, name: "In the Upper Engine", system: SystemType.UpperEngine, position: new Vector2(0, 0) },
  { id: 5, name: "In Security", system: SystemType.Security, position: new Vector2(0, 0) },
  { id: 6, name: "In Medbay", system: SystemType.Medbay, position: new Vector2(0, 0) },
  { id: 7, name: "In Weapons", system: SystemType.Weapons, position: new Vector2(0, 0) },
  { id: 8, name: "In Lower Reactor", system: SystemType.Reactor, position: new Vector2(0, 0) },
  { id: 9, name: "In the Lower Engine", system: SystemType.Shields, position: new Vector2(0, 0) },
  { id: 10, name: "In Shields", system: SystemType.Reactor, position: new Vector2(0, 0) },
  { id: 11, name: "In Upper Reactor", system: SystemType.Navigation, position: new Vector2(0, 0) },
  { id: 12, name: "In Upper Navigation", system: SystemType.Navigation, position: new Vector2(0, 0) },
  { id: 13, name: "In Lower Navigation", system: SystemType.Navigation, position: new Vector2(0, 0) },
];

const VENTS_MIRA_HQ: readonly LevelVent[] = [
  { id: 1, name: "On the Balcony", system: SystemType.Balcony, position: new Vector2(0, 0) },
  { id: 2, name: "In the Cafeteria", system: SystemType.Cafeteria, position: new Vector2(0, 0) },
  { id: 3, name: "In the Reactor", system: SystemType.Reactor, position: new Vector2(0, 0) },
  { id: 4, name: "In the Laboratory", system: SystemType.Laboratory, position: new Vector2(0, 0) },
  { id: 5, name: "In the Office", system: SystemType.Office, position: new Vector2(0, 0) },
  { id: 6, name: "In Admin", system: SystemType.Admin, position: new Vector2(0, 0) },
  { id: 7, name: "In the Greenhouse", system: SystemType.Greenhouse, position: new Vector2(0, 0) },
  { id: 8, name: "In Medbay", system: SystemType.Medbay, position: new Vector2(0, 0) },
  { id: 9, name: "In Decontamination", system: SystemType.Decontamination, position: new Vector2(0, 0) },
  { id: 10, name: "In the Locker Room", system: SystemType.LockerRoom, position: new Vector2(0, 0) },
  { id: 11, name: "At the Launchpad", system: SystemType.Launchpad, position: new Vector2(0, 0) },
];

const VENTS_POLUS: readonly LevelVent[] = [
  { id: 0, name: "By Security", system: SystemType.Outside, position: new Vector2(0, 0) },
  { id: 1, name: "Outside Electrical", system: SystemType.Outside, position: new Vector2(0, 0) },
  { id: 2, name: "In O2", system: SystemType.Oxygen, position: new Vector2(0, 0) },
  { id: 3, name: "Outside Communications", system: SystemType.Outside, position: new Vector2(0, 0) },
  { id: 4, name: "In the Office", system: SystemType.Office, position: new Vector2(0, 0) },
  { id: 5, name: "In Admin", system: SystemType.Admin, position: new Vector2(0, 0) },
  { id: 6, name: "In the Laboratory", system: SystemType.Laboratory, position: new Vector2(0, 0) },
  { id: 7, name: "By the Lava Pool", system: SystemType.Outside, position: new Vector2(0, 0) },
  { id: 8, name: "In Storage", system: SystemType.Storage, position: new Vector2(0, 0) },
  { id: 9, name: "By the right Seismic Stabilizer", system: SystemType.Outside, position: new Vector2(0, 0) },
  { id: 10, name: "By the left Seismic Stabilizer", system: SystemType.Outside, position: new Vector2(0, 0) },
  { id: 11, name: "Outside Admin", system: SystemType.Outside, position: new Vector2(0, 0) },
];

const VENTS_AIRSHIP: readonly LevelVent[] = [
  { id: 0, name: "", system: SystemType.VaultRoom, position: new Vector2(0, 0) },
  { id: 1, name: "", system: SystemType.Cockpit, position: new Vector2(0, 0) },
  { id: 2, name: "", system: SystemType.ViewingDeck, position: new Vector2(0, 0) },
  { id: 3, name: "", system: SystemType.Engine, position: new Vector2(0, 0) },
  { id: 4, name: "", system: SystemType.Kitchen, position: new Vector2(0, 0) },
  { id: 5, name: "", system: SystemType.MainHall, position: new Vector2(0, 0) },
  { id: 6, name: "", system: SystemType.MainHall, position: new Vector2(0, 0) },
  { id: 7, name: "", system: SystemType.GapRoom, position: new Vector2(0, 0) },
  { id: 8, name: "", system: SystemType.GapRoom, position: new Vector2(0, 0) },
  { id: 9, name: "", system: SystemType.Showers, position: new Vector2(0, 0) },
  { id: 10, name: "", system: SystemType.Records, position: new Vector2(0, 0) },
  { id: 11, name: "", system: SystemType.Storage, position: new Vector2(0, 0) },
];

export class Vents {
  static forSkeld(): readonly LevelVent[] {
    return VENTS_THE_SKELD;
  }

  static forMiraHq(): readonly LevelVent[] {
    return VENTS_MIRA_HQ;
  }

  static forPolus(): readonly LevelVent[] {
    return VENTS_POLUS;
  }

  static forAirship(): readonly LevelVent[] {
    return VENTS_AIRSHIP;
  }

  static forLevel(level: Level): readonly LevelVent[] {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return this.forSkeld();
      case Level.MiraHq:
        return this.forMiraHq();
      case Level.Polus:
        return this.forPolus();
      case Level.Airship:
        return this.forAirship();
    }
  }

  static forSkeldFromId(ids: number[]): LevelVent[] {
    return this.forSkeld().filter(v => ids.includes(v.id));
  }

  static forMiraHqFromId(ids: number[]): LevelVent[] {
    return this.forMiraHq().filter(v => ids.includes(v.id));
  }

  static forPolusFromId(ids: number[]): LevelVent[] {
    return this.forPolus().filter(v => ids.includes(v.id));
  }

  static forAirshipFromId(ids: number[]): LevelVent[] {
    return this.forAirship().filter(v => ids.includes(v.id));
  }

  static forLevelFromId(level: Level, ids: number[]): LevelVent[] {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return this.forSkeldFromId(ids);
      case Level.MiraHq:
        return this.forMiraHqFromId(ids);
      case Level.Polus:
        return this.forPolusFromId(ids);
      case Level.Airship:
        return this.forAirshipFromId(ids);
    }
  }

  static forSkeldFromPosition(position: Vector2): LevelVent | undefined {
    return this.forSkeld().find(v => v.position.equals(position));
  }

  static forMiraHqFromPosition(position: Vector2): LevelVent | undefined {
    return this.forMiraHq().find(v => v.position.equals(position));
  }

  static forPolusFromPosition(position: Vector2): LevelVent | undefined {
    return this.forPolus().find(v => v.position.equals(position));
  }

  static forAirshipFromPosition(position: Vector2): LevelVent | undefined {
    return this.forAirship().find(v => v.position.equals(position));
  }

  static forLevelFromPosition(level: Level, position: Vector2): LevelVent | undefined {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return this.forSkeldFromPosition(position);
      case Level.MiraHq:
        return this.forMiraHqFromPosition(position);
      case Level.Polus:
        return this.forPolusFromPosition(position);
      case Level.Airship:
        return this.forAirshipFromPosition(position);
    }
  }
}
