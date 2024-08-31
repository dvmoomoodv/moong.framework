/**
 converter interface
 @packageDocumentation
 */

/**
 * converter
 * @template S 원본 유형
 * @template R 변환 유형
 */
export default interface Converter<S = any, R = any> {
  /**
   * encode string
   */
  convert: (input: string) => string

  /**
   * decode string
   */
  deconvert: (input: string) => string
}

/**
 * string to string converter
 */
export interface StringConverter extends Converter<string, string> {}
