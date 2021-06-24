import { randomBoolean, randomFromArray } from "../util/functions";
import { Level, SystemType } from "../types/enums";
import { Bitfield } from "../types";

type DoorList = {
  [key in SystemType]?: readonly number[];
};

const DOORS_THE_SKELD: Readonly<DoorList> = {
  [SystemType.Electrical]: [9],
  [SystemType.LowerEngine]: [4, 11],
  [SystemType.UpperEngine]: [2, 5],
  [SystemType.Security]: [6],
  [SystemType.Medbay]: [10],
  [SystemType.Storage]: [1, 7, 12],
  [SystemType.Cafeteria]: [0, 3, 8],
} as const;
const DOORS_MIRA_HQ: Readonly<DoorList> = {} as const;
const DOORS_POLUS: Readonly<DoorList> = {
  [SystemType.Electrical]: [0, 1, 2],
  [SystemType.Oxygen]: [3, 4],
  [SystemType.Weapons]: [5],
  [SystemType.Communications]: [6],
  [SystemType.Office]: [7, 8],
  [SystemType.Laboratory]: [9, 10],
  [SystemType.Storage]: [11],
} as const;
const DOORS_AIRSHIP: Readonly<DoorList> = {
  [SystemType.Communications]: [0, 1, 2, 3],
  [SystemType.Brig]: [4, 5, 6],
  [SystemType.Kitchen]: [7, 8, 9],
  [SystemType.MainHall]: [10, 11],
  [SystemType.Records]: [12, 13, 14],
  [SystemType.Lounge]: [15, 16, 17, 18],
  [SystemType.Medical]: [19, 20],
} as const;
const DOORS_SUBMERGED: Readonly<DoorList> = {} as const;

const DOOR_NAMES_THE_SKELD: readonly string[] = [
  "Cafeteria",
  "Storage",
  "Upper Engine",
  "Cafeteria",
  "Lower Engine",
  "Upper Engine",
  "Security",
  "Storage",
  "Cafeteria",
  "Electrical",
  "Medbay",
  "Lower Engine",
  "Storage",
] as const;
const DOOR_NAMES_MIRA_HQ: readonly string[] = [] as const;
const DOOR_NAMES_POLUS: readonly string[] = [
  "Outside to Electrical",
  "Inside Electrical",
  "O2-to-Electrical Hallway (Top)",
  "O2-to-Electrical Hallway (Bottom)",
  "Outside to O2",
  "Weapons",
  "Communications",
  "Office (Right)",
  "Office (Left)",
  "Drill",
  "Outside to Medbay",
  "Storage",
] as const;
const DOOR_NAMES_AIRSHIP: readonly string[] = [
  "Cockpit",
  "Engine (Left)",
  "Communications",
  "Armory (Top)",
  "Engine (Top)",
  "Vault Room",
  "Gap Room (Left)",
  "Armory (Bottom)",
  "Viewing Deck",
  "Portrait Hall (Left)",
  "Engine (Right)",
  "Showers (Left)",
  "Gap Room (Right)",
  "Lounge Room (Left)",
  "Showers (Top)",
  "Bathroom (Left)",
  "Bathroom (Center Left)",
  "Bathroom (Center Right)",
  "Bathroom (Right)",
  "Medical (Left)",
  "Medical (Top)",
] as const;
const DOOR_NAMES_SUBMERGED: readonly string[] = [] as const;

const DOOR_COUNT_THE_SKELD: number = Object.values(DOORS_THE_SKELD).flat().length;
const DOOR_COUNT_MIRA_HQ: number = Object.values(DOORS_MIRA_HQ).flat().length;
const DOOR_COUNT_POLUS: number = Object.values(DOORS_POLUS).flat().length;
const DOOR_COUNT_AIRSHIP: number = Object.values(DOORS_AIRSHIP).flat().length;
const DOOR_COUNT_SUBMERGED: number = Object.values(DOORS_AIRSHIP).flat().length;

/**
 * A helper class for retrieving static data for doors.
 */
