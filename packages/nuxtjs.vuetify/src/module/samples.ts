import sampleMenus, { SampleMenu } from "../samples/_data/sample-menu";
import managementSampleMenus from "../samples/_data/management-sample-menu";
import { Nuxt, NuxtPage } from "@nuxt/schema";
import { resolvePath } from "@nuxt/kit";
import { NuxtAppProps, VuetifySampleMenuOptions } from "#moong/nuxt/config";
import { path as pathUtils, model, core } from "#moong/core/utils";
import { existsSync } from "node:fs";
import { resolve, join } from "pathe";
import { file, path } from "#moong/core/utils/node";
import { copySync, removeSync } from "fs-extra";
import { logger } from "#moong/nuxt/utils/logger";

// child router 추가
async function createChildrenRouter(
  options: NuxtAppProps,
  includeManagement: boolean,
  basePath: string
) {
  const menus: SampleMenu[] = [...sampleMenus];

  if (includeManagement) {
    menus.push(...managementSampleMenus);
  }

  const flatMenus = model.flatReclusiveArray(menus, "items", false);
  const existsFlatMenus: SampleMenu[] = [];

  for (const menu of flatMenus) {
    if (!menu.path) {
      existsFlatMenus.push(menu);
    } else {
      const path = await resolvePath(`${basePath}/${menu.path}`);
      const visible =
        menu.visible === true ||
        menu.visible === undefined ||
        (typeof menu.visible === "function" && menu.visible(options));
      if (visible && existsSync(path)) {
        existsFlatMenus.push(menu);
      } else if (visible) {
        logger.warn("cannot find sample component path : " + path);
      }
    }
  }

  return existsFlatMenus
    .filter((menu) => !menu.disabled && menu.path && menu.title)
    .map((menu) => {
      const pathname = pathUtils.withoutExt(menu.path.replace(/\//g, "-"));
      return {
        name: "ustra-vuetify-samples-" + pathname,
        path: pathname,
        file: `${basePath}/${menu.path}`,
      } as NuxtPage;
    });
}

// 프로젝트 추가 샘플 router 추가
function createAdditionalRouter(options: NuxtAppProps, nuxt: Nuxt) {
  if (!options.nuxt.vuetify.samples.additionalMenus) {
    return [];
  }

  const routers: NuxtPage[] = [];
  const defaultKey = "ustra-vuetify-samples-additional-menu-";
  function addAdditionalMenu(sampleMenus: VuetifySampleMenuOptions[]) {
    for (const sampleMenu of sampleMenus) {
      if (sampleMenu.componentPath) {
        const routerKey = defaultKey + routers.length;

        routers.push({
          name: routerKey,
          path: routerKey,
          file: sampleMenu.componentPath,
        });

        sampleMenu.path = routerKey;
      }

      if (sampleMenu.items) {
        addAdditionalMenu(sampleMenu.items);
      }
    }
  }
  addAdditionalMenu(options.nuxt.vuetify.samples.additionalMenus);

  nuxt.options["ustra"].nuxt.vuetify.samples.additionalMenus =
    options.nuxt.vuetify.samples.additionalMenus;

  return routers;
}

// resoure direction static 추가
function addResourceFiles(options: NuxtAppProps, nuxt: Nuxt) {
  options.server.middleware.static = options.server.middleware.static || [];
  options.server.middleware.static.push({
    path: "/ustra-vuetify-sample-resources",
    serveDir: resolve(__dirname, "../samples/_resources"),
  });
}

// 인증 처리 제외 URL 패턴 등록
function excludeAuthentication(options: NuxtAppProps) {
  options.auth.excludeUrlPatterns.push(options.nuxt.vuetify.samples.path);
  options.auth.excludeUrlPatterns.push(
    options.nuxt.vuetify.samples.path + "/**"
  );
}

export const samples = async (options: NuxtAppProps, nuxt: Nuxt) => {
  const sampleProps = options.nuxt.vuetify.samples;

  if (!sampleProps.enabled || !sampleProps.path) {
    return;
  }

  // add option auth exclude pattern
  nuxt.options["ustra"].auth.excludeUrlPatterns = [
    ...(nuxt.options["ustra"].auth.excludeUrlPatterns || []),
    options.nuxt.vuetify.samples.path + "/**",
  ];

  const additionalRouters = createAdditionalRouter(options, nuxt);

  let basePath = "#moong/nuxt-vuetify/samples";
  // copy resource
  if (sampleProps.copyResource.enabled) {
    const targetDir = resolve(__dirname, "../samples");
    const destDir = path.getAbsolutePath(
      sampleProps.copyResource.targetDirPath + sampleProps.path,
      nuxt.options.srcDir
    );

    if (sampleProps.copyResource.overwrite) {
      if (existsSync(destDir)) {
        await file.clearDir(destDir);
        logger.info(`$ustra clear directory : "${destDir}"`);
        await core.sleep(1000);
      }
    }

    file.getDirectoryFiles(targetDir, true).forEach((d) => {
      // exclude private directories
      if (d.name.startsWith("_")) {
        return;
      }

      const target = join(targetDir, d.name);
      const dest = join(destDir, d.name);

      copySync(target, dest, {
        overwrite: sampleProps.copyResource.overwrite,
      });
    });

    basePath = resolve(destDir);
    logger.info(`$ustra copy vuetify sample page to "${destDir}"`);
  }

  nuxt.hook("pages:extend", async (pages) => {
    pages.push({
      name: "samples-vuetify",
      path: options.nuxt.vuetify.samples.path,
      file: "#moong/nuxt-vuetify/samples/index.vue",
      children: (
        await createChildrenRouter(
          options,
          options.nuxt.management.enabled &&
            options.nuxt.management.ui.componentType === "vuetify",
          basePath
        )
      ).concat(additionalRouters),
    });
  });

  addResourceFiles(options, nuxt);
  excludeAuthentication(options);
};
