import { ClientLanguage } from "../../types/enums";
import { TextComponent } from "../../api/text";

/**
 * A class used to store and translate an announcement.
 */
export class Announcement {
  /**
   * @param id - The ID of the announcement
   * @param translations - The announcement text in various languages
   */
  constructor(
    protected readonly id: number,
    protected readonly translations: Map<ClientLanguage, TextComponent>,
  ) {}

  /**
   * Gets the ID of the announcement.
   */
  getId(): number {
    return this.id;
  }

  /**
   * Gets the translations for the announcement text.
   */
  getTranslations(): Map<ClientLanguage, TextComponent> {
    return this.translations;
  }

  /**
   * Gets the announcement text for the given language.
   *
   * @param language - The language in which the announcement text should be returned
   * @returns The announcement text in `language` if the translation exists, or `undefined` if it doesn't exist
   */
  getTranslation(language: ClientLanguage): TextComponent | undefined {
    return this.translations.get(language);
  }

  /**
   * Gets the announcement text for the given language if it exists, or the
   * first translation available if none exists for the given language.
   *
   * @param language - The language in which the announcement text should be returned
   * @returns The announcement text in `language` if the translation exists, or the first translation available, or `undefined` if there are no translatons
   */
  translate(language: ClientLanguage): TextComponent | undefined {
    return this.translations.get(language)
        ?? (this.translations.size ? this.translations.values()[0] : undefined);
  }
}
