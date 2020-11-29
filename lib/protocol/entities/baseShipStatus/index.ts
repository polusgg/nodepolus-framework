import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { DataPacket } from "../../packets/rootGamePackets/gameDataPackets/data";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SecurityCameraSystem } from "./systems/securityCameraSystem";
import { HudOverrideSystem } from "./systems/hudOverrideSystem";
import { AutoDoorsSystem } from "./systems/autoDoorsSystem";
import { LifeSuppSystem } from "./systems/lifeSuppSystem";
import { SabotageSystem } from "./systems/sabotageSystem";
import { MedScanSystem } from "./systems/medScanSystem";
import { ReactorSystem } from "./systems/reactorSystem";
import { BaseGameObject, Entity } from "../baseEntity";
import { SystemType } from "../../../types/systemType";
import { SwitchSystem } from "./systems/switchSystem";
import { DeconSystem } from "./systems/deconSystem";
import { DoorsSystem } from "./systems/doorsSystem";
import { HqHudSystem } from "./systems/hqHudSystem";
import { InternalSystemType } from "./systems/type";
import { BaseSystem } from "./systems/baseSystem";
import { InnerNetObjectType } from "../types";
import { Level } from "../../../types/level";
import { Connection } from "../../connection";
import { CloseDoorsOfTypePacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/closeDoorsOfType";
import { RepairAmount, RepairSystemPacket } from "../../packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";

export type System = AutoDoorsSystem
                   | DeconSystem
                   | DoorsSystem
                   | HqHudSystem
                   | HudOverrideSystem
                   | LifeSuppSystem
                   | MedScanSystem
                   | ReactorSystem
                   | SabotageSystem
                   | SecurityCameraSystem
                   | SwitchSystem

export abstract class BaseShipStatus<T, U extends Entity> extends BaseGameObject<T> {
  public systems: BaseSystem<System>[] = [];
  
  private level: Level;

  protected constructor(public type: InnerNetObjectType, netId: number, parent: U, public systemTypes: SystemType[]) {
    super(type, netId, parent);

    switch (type) {
      case InnerNetObjectType.ShipStatus:
        this.level = Level.TheSkeld;
        break;
      case InnerNetObjectType.Headquarters:
        this.level = Level.MiraHq;
        break;
      case InnerNetObjectType.PlanetMap:
        this.level = Level.Polus;
        break;
      default:
        throw new Error("Unsupported ShipStatus type: " + type);
    }

    this.initializeSystems();
  }

  private initializeSystems() {
    for (let i = 0; i < this.systemTypes.length; i++) {
      const type = this.systemTypes[i];
      
      switch (type) {
        case SystemType.Doors:
          if (this.level == Level.Polus) {
            this.systems[InternalSystemType.Doors] = new DoorsSystem();
          } else {
            this.systems[InternalSystemType.AutoDoors] = new AutoDoorsSystem();
          }
          break;
        case SystemType.Communications:
          if (this.level == Level.MiraHq) {
            this.systems[InternalSystemType.HqHud] = new HqHudSystem();
          } else {
            this.systems[InternalSystemType.HudOverride] = new HudOverrideSystem();
          }
          break;
        case SystemType.Decontamination:
          this.systems[InternalSystemType.Decon] = new DeconSystem();
          break;
        case SystemType.Decontamination2:
          this.systems[InternalSystemType.Decon2] = new DeconSystem();
          break;
        case SystemType.Electrical:
          this.systems[InternalSystemType.Switch] = new SwitchSystem();
          break;
        case SystemType.Laboratory:
        case SystemType.Reactor:
          this.systems[InternalSystemType.Reactor] = new ReactorSystem();
          break;
        case SystemType.Sabotage:
          this.systems[InternalSystemType.Sabotage] = new SabotageSystem();
          break;
        case SystemType.Security:
          this.systems[InternalSystemType.SecurityCamera] = new SecurityCameraSystem();
          break;
        default:
          throw new Error("Tried to get unimplemented system type: " + type);
      }
    }
  }

  private serializeSystemsToDirtyBits(otherSystems: SystemType[]) {
    let n = 0;

    for (let i = 0; i < this.systemTypes.length; i++) {
      if (otherSystems.includes(this.systemTypes[i])) {
        n |= 1 << this.systemTypes[i];
      }
    }
    
    return n;
  }

  private deserializeDirtyBitsToSystems(dirtyBits: number): SystemType[] {
    let systemTypes = [];
    
    for (let i = 0; i < Object.keys(SystemType).length / 2; i++) {
      if ((dirtyBits & (1 << i)) != 0) {
        systemTypes.push(i);
      }
    }

    return systemTypes;
  }

  getSystemFromType(systemType: SystemType) {
    switch (systemType) {
      case SystemType.Doors:
        if (this.level == Level.Polus) {
          return this.systems[InternalSystemType.Doors];
        } else {
          return this.systems[InternalSystemType.AutoDoors];
        }
      case SystemType.Communications:
        if (this.level == Level.MiraHq) {
          return this.systems[InternalSystemType.HqHud];
        } else {
          return this.systems[InternalSystemType.HudOverride];
        }
      case SystemType.Decontamination:
        return this.systems[InternalSystemType.Decon];
      case SystemType.Decontamination2:
        return this.systems[InternalSystemType.Decon2];
      case SystemType.Electrical:
        return this.systems[InternalSystemType.Switch];
      case SystemType.Laboratory:
      case SystemType.Reactor:
        return this.systems[InternalSystemType.Reactor];
      case SystemType.Sabotage:
        return this.systems[InternalSystemType.Sabotage];
      case SystemType.Security:
        return this.systems[InternalSystemType.SecurityCamera];
      default:
        throw new Error("Tried to get unimplemented system type: " + systemType);
    }
  }

  private setSystems(systems: SystemType[], data: MessageReader, fromSpawn: boolean) {
    for (let i = 0; i < systems.length; i++) {
      const system = this.getSystemFromType(systems[i]);

      system[fromSpawn ? "spawn" : "data"](data);
    }
  }

  private getSystems(old: undefined, systems: SystemType[], fromSpawn: true): MessageWriter;
  private getSystems(old: BaseShipStatus<T, U>, systems: SystemType[], fromSpawn: false): MessageWriter;
  private getSystems(old: BaseShipStatus<T, U> | undefined, systems: SystemType[], fromSpawn: boolean): MessageWriter {
    let writers: MessageWriter[] = new Array(systems.length);

    for (let i = 0; i < systems.length; i++) {
      let system = this.getSystemFromType(systems[i]);

      if (fromSpawn) {
        system.spawn();
      } else {
        system.data(old!.getSystemFromType(systems[i]));
      }
    }

    return MessageWriter.concat(...writers);
  }

  getData(old: BaseShipStatus<T, U>): DataPacket {
    let changedSystemTypes: SystemType[] = this.systems.map((currentSystem, systemIndex) => {
      let oldSystem = old.systems[systemIndex];

      if (currentSystem.type != oldSystem.type) {
        throw new Error("Attempted comparison of two desperate system types");
      }

      if (!currentSystem.equals(oldSystem)) {
        return currentSystem.type;
      } else {
        return -1;
      }
    }).filter(systemType => systemType != -1);

    let writer = new MessageWriter()
      .writePackedUInt32(this.serializeSystemsToDirtyBits(changedSystemTypes))
      .writeBytes(this.getSystems(old, changedSystemTypes, false));

    return new DataPacket(
      this.id,
      writer,
    );
  }

  setData(data: MessageReader | MessageWriter): void {
    let reader = MessageReader.fromRawBytes(data.buffer);
    
    this.setSystems(this.deserializeDirtyBitsToSystems(reader.readPackedUInt32()), reader.readRemainingBytes(), false);
  }

  getSpawn(): SpawnInnerNetObject {
    return new SpawnInnerNetObject(
      this.id,
      this.getSystems(undefined, this.systemTypes, true),
    );
  }

  setSpawn(data: MessageReader | MessageWriter): void {
    this.setSystems(this.systemTypes, MessageReader.fromMessage(data), true);
  }

  closeDoorsOfType(systemId: SystemType) {
    if (this.parent.room.isHost)
      return;

    this.sendRPCPacketTo([<Connection>this.parent.room.host], new CloseDoorsOfTypePacket(systemId))
  }

  repairSystem(systemId: SystemType, playerControlNetId: number, amount: RepairAmount) {
    if (this.parent.room.isHost)
      return;

    this.sendRPCPacketTo(
      [ <Connection>this.parent.room.host ],
      new RepairSystemPacket(systemId, playerControlNetId, amount.serialize(), this.level),
    )
  }
}
