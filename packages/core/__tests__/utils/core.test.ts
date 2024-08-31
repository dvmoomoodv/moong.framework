/**
 * jest test :
 * @packageDocumentation
 */
import { core } from "#moong/core/utils";
import { LogLevel } from "#moong/core/config";

describe("core util test", () => {
  test("getObjectKey", () => {
    const logLevelKey = core.getObjectKey(LogLevel, LogLevel.Debug);
    expect(logLevelKey).toBe("Debug");
  });

  test("cancel sleep", async () => {
    const timer = core.sleep(10000);
    timer.cancel();
  });
});