export class Doors {
  /**
   * Gets each system and their respective doors for the given level.
   *
   * @param level - The level whose systems and corresponding doors should be returned
   */
  static forLevel(level: Level): Readonly<DoorList> {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return DOORS_THE_SKELD;
      case Level.MiraHq:
        return DOORS_MIRA_HQ;
      case Level.Polus:
        return DOORS_POLUS;
      case Level.Airship:
        return DOORS_AIRSHIP;
      case Level.Submerged:
        return DOORS_SUBMERGED;
    }
  }

  /**
   * Gets the display names for the doors on the given level.
   *
   * @param level - The level whose door display names should be returned
   */
  static namesForLevel(level: Level): readonly string[] {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return DOOR_NAMES_THE_SKELD;
      case Level.MiraHq:
        return DOOR_NAMES_MIRA_HQ;
      case Level.Polus:
        return DOOR_NAMES_POLUS;
      case Level.Airship:
        return DOOR_NAMES_AIRSHIP;
      case Level.Submerged:
        return DOOR_NAMES_SUBMERGED;
    }
  }

  /**
   * Gets the number of doors on the given level.
   *
   * @param level - The level whose number of doors should be returned
   */
  static countForLevel(level: Level): number {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return DOOR_COUNT_THE_SKELD;
      case Level.MiraHq:
        return DOOR_COUNT_MIRA_HQ;
      case Level.Polus:
        return DOOR_COUNT_POLUS;
      case Level.Airship:
        return DOOR_COUNT_AIRSHIP;
      case Level.Submerged:
        return DOOR_COUNT_SUBMERGED;
    }
  }
}

type StaticRoom = {
  room: number;
  doors: readonly number[];
};

type StaticDoorsFromLevel<T extends Level> =
  T extends Level.Airship ? typeof STATIC_DOORS_AIRSHIP
    : undefined;

type StaticRoomsFromLevel<T extends Level> =
  T extends Level.Airship ? typeof STATIC_ROOMS_AIRSHIP
    : undefined;

type StaticDoorExitsFromLevel<T extends Level> =
  T extends Level.Airship ? typeof STATIC_DOOR_EXITS_AIRSHIP
    : [];

enum StaticRoomsAirship {
  TopLeft,
  TopCenter,
  TopRight,
  CenterRight,
  Center,
  BottomRight,
  BottomLeft,
}

/* eslint-disable @typescript-eslint/naming-convention */
const STATIC_DOORS_AIRSHIP = {
  TopLeftEast: 8,
  TopLeftSouth: 4,
  TopLeftWest: 10,
  TopCenterSouth: 3,
  TopRightSouth: 2,
  TopRightWest: 7,
  CenterLeftEast: 5,
  CenterLeftWest: 11,
  CenterSouth: 1,
  CenterRightWest: 6,
  BottomRightNorth: 0,
  BottomRightWest: 9,
} as const;

const STATIC_ROOMS_AIRSHIP: {[key in StaticRoomsAirship]: StaticRoom} = {
  [StaticRoomsAirship.TopLeft]: {
    room: StaticRoomsAirship.TopLeft,
    doors: [STATIC_DOORS_AIRSHIP.TopLeftEast, STATIC_DOORS_AIRSHIP.TopLeftSouth],
  },
  [StaticRoomsAirship.TopCenter]: {
    room: StaticRoomsAirship.TopCenter,
    doors: [STATIC_DOORS_AIRSHIP.TopLeftEast, STATIC_DOORS_AIRSHIP.TopCenterSouth, STATIC_DOORS_AIRSHIP.TopRightWest],
  },
  [StaticRoomsAirship.TopRight]: {
    room: StaticRoomsAirship.TopRight,
    doors: [STATIC_DOORS_AIRSHIP.TopRightSouth, STATIC_DOORS_AIRSHIP.TopRightWest],
  },
  [StaticRoomsAirship.CenterRight]: {
    room: StaticRoomsAirship.CenterRight,
    doors: [STATIC_DOORS_AIRSHIP.TopRightSouth, STATIC_DOORS_AIRSHIP.CenterRightWest, STATIC_DOORS_AIRSHIP.BottomRightNorth],
  },
  [StaticRoomsAirship.Center]: {
    room: StaticRoomsAirship.Center,
    doors: [STATIC_DOORS_AIRSHIP.TopCenterSouth, STATIC_DOORS_AIRSHIP.CenterRightWest, STATIC_DOORS_AIRSHIP.CenterSouth, STATIC_DOORS_AIRSHIP.CenterLeftEast],
  },
  [StaticRoomsAirship.BottomRight]: {
    room: StaticRoomsAirship.BottomRight,
    doors: [STATIC_DOORS_AIRSHIP.BottomRightNorth, STATIC_DOORS_AIRSHIP.BottomRightWest],
  },
  // Center left and bottom center combined via the hallway
  [StaticRoomsAirship.BottomLeft]: {
    room: StaticRoomsAirship.BottomLeft,
    doors: [STATIC_DOORS_AIRSHIP.TopLeftSouth, STATIC_DOORS_AIRSHIP.CenterLeftEast, STATIC_DOORS_AIRSHIP.CenterSouth, STATIC_DOORS_AIRSHIP.BottomRightWest],
  },
} as const;
/* eslint-enable @typescript-eslint/naming-convention */

