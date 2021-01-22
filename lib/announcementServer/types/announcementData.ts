import { ClientLanguage } from "../../types/enums";

/**
 * A type used to describe the structure of an announcement.
 */
export type AnnouncementData = {
  /**
   * The ID of the announcement.
   */
  id?: number;
  /**
   * The announcement text in various languages.
   */
  translations?: [
    {
      /**
       * The language of the translation.
       */
      key: ClientLanguage;
      /**
       * The translated text.
       */
      text: string;
    },
  ];
};
