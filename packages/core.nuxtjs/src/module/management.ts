import { existsSync } from "node:fs";
import { Nuxt } from "@nuxt/schema";
import { createResolver, addTemplate } from "@nuxt/kit";
import { resolveFrameworkModulePath } from "#moong/nuxt/kit";
import { NuxtAppProps } from "../config/nuxt-app-props";

/**
 * 커스톰 ip address checker 모듈 작성
 * @param options
 * @param nuxt
 */
async function registerCustomMenuIpAddressChecker(
  options: NuxtAppProps,
  nuxt: Nuxt
) {
  const checkerModuleAlias = "~/app/ustra.management.ipaddress.cheker.ts";
  const { resolvePath } = createResolver(nuxt.options.rootDir);
  const checkerModulePath = await resolvePath(checkerModuleAlias, {
    alias: nuxt.options.alias,
  });

  if (options.nuxt.management.enabled && existsSync(checkerModulePath)) {
    addTemplate({
      filename: "ustra/ustra.management.ipaddress.cheker.ts",
      getContents() {
        return `
import customChecker from '${checkerModuleAlias}'
export default customChecker
        `;
      },
    });
  } else {
    addTemplate({
      filename: "ustra/ustra.management.ipaddress.cheker.ts",
      getContents() {
        return `
export default null
        `;
      },
    });
  }
}

function registerComposableDirs(options: NuxtAppProps, nuxt: Nuxt) {
  // add auto imports
  nuxt.hook("imports:dirs", (dirs) => {
    dirs.push(resolveFrameworkModulePath("#moong/nuxt/management/composables"));
    dirs.push(
      resolveFrameworkModulePath(
        "#moong/nuxt/management/composables/components"
      )
    );
  });
}

export const management = async (options: NuxtAppProps, nuxt: Nuxt) => {
  await registerCustomMenuIpAddressChecker(options, nuxt);

  if (!options.nuxt.management.enabled) {
    return;
  }

  registerComposableDirs(options, nuxt);
};
