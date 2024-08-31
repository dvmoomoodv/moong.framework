import { ConsolaInstance, consola } from 'consola'
import web from '../web'
import hooks from '../hooks'
import { Logging as LoggingProps } from '../../config/props/logging'
import { propsStore } from '../../config/props-store'

// default logger name
const DEFAULT_LOGGER_NAME = 'ustra'

export class Logging {
  private loggerMap: Map<string, ConsolaInstance> = new Map()

  constructor() {
    this.startMonitorChangedProps()
  }

  get logger(): ConsolaInstance {
    return this.createLogger()
  }

  /**
   * logger 조회
   * @param name 로거 명
   */
  getLogger(name = DEFAULT_LOGGER_NAME): ConsolaInstance {
    return this.createLogger(name)
  }

  private startMonitorChangedProps() {
    hooks.hook('properties:stored', appProps => {
      this.loggerMap.forEach((v, k) => {
        // @ts-ignore
        v.level = appProps.logging.level
        // TODO: winston 동적 제거 확인
        // if (appProps.logging.file.enabled && !web.isBrowser) {
        //   import('./winston').then(winston => {
        //     winston.createLogger(v, k, appProps.logging, appProps.app.processPath)
        //   })
        // }
      })
    })
  }

  private createLogger(name = DEFAULT_LOGGER_NAME): ConsolaInstance {
    if (this.loggerMap.has(name)) {
      return this.loggerMap.get(name)
    }

    const [loggingProp, hasProps, processPath] = this.getLoggingProperty()
    let logger = consola.withTag(name)
    logger.level = loggingProp.level

    // if (hasProps && loggingProp.file.enabled && !web.isBrowser) {
    //   import('./winston').then(winston => {
    //     winston.createLogger(logger, name, loggingProp, processPath)
    //   })
    // }

    this.loggerMap.set(name, logger)
    return logger
  }

  /**
   * 저장된 로깅 설정을 조회
   * @returns
   */
  private getLoggingProperty(): [LoggingProps, boolean, string] {
    const prop = propsStore.getProperties()
    const hasProps = !!prop

    if (!hasProps) {
      const defaultProps = propsStore.getPropertiesWithDefault()
      return [defaultProps.logging, hasProps, defaultProps.app.processPath]
    }

    return [prop.logging, hasProps, prop.app.processPath]
  }
}

const instance = new Logging()

export default instance
export const logger = instance.logger

export type { ConsolaInstance }
