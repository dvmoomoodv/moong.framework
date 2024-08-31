/**
 * jest test :
 * @packageDocumentation
 */

import { logger } from "#moong/core";
import { frameworkSupport } from "#moong/core/config/framework";

describe("path util test", () => {
  test("get framework alias", () => {
    logger.info("framework alias", frameworkSupport.getModuleAlias());
  });
});
