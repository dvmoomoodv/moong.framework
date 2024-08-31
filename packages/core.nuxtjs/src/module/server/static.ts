import { join, resolve } from "pathe";
import { copySync } from "fs-extra";
import { logger } from "#moong/nuxt/utils/logger";
import { core } from "#moong/core/utils";
import { NuxtAppProps } from "#moong/nuxt/config";
import { StaticServeOptions } from "#moong/core/server/http/middlewares//static-serve";

import { addTemplate, addServerHandler, resolvePath } from "@nuxt/kit";
import { Nuxt } from "@nuxt/schema";

export const addStaticMiddleware = async (
  options: NuxtAppProps,
  nuxt: Nuxt
) => {
  let staticOptions = options.server.middleware.static;

  for (const staticOption of staticOptions) {
    staticOption.copyResource = core.defaults(staticOption.copyResource, true);
    staticOption.serveDir = await resolvePath(staticOption.serveDir, {
      cwd: nuxt.options.srcDir,
    });
  }

  if (nuxt.options.dev || nuxt.options.ssr) {
    let index = 1;
    for (const staticOption of staticOptions) {
      const filename = `ustra/ustra-static-serve${index}.ts`;

      addTemplate({
        filename,
        write: true,
        getContents: () => staticMiddlewareContent(staticOption),
      });
      addServerHandler({
        handler: join(nuxt.options.buildDir, filename),
        middleware: true,
        route: staticOption.path,
      });

      index++;
    }
  }
  // when generate copy
  else if (nuxt.options._generate) {
    nuxt.hook("close", (nuxt) => {
      for (const staticOption of staticOptions) {
        if (!staticOption.copyResource) {
          continue;
        }

        const destDirPath = resolve(
          nuxt.options.srcDir,
          "./dist",
          "." + staticOption.path
        );
        logger.info(
          `$ustra copy static resources... ${staticOption.serveDir} => ${destDirPath}`
        );

        copySync(staticOption.serveDir, destDirPath, {
          overwrite: true,
          // recursive: true,
        });
      }
    });
  }
};

function staticMiddlewareContent(options: StaticServeOptions): string {
  return `
import serveStatic from 'serve-static'
import { fromNodeMiddleware } from 'h3'

const option: Record<string, any> = ${JSON.stringify(options)};

console.info('$ustra register static directory', option.path, option.serveDir)
export default fromNodeMiddleware(serveStatic(option.serveDir))
`;
}
