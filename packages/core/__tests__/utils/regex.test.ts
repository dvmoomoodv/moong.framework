/**
 * jest test : regex
 * @packageDocumentation
 */

import { logger } from '#ustra/core'

describe('test regex', () => {
  test('startWith', () => {
    logger.info(new RegExp('^@ustra/core*').test('@ustra/core'))
    logger.info(new RegExp('^@ustra/core*').test('@ustra/core/logging'))
    logger.info(new RegExp('^#ustra/core*').test('#ustra/core'))
    logger.info(new RegExp('^#ustra/core*').test('#ustra/core/logging'))

    logger.info(new RegExp('^@ustra/core*').test('#ustra/core'))
    logger.info(new RegExp('^@ustra/core*').test('#ustra/core/logging'))
    logger.info(new RegExp('^#ustra/core*').test('@ustra/core'))
    // logger.info(new RegExp('^#ustra/core*').test('@ustra/core/logging'))
  })
})
