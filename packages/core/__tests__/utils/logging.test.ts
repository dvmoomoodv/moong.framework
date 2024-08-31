/**
 * jest test : module resolution
 * @packageDocumentation
 */

import { logger } from '#ustra/core'
import { configLoader } from '#ustra/core/config/loader/config-loader'
import { core } from '#ustra/core/utils'
import winston from 'winston'
import path from 'path'
import consola, { WinstonReporter } from 'consola'

describe('logging utils', () => {
  it('console logging', () => {
    logger.info('info logger1')
    logger.info('info logger2')
    logger.info('info logger3')
  })

  it('file logging', async () => {
    const props = configLoader.loadConfigProperties({
      app: {
        processPath: __dirname,
      },
      logging: {
        file: {
          enabled: true,
        },
      },
    })

    logger.info('props', props)

    await core.sleep(1000)

    logger.warn('test log1....')
    logger.warn('test log2....')
    logger.warn('test log3....')
    await core.sleep(5000)
  })

  it('winston', async () => {
    const logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          level: 'debug',
          dirname: path.join(__dirname, 'winston'),
          filename: 'applicaiton%Date%.log',
        }),
      ],
    })

    logger.info('debug.log')
    await core.sleep(5000)
  })

  it('winston consola', async () => {
    const winstonLogger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          level: 'debug',
          dirname: path.join(__dirname, 'winston-consola'),
          filename: 'applicaiton%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          json: false,
        }),
      ],
    })

    const logger = consola.withScope('ustra')
    logger.info('debug.log')
    logger.info('debug.log2')
    logger.info('debug.log3')
    logger.addReporter(new WinstonReporter(winstonLogger))

    logger.info('debug.log4')
    logger.info('debug.log5')
    await core.sleep(5000)
  })
})
