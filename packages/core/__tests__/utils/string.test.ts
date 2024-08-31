/**
 * jest test :
 * @packageDocumentation
 */

import { logger } from "#moong/core";
import { string as stringUtils } from "#moong/core/utils";

describe("string util test", () => {
  test("format string", () => {
    logger.info(stringUtils.format("가나다라{0}:{1}", 1, 2));
    logger.info(stringUtils.format("가나다라{0}:{1}", 1));
  });
});
