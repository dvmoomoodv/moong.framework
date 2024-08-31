/**
 * body parser 설정
 * @packageDocumentation
 */

import { NodeMiddleWareOption } from './node-middleware'
import { OptionsJson, OptionsUrlencoded } from 'body-parser'

/**
 * Json Body Parser 옵션
 */
export type JsonBodyParserOption = OptionsJson & NodeMiddleWareOption

/**
 * Body Parser URL Encoded 옵션
 */
export type UrlEncodedBodyParserOption = OptionsUrlencoded & NodeMiddleWareOption
