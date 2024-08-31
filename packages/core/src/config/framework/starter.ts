import shelljs from "shelljs";
import path from "node:path";
import consola from "consola";
import inquirer from "inquirer";
import { exit } from "node:process";
import { frameworkSupport } from ".";
import fileUtils from "../../utils/node/file";

const baseDir = process.cwd();
const frameworkDir = path.resolve(__dirname, "../../../../");

// yarn install
consola.info("install U.STRA Framework3 modules");
// shelljs.exec('yarn install')

// install dev dependecies
consola.info("check dev dependecies");
const devDependencies = frameworkSupport.getAllDevDependencies(
  baseDir,
  frameworkDir
);

if (devDependencies.length < 1) {
  consola.info("has no depedencies to install.");
} else {
  consola.info("install dev dependecies");
  shelljs.exec(`yarn add ${devDependencies.join(" ")} --dev`);
}

// choose template
const templates = frameworkSupport.getTemplateList(baseDir, frameworkDir);

if (!templates.length) {
  consola.warn("can not find appreciate template");
  exit(0);
}

inquirer
  .prompt([
    {
      type: "list",
      name: "migrate",
      message: "Choose project template type.",
      choices: templates
        .filter((t) => !!t.templateName)
        .map((t) => t.templateName),
      loop: true,
    },
  ])
  .then((v) => {
    const templateInfo = templates.find((t) => t.templateName === v.migrate);
    const sharedPath = path.join(
      frameworkSupport.getModulePathFromFrameworkPath(
        frameworkDir,
        "@moong/core"
      ),
      "__templates__",
      "shared"
    );

    import("cpx2").then((cpx) => {
      const copyAll = (path, update) => {
        fileUtils.getHiddenFiles(path).forEach((file) => {
          cpx.copySync(
            path + "/" + file.name + (file.isDirectory() ? "/*" : ""),
            baseDir + (file.isDirectory() ? "/" + file.name : ""),
            {
              update,
              // ignore: './package-info.json',
            }
          );
        });
        cpx.copySync(path + "/**/*", baseDir, {
          includeEmptyDirs: true,
          update,
          // ignore: './package-info.json',
        });
      };

      copyAll(sharedPath, true);
      copyAll(templateInfo.dirPath, false);

      // replace package json
      frameworkSupport.writePackageJson(baseDir, templateInfo.packageInfo);

      consola.success("bootstrap is success.");

      // run post script
      if (templateInfo.templatePostScript) {
        require(templateInfo.templatePostScript);
      }

      if (templateInfo.templateMessage) {
        consola.success(templateInfo.templateMessage);
      }
    });
  });
