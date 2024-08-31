/**
 * jest test : regex
 * @packageDocumentation
 */

import { logger } from "#moong/core";

describe("test regex", () => {
  test("startWith", () => {
    logger.info(new RegExp("^@moong/core*").test("@moong/core"));
    logger.info(new RegExp("^@moong/core*").test("@moong/core/logging"));
    logger.info(new RegExp("^#moong/core*").test("#moong/core"));
    logger.info(new RegExp("^#moong/core*").test("#moong/core/logging"));

    logger.info(new RegExp("^@moong/core*").test("#moong/core"));
    logger.info(new RegExp("^@moong/core*").test("#moong/core/logging"));
    logger.info(new RegExp("^#moong/core*").test("@moong/core"));
    // logger.info(new RegExp('^#moong/core*').test('@moong/core/logging'))
  });
});
