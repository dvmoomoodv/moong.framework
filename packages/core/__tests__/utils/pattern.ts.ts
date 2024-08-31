// import micromatch from 'micromatch'
// import AntPathMatcher from 'ant-path-matcher'
// import AntPathMatcher2 from '@howiefh/ant-path-matcher'
// import { logger } from '#ustra/core'

// describe('pattern test', () => {
//   test('micromatch', () => {
//     const antPathMatcher = new AntPathMatcher()
//     const antPathMatcher2 = new AntPathMatcher2()

//     expect(micromatch.isMatch('/framework/core/src/utils/logging/index.ts', '**/utils/logging/index.*')).toEqual(true)
//     logger.info(antPathMatcher.match('/**/bar', '/foo/1/bar'))
//     logger.info(antPathMatcher.match('/**/utils/logging/index.*', '/framework/core/src/utils/logging/index.ts'))

//     logger.info(antPathMatcher2.match('/**/bar', '/foo/1/bar'))
//     logger.info(antPathMatcher2.match('/**/utils/logging/index.*', '/framework/core/src/utils/logging/index.ts'))

//     logger.info(antPathMatcher2.match('/bar/**', '/bar/api/test'))
//     logger.info(antPathMatcher2.match('/bar/**', '/bar/api/test'))

//     // logger.info(antPathMatcher.match('**/bar', '/foo/1/bar'))
//     // logger.info(antPathMatcher.match('**/utils/logging/index.*', '/framework/core/src/utils/logging/index.ts'))

//     // logger.info(antPathMatcher2.match('**/bar', '/foo/1/bar'))
//     // logger.info(antPathMatcher2.match('**/utils/logging/index.*', '/framework/core/src/utils/logging/index.ts'))

//     // logger.info(antPathMatcher.match('/framework/core/src/utils/logging/index.ts', '**/utils/logging/index.*'))
//     // expect(antPathMatcher.match('**/utils/logging/index.*', '/framework/core/src/utils/logging/index.ts')).toEqual(true)
//   })
// })
