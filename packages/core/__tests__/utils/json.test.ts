/**
 * jest test : json utils
 * @packageDocumentation
 */

import { logger } from "#moong/core";
import { json } from "#moong/core/utils";

describe("json module test", () => {
  test("function parsing", async () => {
    const obj = {
      test1: "1",
      test2: 2,
      testFunction: async ($ustra) => {
        // const jsonModule = (await import('#moong/core/utils')).json
        const jsonModule = require("#moong/core/utils").json;
        console.log("string", jsonModule.stringifyWithFunction($ustra));
      },
    };

    const jsonString = json.stringifyWithFunction(obj);
    logger.info("jsonString", jsonString);

    const convertedObj = json.parseWithFunction(jsonString) as typeof obj;
    logger.info("convertedObj", convertedObj);

    logger.info(
      "function result",
      await convertedObj.testFunction({ a: "111" })
    );
  });
});
