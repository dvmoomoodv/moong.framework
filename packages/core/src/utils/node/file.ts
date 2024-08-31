/**
 * NODE 파일 관련 유틸리티
 * @exports {@link File}
 * @exports {@link instance}
 * @packageDocumentation
 */
import fs from "node:fs";
import path from "node:path";
import template from "lodash/template";

export class File {
  /**
   * 특정 디렉토리의 파일/디렉토리 목록을 반환
   * @param directoryPath
   * @server
   */
  getDirectoryFiles(directoryPath: string, onlyDirectory = false): fs.Dirent[] {
    return fs
      .readdirSync(directoryPath, { withFileTypes: true })
      .filter((d) => !onlyDirectory || d.isDirectory());
  }

  /**
   * 특정 디렉토리의 hidden file 목록을 반환
   * @param directoryPath
   * @server
   */
  getHiddenFiles(directoryPath: string): fs.Dirent[] {
    return fs
      .readdirSync(directoryPath, { withFileTypes: true, encoding: "utf-8" })
      .filter((d) => d.name.startsWith("."));
  }

  /**
   * 특정 경로의 디렉토리에서 파일명 필터링하여 리턴
   * @param startPath 시작경로
   * @param filter filtering할 문구
   * @param recursive 재귀조회 여부
   * @server
   * @example
   * ```typescript
   * import { file } from '#moong-core/utils/node'
   *
   * file.fromDir(path.resolve(__dirname, './config), '.ts')
   * ```
   */
  fromDir(startPath: string, filter: string, recursive = true): Array<string> {
    let filteredFiles: Array<string> = [];

    if (!fs.existsSync(startPath)) {
      return filteredFiles;
    }

    const files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
      const filename = path.join(startPath, files[i]);
      const stat = fs.lstatSync(filename);
      if (stat.isDirectory()) {
        if (recursive) {
          filteredFiles = filteredFiles.concat(
            ...this.fromDir(filename, filter)
          );
        }
      } else if (filename.includes(filter)) {
        filteredFiles.push(filename);
      }
    }

    return filteredFiles;
  }

  /**
   * 원본 템플릿 파일을 생성하여 지정 경로로 copy
   * @param tempaltePath 템플릿 파일 경로
   * @param targetPath
   * @param overwrite 파일 존재시 overwrite 여부
   * @param data
   *
   * @see https://lodash.com/docs/4.17.15#template
   */
  template(
    tempaltePath: string,
    targetPath: string,
    overwrite: boolean = true,
    data: object = {}
  ) {
    if (!fs.existsSync(tempaltePath)) {
      // logger.warn('cannot found templatePath :', tempaltePath)
      return;
    }

    if (fs.existsSync(targetPath) && !overwrite) {
      // logger.debug('already exists targetPath :', targetPath)
      return;
    }

    // read template file
    const templateStr = fs.readFileSync(tempaltePath, "utf-8");
    const compiled = template(templateStr);
    const compiledStr = compiled(data);

    const targetDir = path.parse(targetPath).dir;

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }

    fs.writeFileSync(targetPath, compiledStr, { encoding: "utf-8" });
  }

  /**
   * text file을 reading
   * @param path 파일 경로
   * @param charset charset
   */
  readTextFile(path: string, charset: BufferEncoding = "utf-8") {
    return fs.readFileSync(path, charset);
  }

  /**
   * text file을 writing
   * @param path 파일 경로
   * @param text 텍스트
   * @param charset charset
   */
  writeTextFile(path: string, text: string, charset: BufferEncoding = "utf-8") {
    fs.writeFileSync(path, text, {
      encoding: charset,
    });
  }

  /**
   * 파일 경로에서 확장자를 제외한 명 추출
   * @param filePath 파일 경로
   * @returns
   */
  getFilenameWithoutExt(filePath: string) {
    filePath = path.basename(filePath);
    const paths = filePath.split(".");

    if (paths.length < 2) {
      return filePath;
    }

    paths.splice(-1, 1);
    return paths.join(".");
  }

  /**
   * 지정 디렉토리를 clear
   * @param path
   */
  async clearDir(path: string) {
    fs.rmSync(path, { recursive: true, force: true });
    fs.mkdirSync(path, { recursive: true });
  }

  /**
   * directory를 재귀 재거 처리한다.
   * @param paths
   */
  async rmRecursive(paths: string[]) {
    await Promise.all(
      paths
        .filter((p) => typeof p === "string")
        .map(async (path) => {
          console.debug("Removing recursive path", path);
          fs.rmSync(path, { recursive: true, force: true });
        })
    );
  }

  /**
   * 파일 미존재 시 생성
   * @param path
   */
  async touchFile(path: string) {
    const time = new Date();
    fs.utimesSync(path, time, time);
  }
}

const instance = new File();

export default instance;
