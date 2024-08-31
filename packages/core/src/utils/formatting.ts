/**
 * format utils
 * @exports {@link modules}
 * @packageDocumentation
 */
import padEnd from 'lodash/padEnd'
import date from './date'
import toNumber from 'lodash/toNumber'
import { isValid } from 'date-fns'

export class Formatting {
  /**
   * 숫자를 천단위 콤마로 분리하여 표시
   * @param v 숫자
   * @param fix 고정 소수 자리 ㅅ수
   */
  currency(v: number | string, fix = 0) {
    if (v === null || v === undefined) {
      return null
    }

    const convertedVal: number = typeof v === 'string' ? toNumber(v) : (v as number)
    let convertedStr = convertedVal.toFixed(fix) + (fix === 0 ? '.' : '')

    convertedStr = convertedStr.replace(/\d(?=(\d{3})+\.)/g, '$&,')

    if (fix === 0) {
      convertedStr = convertedStr.substring(0, convertedStr.length - 1)
    }

    return convertedStr
  }

  /**
   * date 포맷팅
   * @param v value
   * @param format 변환할 문자 유형
   * @param originFormat 문자열일 경우, 원본 포맷 유형
   */
  date(v: any, format: string = 'yyyy-MM-dd', originFormat: string = 'yyyyMMdd') {
    if (!v) {
      return v
    }

    try {
      if (typeof v === 'string') {
        if (v.length === 8) {
          v = date.parse(v, originFormat)
        } else {
          v = new Date(v)
        }
      }

      return date.format(v, format)
    } catch (e) {
      return v
    }
  }

  /**
   * time 포맷팅
   * @param v value
   * @param format 변환할 문자 유형
   * @param originFormat 문자열일 경우, 원본 포맷 유형
   */
  time = (v: any, format: string = 'HH:mm', originFormat: string = 'HHmm') => {
    if (!v) {
      return v
    }

    try {
      if (typeof v === 'string') {
        if (v.length === 4) {
          v = date.parse(date.format(new Date(), 'yyyyMMdd') + v, 'yyyyMMdd' + originFormat)
        } else if (v.length === 6) {
          format = 'HH:mm:ss'
          v = date.parse(v, 'HHmmss')
        } else {
          v = new Date(v)
        }
      }

      return date.format(v, format)
    } catch (e) {
      return v
    }
  }

  /**
   * datetime 포맷팅
   * @param v value
   * @param format 변환할 문자 유형
   * @param originFormat 문자열일 경우, 원본 포맷 유형
   */
  datetime(v: any, format: string = 'yyyy-MM-dd HH:mm:ss', originFormat: string = 'yyyyMMddHHmmss') {
    if (!v) {
      return v
    }

    try {
      if (typeof v === 'string') {
        if (v.length >= 19) {
          const ov = v
          v = new Date(v)

          if (!isValid(v)) {
            v = ov
          }
        }

        if (typeof v === 'string') {
          v = date.parse(v, originFormat)
        }
      }

      return date.format(v, format)
    } catch (e) {
      return v
    }
  }

  /**
   * 카드번호 포맷팅
   * @param v value
   */
  cardNo(v) {
    if (!v) {
      return v
    }

    v = padEnd(v, 16)
    return `${v.substring(0, 4)}-${v.substring(4, 8)}-${v.substring(8, 12)}-${v.substring(12, 16)}`
  }

  /**
   * 사업자 번호
   * @param v value
   */
  corpRegNo(v) {
    if (!v) {
      return v
    }

    v = padEnd(v, 10)
    return `${v.substring(0, 3)}-${v.substring(3, 5)}-${v.substring(5, 10)}`
  }

  /**
   * 파일 사이즈를 formatting 한다.
   */
  fileSize(size: number) {
    if (size === 0 || Number.isNaN(size) || isNaN(size) || size === null || size === undefined) {
      return '0 B'
    }
    const i = Math.floor(Math.log(size) / Math.log(1024))
    return (size / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i]
  }
}

const instance = new Formatting()
export default instance