const STATIC_DOOR_EXITS_AIRSHIP = [
  STATIC_DOORS_AIRSHIP.TopLeftWest,
  STATIC_DOORS_AIRSHIP.CenterLeftWest,
] as const;

/**
 * A helper class for retrieving static data for static doors.
 */
export class StaticDoors {
  /**
   * Gets all static door data for the given level.
   *
   * @typeParam T - The type of `level`
   * @param level - The level whose static doors should be returned
   */
  static forLevel<T extends Level>(level: T): StaticDoorsFromLevel<T> {
    switch (level) {
      case Level.Airship:
        return STATIC_DOORS_AIRSHIP as StaticDoorsFromLevel<T>;
      default:
        return undefined as StaticDoorsFromLevel<T>;
    }
  }

  /**
   * Gets all static exit doors data for the given level.
   *
   * @typeParam T - The type of `level`
   * @param level - The level whose static exit doors should be returned
   */
  static exitsForLevel<T extends Level>(level: T): StaticDoorExitsFromLevel<T> {
    switch (level) {
      case Level.Airship:
        return STATIC_DOOR_EXITS_AIRSHIP as StaticDoorExitsFromLevel<T>;
      default:
        return [] as StaticDoorExitsFromLevel<T>;
    }
  }
}

/**
 * A helper class for retrieving static data for rooms containing static doors.
 */
export class StaticRooms {
  /**
   * Gets all static door room data for the given level.
   *
   * @typeParam T - The type of `level`
   * @param level - The level whose static door rooms should be returned
   */
  static forLevel<T extends Level>(level: T): StaticRoomsFromLevel<T> {
    switch (level) {
      case Level.Airship:
        return STATIC_ROOMS_AIRSHIP as StaticRoomsFromLevel<T>;
      default:
        return undefined as StaticRoomsFromLevel<T>;
    }
  }

  /**
   * Gets a Bitfield of booleans representing a path for players to take through
   * linked static door rooms.
   *
   * @param level - The level for which the static door room path will be generated
   */
  static generatePathForLevel(level: Level): Bitfield {
    const allRooms = Object.values(StaticRooms.forLevel(level) ?? []);
    const allDoors = Object.values(StaticDoors.forLevel(level) ?? {});
    const allExits = StaticDoors.exitsForLevel(level);

    if (allRooms.length === 0 || allDoors.length === 0 || allExits.length === 0) {
      return new Bitfield([]);
    }

    // Close all doors by default
    const doors = new Bitfield(new Array(allDoors.length).fill(false));
    // All rooms that have been visited by the loop
    const visitedRooms: Set<StaticRoom> = new Set();
    // The current room, starting with the first in the array
    let currentRoom: StaticRoom = allRooms[0];
    // Loop counter to stop after 10000 rounds
    let count = 0;
    // How to find neighboring rooms
    const findNeighbor = (door: number) => (room: StaticRoom): boolean => room.room !== currentRoom.room && room.doors.includes(door);

    // Loop until we have gone through all rooms, or 10000 rounds
    while (visitedRooms.size < allRooms.length && count++ < 10000) {
      // Choose a random door in the room
      const door = randomFromArray(currentRoom.doors as number[]);
      // Get the first neighboring room that shares the randomly selected door
      const neighbor = allRooms.find(findNeighbor(door));

      if (neighbor === undefined) {
        continue;
      }

      if (!visitedRooms.has(neighbor)) {
        // Add the neighboring room to the set of rooms
        visitedRooms.add(neighbor);

        // If it was not already in the set, then also open the door
        doors.set(door);
      }

      // 50% chance
      if (randomBoolean()) {
        // Add the current room to the set of rooms
        visitedRooms.add(currentRoom);

        // Set the current room to the neighboring room
        currentRoom = neighbor;
      }
    }

    // Select one of the exits to be open
    const exitFlag = randomBoolean();

    doors.update(allExits[0], exitFlag);
    doors.update(allExits[1], !exitFlag);

    return doors;
  }
}
