import encoding from '../encoding'
import { StringConverter } from './string-converter'

/**
 base64 string converter
 @packageDocumentation
 */

export default class Base64Converter implements StringConverter {
  convert(input: string): string {
    if (!input) {
      return input
    }

    return encoding.encodeBase64(input)
  }

  deconvert(input: string): string {
    if (!input) {
      return input
    }

    return encoding.decodeBase64(input)
  }
}

export const base64Converter = new Base64Converter()
