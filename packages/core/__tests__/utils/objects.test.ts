/**
 * jest test :
 * @packageDocumentation
 */

import { logger } from "#moong/core";
import { objects } from "#moong/core/utils";

describe("objects util test", () => {
  test("getPropertyFromPath", () => {
    const result = objects.getPropertyFromPath(
      { key1: { key11: "a" } },
      "key1.key11"
    );
    logger.info("result", result);
    expect(result).toBe("a");

    const result2 = objects.getPropertyFromPath(
      { key1: { key11: "a" } },
      "key2.key11"
    );
    logger.info("result", result2);
    expect(typeof result2).toBe("undefined");
  });
});
