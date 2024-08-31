import { Nuxt } from "@nuxt/schema";
import { module } from "#moong/core/utils/node";
import { join, resolve } from "pathe";
import { existsSync, mkdirSync } from "node:fs";
import { copySync } from "fs-extra";
import { NuxtAppProps } from "../../config/nuxt-app-props";
import { installModuleIfNotExists } from "#moong/nuxt/kit";

/**
 * monaco 모듈 설정
 * @param options
 * @param nuxt
 * @see https://nuxt.com/modules/nuxt-monaco-editor
 */
export const monacoModule = async (options: NuxtAppProps, nuxt: Nuxt) => {
  // nuxt-monaco-editor
  // FIXME : add option props
  if (options.nuxt.wijmo.enabled && options.nuxt.wijmo.samples.enabled) {
    await installModuleIfNotExists("nuxt-monaco-editor", {
      // These are default values:
      dest: "_monaco",
      locale: "en",
      componentName: {
        codeEditor: "MonacoEditor",
        diffEditor: "MonacoDiffEditor",
      },
    });

    // add min-mpas static serve
    if (nuxt.options.dev) {
      let srcPath = module.findNodeModuleDirPath(
        nuxt.options.srcDir,
        "monaco-editor",
        false
      );
      if (srcPath) {
        srcPath = join(srcPath, "min-maps");

        options.server.middleware.static =
          options.server.middleware.static || [];
        options.server.middleware.static.push({
          path: "/min-maps",
          serveDir: srcPath,
        });
        options.server.middleware.static.push({
          path: "/_nuxt_monaco_editor/min-maps",
          serveDir: srcPath,
        });
      }
    }

    // FIXME: not copied resources (bug in nuxt 3.2.0)
    // @see https://github.com/e-chan1007/nuxt-monaco-editor
    nuxt.hook("close", async (nuxt) => {
      if (!nuxt.options._generate) {
        return;
      }

      // const srcPath = resolve(nuxt.options.srcDir, './.nuxt/dist/client/_monaco')
      let srcPath = module.findNodeModuleDirPath(
        nuxt.options.srcDir,
        "monaco-editor",
        false
      );

      if (!srcPath) {
        return;
      }
      srcPath = join(srcPath, "min");

      const destPath = resolve(nuxt.options.srcDir, "./.output/public/_monaco");

      if (existsSync(destPath)) {
        return;
      } else {
        mkdirSync(destPath, { recursive: true });
      }

      copySync(srcPath, destPath, {
        overwrite: true,
        // recursive: true,
      });
    });
  }
};
