import { CacheDataPacket, AnnouncementDataPacket, BaseAnnouncementPacket, SetLanguagesPacket } from "../protocol/packets/announcement";
import { AnnouncementHelloPacket, RootAnnouncementPacket } from "../protocol/packets/hazel";
import { ANNOUNCEMENT_SERVER_PORT, DEFAULT_LANGUAGES } from "../util/constants";
import { HazelPacketType } from "../protocol/packets/types/enums";
import { AnnouncementPacket } from "../protocol/packets";
import { MessageReader } from "../util/hazelMessage";
import { BaseAnnouncementDriver } from "./drivers";
import { ClientLanguage } from "../types/enums";
import { TextComponent } from "../api/text";
import { ConnectionInfo } from "../types";
import { Announcement } from "./types";
import { Logger } from "../logger";
import Emittery from "emittery";
import dgram from "dgram";

export class AnnouncementServer extends Emittery.Typed<Record<string, unknown>, "announcements.ready"> {
  public readonly announcementServerSocket = dgram.createSocket("udp4");

  private driver?: BaseAnnouncementDriver;
  private sendLanguages = false;
  private languages: Map<number, string> = new Map(DEFAULT_LANGUAGES);

  constructor(
    private readonly address: string,
    private readonly logger: Logger,
  ) {
    super();

    this.announcementServerSocket.on("message", (buf, remoteInfo) => {
      if (this.driver === undefined) {
        return;
      }

      try {
        const connectionInfo = ConnectionInfo.fromString(`${remoteInfo.address}:${remoteInfo.port}`);
        const parsed = AnnouncementPacket.deserialize(MessageReader.fromRawBytes(buf));

        if (parsed.type == HazelPacketType.Hello) {
          this.handleHello(parsed.data as AnnouncementHelloPacket, connectionInfo);
        }
      } catch (error) {
        logger.warn(error.message);
      }
    });

    this.announcementServerSocket.on("error", error => {
      this.logger.catch(error);
    });
  }

  getAddress(): string {
    return this.address;
  }

  getPort(): number {
    return ANNOUNCEMENT_SERVER_PORT;
  }

  getDriver(): BaseAnnouncementDriver | undefined {
    return this.driver;
  }

  setDriver(driver?: BaseAnnouncementDriver): this {
    this.logger.debug("Driver set to %s", driver?.constructor.name);

    this.driver = driver;

    return this;
  }

  sendLanguagesOnHello(sendLanguages: boolean = true): this {
    this.sendLanguages = sendLanguages;

    return this;
  }

  setLanguages(languages: Map<number, string>): this {
    this.languages = languages;

    return this;
  }

  setLanguage(id: number, text: string): this {
    this.languages.set(id, text);

    return this;
  }

  deleteLanguage(id: number): this {
    this.languages.delete(id);

    return this;
  }

  addLanguage(text: string): this {
    const id = this.languages.entries()[this.languages.size - 1].id + 1;

    return this.setLanguage(id, text);
  }

  clearLanguages(): this {
    return this.setLanguages(new Map());
  }

  async listen(): Promise<void> {
    await this.driver?.refresh(true);

    return new Promise((resolve, _reject) => {
      this.announcementServerSocket.bind(this.getPort(), this.address, resolve);
    });
  }

  private async handleHello(helloPacket: AnnouncementHelloPacket, connectionInfo: ConnectionInfo): Promise<void> {
    if (this.sendLanguages) {
      this.sendSetLanguagesPacket(connectionInfo);
    }

    if (this.driver === undefined) {
      return;
    }

    const announcement = await this.driver.onRequest(
      connectionInfo,
      helloPacket.announcementVersion,
      helloPacket.lastAnnouncementId,
      helloPacket.language,
    );

    if (announcement === undefined) {
      this.sendCachePacket(connectionInfo);

      return;
    }

    console.log("sending", announcement.getId(), helloPacket.lastAnnouncementId);

    this.sendAnnouncementPacket(connectionInfo, announcement, helloPacket.language);
  }

  private sendCachePacket(connectionInfo: ConnectionInfo): void {
    this.sendTo(connectionInfo, new CacheDataPacket());
  }

  private sendAnnouncementPacket(connectionInfo: ConnectionInfo, announcement: Announcement, language: ClientLanguage): void {
    const text = announcement.translate(language) ?? TextComponent.from("");

    this.sendTo(connectionInfo, new AnnouncementDataPacket(announcement.getId(), text.toString()));
  }

  private sendSetLanguagesPacket(connectionInfo: ConnectionInfo): void {
    this.sendTo(connectionInfo, new SetLanguagesPacket(this.languages));
  }

  private sendTo(connectionInfo: ConnectionInfo, packet: BaseAnnouncementPacket): void {
    this.announcementServerSocket.send(
      new AnnouncementPacket(1, new RootAnnouncementPacket([packet])).serialize().getBuffer(),
      connectionInfo.getPort(),
      connectionInfo.getAddress(),
    );
  }
}
