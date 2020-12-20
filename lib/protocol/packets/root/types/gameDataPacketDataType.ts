import { DespawnPacket, ReadyPacket, RPCPacket, SceneChangePacket, SpawnPacket } from "../../gameData";

export type GameDataPacketDataType = DespawnPacket
| ReadyPacket
| RPCPacket
| SceneChangePacket
| SpawnPacket;
