/**
 * 서버 압축 설정
 * @packageDocumentation
 */
import { NodeMiddleWareOption } from './node-middleware'
import { CompressionOptions } from 'compression'

/**
 * 서버 압축 설정 옵션
 */
export type CompressionOption = CompressionOptions & NodeMiddleWareOption
