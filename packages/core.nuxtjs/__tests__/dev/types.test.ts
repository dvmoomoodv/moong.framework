/**
 * type 추출용
 * @packageDocumentation
 */

import { module, file } from "@moong/core/src/utils/node";
import { resolve, basename, extname } from "pathe";
import fs, { Dirent } from "node:fs";

describe("get types", () => {
  test("extract styles", () => {
    const stylesPath = resolve(
      module.findNodeModuleDirPath(__dirname, "highlight.js"),
      "./styles"
    );
    const themes = file
      .fromDir(stylesPath, ".css", false)
      .filter((path) => path.endsWith(".css"))
      .map((path) => `'${file.getFilenameWithoutExt(path)}'`);

    console.log("themes", themes.join(" | "));
  });
});
