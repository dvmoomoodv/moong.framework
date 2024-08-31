/**
 * jest test :
 * @packageDocumentation
 */

import { logger } from "#moong/core";
import { module, path as pathUtils } from "#moong/core/utils/node";
import path from "path";
import * as pathe from "pathe";

describe("path util test", () => {
  test("absolute path", () => {
    logger.info(pathUtils.getAbsolutePath("test", __dirname));
    logger.info(pathUtils.getAbsolutePath(__dirname));
    logger.info(pathUtils.getAbsolutePath("../test", __dirname));
  });
  test("basename", () => {
    logger.info("upload/test", pathe.resolve("/upload/test", ".."));
    logger.info("/", pathe.resolve("/", ".."));
    logger.info("C:/", pathe.resolve("/", ".."));
  });
  test("find node module", () => {
    logger.info(
      "@moong/core",
      module.findNodeModuleDirPath(process.cwd(), "@moong/core")
    );
    logger.info(
      "@moong/nuxt-wijmo",
      module.findNodeModuleDirPath(process.cwd(), "@moong/nuxt-wijmo")
    );
    logger.info(
      "@moong/lodash",
      module.findNodeModuleDirPath(process.cwd(), "@moong/lodash")
    );
  });
});
