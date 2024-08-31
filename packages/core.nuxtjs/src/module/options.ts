import {
  getFrameowrkModuleDirPath,
  resolveFrameworkModulePath,
} from "#moong/nuxt/kit";
import { Nuxt } from "@nuxt/schema";
import { logger } from "#moong/nuxt/utils/logger";
import { encoding, core } from "#moong/core/utils";
import { crypto } from "#moong/core/utils/browser";
import { FRAMEWORK_MODULE_DEFINITION } from "#moong/core/config/framework/modules";

import config from "./utils/config";
import { NuxtAppProps, Profile } from "../config/nuxt-app-props";
import { nuxtConfigLoader } from "../config/loader/config-loader";

// 보안 항목 제외된 property 조회

/**
 * option 정규화
 * @param options
 * @param nuxt
 */
const normalizeOptions = (options: NuxtAppProps, nuxt: Nuxt) => {
  options.nuxt = options.nuxt || {};
  options.nuxt._build = options.nuxt._build || {};

  options.app = options.app || {};
  options.server = options.server || {};

  options.app.processPath = nuxt.options.rootDir;
  options.app.profile = options.app.profile || process.env.CONFIG_ENV;
  options.server.dev = nuxt.options.dev;
  options.server.enabled = options.server.dev || nuxt.options.ssr;

  options = nuxtConfigLoader.loadConfigProperties(options);

  // nuxt.options.globalName = nuxt.options.globalName || 'ustra'

  // create runtime configuration
  // modules:done으로 변경함. 옵션을 타 module에서 변경 가능하도록 설정
  nuxt.hook("modules:done", () => {
    const nuxtOptions = nuxt.options;
    const options = nuxtOptions["ustra"] as NuxtAppProps;

    // modify secret
    const configureSecret = crypto.generateSecret();
    const cryptedKey = crypto.encryptAes256(
      options.nuxt.env.secret,
      configureSecret
    );
    options.nuxt.env.secret = encoding.encodeBase62(
      configureSecret + "\0" + cryptedKey
    );

    const publicConfig = {
      ...(nuxtOptions.runtimeConfig.public || {}),
      ustra: { ...config.getClientOptions(options) },
    };

    // @ts-ignore
    nuxtOptions.runtimeConfig = {
      ...nuxtOptions.runtimeConfig,
      ustra: { ...options },
      public: publicConfig,
    };
  });

  return options;
};

const adjustDefaultOptions = (options: NuxtAppProps, nuxt: Nuxt) => {
  if (options.nuxt.wijmo.samples.enabled) {
    options.nuxt.markdown.enabled = true;
  }
};

/**
 * nuxt 기본 옵션 설정
 * @param options
 * @param nuxt
 */
const configNuxtOptions = (options: NuxtAppProps, nuxt: Nuxt) => {
  const typeDefinitions = [];

  // add framework alias
  FRAMEWORK_MODULE_DEFINITION.filter(
    (def) => def.requiredImport && def.alias
  ).forEach((def) => {
    typeDefinitions.push(...def.typeDefinitions);

    if (nuxt.options.alias[def.alias]) {
      logger.info(
        "$ustra path alias - ",
        "`" + def.alias + "`",
        nuxt.options.alias[def.alias]
      );
      return;
    }

    const modulePath = getFrameowrkModuleDirPath(def);
    nuxt.options.alias[def.alias] = modulePath;
    logger.info("$ustra path alias - ", "`" + def.alias + "`", modulePath);
  });

  // add types
  nuxt.hook("prepare:types", ({ references }) => {
    typeDefinitions.forEach((t) => references.push({ types: t }));

    logger.info("$ustra type references...", typeDefinitions);
  });

  // add auto imports
  nuxt.hook("imports:dirs", (dirs) => {
    dirs.push(resolveFrameworkModulePath("#moong/nuxt/composables"));
    dirs.push(resolveFrameworkModulePath("#moong/nuxt/composables/components"));
  });

  nuxt.options.typescript.tsConfig = {
    ...(nuxt.options.typescript.tsConfig || {}),
  };

  nuxt.options.typescript.tsConfig.compilerOptions = {
    ...(nuxt.options.typescript.tsConfig.compilerOptions || {}),
    strict: false,
    skipLibCheck: true,
    allowSyntheticDefaultImports: true,
    allowUnreachableCode: true,
    downlevelIteration: true,
    esModuleInterop: true,
    allowJs: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    allowImportingTsExtensions: true,
    // https://nuxt.com/blog/v3-8#type-import-changes
    verbatimModuleSyntax: false,
  };

  nuxt.options.typescript.tsConfig.compilerOptions.types =
    nuxt.options.typescript.tsConfig.compilerOptions.types || [];
  nuxt.options.typescript.tsConfig.compilerOptions.types.push(
    ...typeDefinitions
  );

  nuxt.options.typescript.shim = false;
  nuxt.options.typescript.typeCheck = core.defaults(
    nuxt.options.typescript.typeCheck,
    true
  );

  // for watching add fs event
  nuxt.options.vite = nuxt.options.vite || {};
  nuxt.options.vite.server = nuxt.options.vite.server || {};
  nuxt.options.vite.server.watch = nuxt.options.vite.server.watch || {};
  nuxt.options.vite.server.watch.useFsEvents = true;

  // add strict config
  nuxt.options.vite.server.fs = nuxt.options.vite.server.fs || {};
  nuxt.options.vite.server.fs.strict = false;
};

export const options = (
  options: NuxtAppProps,
  nuxt: Nuxt,
  frameworkDirPath: string
) => {
  options = normalizeOptions(options, nuxt);
  options.nuxt._build.frameworkDirPath = frameworkDirPath;
  nuxt.options["ustra"] = options;

  // for debug option
  if (nuxt.options.debug) {
    options.debug = true;
  }

  adjustDefaultOptions(options, nuxt);
  configNuxtOptions(options, nuxt);

  return options;
};
