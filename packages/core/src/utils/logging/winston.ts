import toLower from "lodash/toLower";
import toUpper from "lodash/toUpper";
// import { ConsolaReporter } from 'consola'
import winston, { LoggerOptions } from "winston";
import "winston-daily-rotate-file";
import DailyRotateFile, {
  DailyRotateFileTransportOptions,
} from "winston-daily-rotate-file";
import { LogLevel } from "../../config/props/logging";
import { core } from "../../utils";
import { Logging as LoggingProps } from "../../config/props/logging";

/**
 * winston reporter 포함여부 확인
 * @param logger
 * @returns
 */
// function hasWinstonReporter(logger): boolean {
//   for (const reporter of logger['_reporters']) {
//     if (reporter instanceof consola.WinstonReporter) {
//       return true
//     }
//   }

//   return false
//}

/**
 * winston logger 생성
 * @param logger
 * @param name
 * @param loggingProp
 * @param processPath
 */
export const createLogger = async (
  logger,
  name: string,
  loggingProp: LoggingProps,
  processPath?: string
) => {
  // if (hasWinstonReporter(logger)) {
  //   return
  // }
  processPath = processPath || process.cwd();

  const { combine, timestamp, printf } = winston.format;
  const format = printf(({ level, message, label, timestamp, args }) => {
    return `${timestamp} [${label || name}] ${toUpper(level)}: ${message} ${args}`;
  });
  const pathUtils = (await import("#moong/core/utils/node/path")).default;
  const logLevel = toLower(core.getObjectKey(LogLevel, loggingProp.level));
  const rotateOption: DailyRotateFileTransportOptions = {
    // logger options
    level: logLevel,
    handleExceptions: true,
    json: false,
    // format: combine(label({ label: scope }), timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS' }), format),
    format: combine(timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS" }), format),
    dirname: pathUtils.getAbsolutePath(
      loggingProp.file.dirPath || "logs",
      processPath
    ),
    filename: loggingProp.file.filename,
    datePattern: loggingProp.file.datePattern,
    zippedArchive: loggingProp.file.zippedArchive,
    maxSize: loggingProp.file.maxSize,
    maxFiles: loggingProp.file.maxFiles,
  };
  const loggerOption: LoggerOptions = {
    level: logLevel,
    handleExceptions: true,
    transports: [new DailyRotateFile(rotateOption)],
  };
  if (loggingProp.file.errFilename) {
    const errorRotateOption = core.deepMerge({}, rotateOption);
    errorRotateOption.level = "error";
    errorRotateOption.filename = loggingProp.file.errFilename;
    (loggerOption.transports as any[]).push(
      new DailyRotateFile(errorRotateOption)
    );
  }

  // logger.addReporter(new consola.WinstonReporter(winston.createLogger(loggerOption)))
};
