import { Ustra } from "../ustra";
import { string as stringUtils, core } from "#moong/core/utils";
import type { I18nMessage } from "#moong/core/config/props/i18n";

/**
 * 메시지 관련 기능 제공
 */
export class UstraMessage {
  constructor(private $ustra: Ustra) {}

  /**
   * 메시지 조회
   * @param messageCode 메시지 코드
   * @param args argument
   */
  getMessage<K extends keyof I18nMessage>(messageCode: K, ...args: any[]) {
    const currentLocale = this.$ustra.env.appProps.i18n.locale;
    const message =
      this.$ustra.env.appProps.i18n.messages[currentLocale][messageCode] ||
      this.$ustra.env.appProps.i18n.messages["default"][messageCode];

    return stringUtils.format(message, ...args);
  }

  /**
   * 메시지 Object를 조회
   * @param locale
   * @returns
   */
  getMessageObject(locale?: string) {
    const currentLocale = this.$ustra.env.appProps.i18n.locale;
    locale = locale || currentLocale;
    return core.deepMerge(
      {},
      this.$ustra.env.appProps.i18n.messages["default"],
      this.$ustra.env.appProps.i18n.messages[locale]
    );
  }

  /**
   * 메시지 Object를 merge
   * @param locale
   * @returns
   */
  mergeMessageObject(messageObject: I18nMessage, locale?: string) {
    return core.deepMerge(this.getMessageObject(locale), messageObject);
  }

  /**
   * error throw
   * @param messageCode 메시지 코드
   * @param args argument
   */
  throwError<K extends keyof I18nMessage>(messageCode: K, ...args: any[]) {
    throw new Error(this.getMessage(messageCode, ...args));
  }

  /**
   * vue i18n option 반환
   * @returns
   */
  getVue18nOption() {
    return {
      legacy: false,
      locale: this.$ustra.env.appProps.i18n.locale,
      fallbackLocale: this.$ustra.env.appProps.i18n.locale,
      messages: this.$ustra.env.appProps.i18n.messages,
    };
  }
}
