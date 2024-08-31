/**
 * jest test : module resolution
 * @packageDocumentation
 */

import { core } from "#moong/core/utils";
import { file } from "#moong/core/utils/node";
import { propsStore } from "#moong/core/config/props-store";

describe("modules", () => {
  test("find module and check type", () => {
    expect(typeof core).toBe("object");
    expect(typeof file).toBe("object");
    expect(typeof propsStore.getProperties).toBe("function");
  });
});
