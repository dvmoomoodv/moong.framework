/**
 * jest test :
 * @packageDocumentation
 */

import { logger } from '#ustra/core'
import { string as stringUtils } from '#ustra/core/utils'

describe('string util test', () => {
  test('format string', () => {
    logger.info(stringUtils.format('가나다라{0}:{1}', 1, 2))
    logger.info(stringUtils.format('가나다라{0}:{1}', 1))
  })
})
