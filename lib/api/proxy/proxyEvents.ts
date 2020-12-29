import { ProxyPacketFromClientEvent } from "../events/proxy/proxyPacketFromClientEvent";
import { ProxyPacketFromServerEvent } from "../events/proxy/proxyPacketFromServerEvent";

export type ProxyEvents = {
  packetFromClient: ProxyPacketFromClientEvent;
  packetFromServer: ProxyPacketFromServerEvent;
};
