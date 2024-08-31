/**
 * jest test :
 * @packageDocumentation
 */

import { logger } from '#ustra/core'
import { module, path as pathUtils } from '#ustra/core/utils/node'
import path from 'path'
import * as pathe from 'pathe'

describe('path util test', () => {
  test('absolute path', () => {
    logger.info(pathUtils.getAbsolutePath('test', __dirname))
    logger.info(pathUtils.getAbsolutePath(__dirname))
    logger.info(pathUtils.getAbsolutePath('../test', __dirname))
  })
  test('basename', () => {
    logger.info('upload/test', pathe.resolve('/upload/test', '..'))
    logger.info('/', pathe.resolve('/', '..'))
    logger.info('C:/', pathe.resolve('/', '..'))
  })
  test('find node module', () => {
    logger.info('@ustra/core', module.findNodeModuleDirPath(process.cwd(), '@ustra/core'))
    logger.info('@ustra/nuxt-wijmo', module.findNodeModuleDirPath(process.cwd(), '@ustra/nuxt-wijmo'))
    logger.info('@ustra/lodash', module.findNodeModuleDirPath(process.cwd(), '@ustra/lodash'))
  })
})
