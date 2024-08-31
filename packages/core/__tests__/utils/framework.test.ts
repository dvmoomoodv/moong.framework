/**
 * jest test :
 * @packageDocumentation
 */

import { logger } from '#ustra/core'
import { frameworkSupport } from '#ustra/core/config/framework'

describe('path util test', () => {
  test('get framework alias', () => {
    logger.info('framework alias', frameworkSupport.getModuleAlias())
  })
})
