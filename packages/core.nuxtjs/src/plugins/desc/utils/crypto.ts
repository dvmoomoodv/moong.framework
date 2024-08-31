/**
 * 암호화 유틸리티 for nuxt
 * @exports
 * @packageDocumentation
 */
import { NuxtApp, useRuntimeConfig, callWithNuxt } from "#app";
import { core, encoding } from "#moong/core/utils";
import { crypto } from "#moong/core/utils/browser";
import { NuxtAppProps } from "#moong/nuxt/config";

export class Crypto {
  constructor(private app: NuxtApp) {
    callWithNuxt(app, () => {
      const runtimeConfig = useRuntimeConfig();
      const _appProps: NuxtAppProps =
        runtimeConfig.ustra || runtimeConfig.public?.ustra;

      core.proxy(this, "_secret", { get: () => _appProps.nuxt.env.secret });
    });
  }

  /**
   * 암호화
   * @param value
   */
  encrypt(value: string) {
    const keys = encoding.decodeBase62(this["_secret"]).split("\0");
    return crypto.encryptAes256(value, crypto.decryptAes256(keys[1], keys[0]));
  }

  /**
   * 복호화
   * @param value
   */
  decrypt(value: string) {
    const keys = encoding.decodeBase62(this["_secret"]).split("\0");
    return crypto.decryptAes256(value, crypto.decryptAes256(keys[1], keys[0]));
  }
}
