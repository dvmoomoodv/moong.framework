/**
 * jest test : 로드 확인
 * @packageDocumentation
 */

import { logger } from '#ustra/core'
import { Profile } from '#ustra/core/config'
import { configLoader } from '#ustra/core/config/loader/config-loader'

describe('config loader', () => {
  test('load yaml config', () => {
    const configProp = configLoader.loadConfigProperties({
      app: {
        processPath: __dirname,
        profile: Profile.LOCAL,
        configDirPath: './yaml',
      },
    })

    logger.info('configProp', configProp)
  })
})
