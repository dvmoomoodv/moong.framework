import encoding from '../encoding'
import { StringConverter } from './string-converter'

/**
 base62 string converter
 @packageDocumentation
 */

export default class Base62Converter implements StringConverter {
  convert(input: string): string {
    if (!input) {
      return input
    }

    return encoding.encodeBase62(input)
  }

  deconvert(input: string): string {
    if (!input) {
      return input
    }

    return encoding.decodeBase62(input)
  }
}

export const base62Converter = new Base62Converter()
