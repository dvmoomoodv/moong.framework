import { resolve, join } from "pathe";
import { defineNuxtModule } from "@nuxt/kit";
import { createSymlink } from "#moong/nuxt/kit";
import { logger } from "#moong/nuxt/utils/logger";
import { module } from "#moong/core/utils/node";
import frameworkSupport from "#moong/core/config/framework/framework-support";
import { NuxtAppProps } from "../config/nuxt-app-props";
import { options } from "./options";
import { auth } from "./auth";
import { plugins } from "./plugins";
import { build } from "./build";
import { modules } from "./modules";
import { statics } from "./static";
import { markdown } from "./markdown";
import { server } from "./server";
import { management } from "./management";
import { nitro } from "./nitro";
import { router } from "./router";
import { cache } from "./cache";
import { ui } from "./ui";
import { experimental } from "./experimental";
import { existsSync, readFileSync } from "node:fs";

export default defineNuxtModule<NuxtAppProps>({
  meta: {
    name: "@moong/nuxt",
    configKey: "ustra",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  async setup(resolvedOptions, nuxt) {
    const version = module.getCurrentModuleVersion(__dirname);
    const frameworkDir = resolve(__dirname, "../../../");
    const bannerPath = join(
      frameworkSupport.getModulePathFromFrameworkPath(
        frameworkDir,
        "@moong/core"
      ),
      "src",
      "resource",
      "banner.txt"
    );

    let banner = null;
    if (existsSync(bannerPath)) {
      banner = readFileSync(bannerPath, "utf-8");

      banner?.split("\n").forEach((l) => console.log(l));
    } else {
      logger.warn("cannot find banner path", bannerPath);
    }

    logger.info("U.STRA Framework Version : ", version);
    console.log("");
    console.log("");

    resolvedOptions = options(resolvedOptions, nuxt, frameworkDir);
    resolvedOptions.app.version = version;
    resolvedOptions.app.banner = banner;

    router(resolvedOptions, nuxt);
    await auth(resolvedOptions, nuxt);
    plugins(resolvedOptions, nuxt);
    build(resolvedOptions, nuxt);
    nitro(resolvedOptions, nuxt);
    statics(resolvedOptions, nuxt);
    markdown(resolvedOptions, nuxt);
    await modules(resolvedOptions, nuxt);
    await management(resolvedOptions, nuxt);
    server(resolvedOptions, nuxt);
    cache(resolvedOptions, nuxt);
    experimental(resolvedOptions, nuxt);
    ui(resolvedOptions, nuxt);
  },
});
