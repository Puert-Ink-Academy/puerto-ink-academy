import type { AppLocale } from "@/i18n/config";
import type { formats } from "@/i18n/formats";
import de from "@/messages/de.json";
import el from "@/messages/el.json";
import type messages from "@/messages/en-US.json";
import fr from "@/messages/fr.json";

type MessageTree<T> = {
  [K in keyof T]: T[K] extends string ? string : MessageTree<T[K]>;
};

const german: MessageTree<typeof messages> = de;
const french: MessageTree<typeof messages> = fr;
const greek: MessageTree<typeof messages> = el;
void german;
void french;
void greek;

declare module "next-intl" {
  interface AppConfig {
    Locale: AppLocale;
    Messages: typeof messages;
    Formats: typeof formats;
  }
}
