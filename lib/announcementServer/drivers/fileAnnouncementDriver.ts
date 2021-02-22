import { BaseAnnouncementDriver } from "./baseAnnouncementDriver";
import { Announcement, AnnouncementData } from "../types";
import { ClientLanguage } from "../../types/enums";
import { TextComponent } from "../../api/text";
import fs from "fs/promises";

/**
 * An announcement server data source backed by a JSON file.
 */
export class FileAnnouncementDriver extends BaseAnnouncementDriver {
  /**
   * @param jsonFilePath - The absolute path to the JSON file containing the announcement
   */
  constructor(
    protected readonly jsonFilePath: string,
  ) {
    super();
  }

  async fetchLatestAnnouncement(): Promise<Announcement | undefined> {
    const data: AnnouncementData = JSON.parse(await fs.readFile(this.jsonFilePath, "utf-8"));

    if (!this.isValidAnnouncement(data)) {
      return undefined;
    }

    const translations: Map<ClientLanguage, TextComponent> = new Map();

    for (let i = 0; i < data.translations.length; i++) {
      const translation = data.translations[i];

      if (!(translation.key in ClientLanguage)) {
        continue;
      }

      translations.set(translation.key, TextComponent.from(translation.text));
    }

    return new Announcement(
      data.id,
      translations,
    );
  }

  getRefreshRate(): number {
    return 60 * 60;
  }

  /**
   * Checks if the given announcement contains all necessary data.
   *
   * @param data - The announcement to be checked
   * @returns `true` if the announcement data is valid, `false` if not
   */
  protected isValidAnnouncement(data: AnnouncementData): data is Required<AnnouncementData> {
    if (data.id === undefined) {
      return false;
    }

    if ((data.translations?.length ?? 0) < 1) {
      return false;
    }

    return true;
  }
}
