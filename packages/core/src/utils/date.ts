import { format as dateFormat, parse as dateParse, isValid } from 'date-fns'
import isDateFn from 'lodash/isDate'
import padStart from 'lodash/padStart'

export class DateUtils {
  /**
   * date + milli second
   * @param date
   * @param millis
   */
  addMiliSeconds(date: Date, millis: number): Date {
    return new Date(date.getTime() + millis)
  }

  /**
   * date + add seconds
   * @param date
   * @param seconds
   */
  addSeconds(date: Date, seconds: number): Date {
    return this.addMiliSeconds(date, seconds * 1000)
  }

  /**
   * add minutes
   * @param date
   * @param minutes
   */
  addMinutes(date: Date, minutes: number): Date {
    return this.addMiliSeconds(date, minutes * 1000 * 60)
  }

  /**
   * add hours
   * @param date
   * @param hour
   */
  addHours(date: Date, hour: number): Date {
    return this.addMiliSeconds(date, hour * 1000 * 60 * 60)
  }

  /**
   * add days
   * @param date
   * @param days
   */
  addDays(date: Date, days: number): Date {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + days)
    return newDate
  }

  /**
   * add months
   * @param date
   * @param months
   */
  addMonths(date: Date, months: number): Date {
    const newDate = new Date(date)
    newDate.setMonth(newDate.getMonth() + months)
    return newDate
  }

  /**
   * add years
   * @param date
   * @param years
   */
  addYears(date: Date, years: number): Date {
    const newDate = new Date(date)
    newDate.setFullYear(newDate.getFullYear() + years)
    return newDate
  }

  /**
   * 윤년 확인
   * @param val
   */
  isLeapYear(val: number | Date): boolean {
    const year = typeof val === 'number' ? val : val.getFullYear()
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }

  /**
   * 월별 일 수 반환
   * @param year
   * @param month
   */
  getDaysInMonth = (year: number, month: number): number => {
    return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]
  }

  /**
   * Date를 formatting 한다.
   * @param date 일자
   * @param format 포맷
   * @see https://date-fns.org/v2.16.1/docs/format
   */
  format(date: number | Date, format: string): string {
    return dateFormat(date, format)
  }

  /**
   * 문자열을 Date로 변환한다.
   * @param dateString 문자열
   * @param format 포맷팅
   * @see https://date-fns.org/v2.16.1/docs/parse
   */
  parse = (dateString: string, format: string): Date => {
    const date = dateParse(dateString, format, new Date())
    return !isValid(date) ? null : date
  }

  /**
   * date 문자열이 유효하지 확인
   * @param dateString date 문자열
   * @param format 포맷
   * @returns 유효 여부
   */
  isValidDate = (dateString: string, format: string): boolean => {
    const date = dateParse(dateString, format, new Date())
    return isValid(date)
  }

  /**
   * 값이 date 유형인지 확인
   * @param value
   */
  isDate = (value: any): boolean => {
    return isDateFn(value)
  }

  /**
   * 일자 사이의 millisecond를 반환한다.
   * @param date1
   * @param date2
   */
  getMilliDuration = (date1: Date, date2: Date): number => {
    return date2.getTime() - date1.getTime()
  }

  /**
   * duration을 formatting 한다. (HH:MM:SS)
   * @param duration 기간
   * @param unit duration 기간
   */
  formatDuration = (duration: number, unit: 'milliSec' | 'sec' | 'minute' | 'hour' = 'sec') => {
    let milliSecs =
      unit === 'sec' ? duration * 1000 : unit === 'minute' ? duration * 1000 * 60 : unit === 'hour' ? duration * 1000 * 60 * 60 : duration
    const hourUnit = 60 * 60 * 1000
    const minUnit = 60 * 1000

    const hour = Math.floor(milliSecs / hourUnit)
    milliSecs -= hour * hourUnit
    const min = Math.floor(milliSecs / minUnit)
    milliSecs -= min * minUnit
    const sec = Math.floor(milliSecs / 1000)

    return `${padStart(hour.toString(), 2, '0')}:${padStart(min.toString(), 2, '0')}:${padStart(sec.toString(), 2, '0')}`
  }

  /**
   * local 유형의 ISO 문자열 반환
   * @param date
   */
  toLocalISOString = (date: Date) => {
    // const tzo = -date.getTimezoneOffset()
    // const dif = tzo >= 0 ? '+' : '-'

    const pad = num => {
      const norm = Math.floor(Math.abs(num))
      return (norm < 10 ? '0' : '') + norm
    }

    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':' +
      pad(date.getSeconds()) +
      '.' +
      padStart(date.getMilliseconds().toString(), 3, '0') +
      'Z'
      // dif +
      // pad(tzo / 60) +
      // ':' +
      // pad(tzo % 60)
    )
  }

  /**
   * JSON 변환 시, 일자를 현재 시간 기준으로 패치한다.

   */
  patchConvertJsonWithCurrentZone = () => {
    const instance = this

    // @ts-ignore
    // eslint-disable-next-line no-extend-native
    Date.prototype.toISOString = function (this: Date) {
      return instance.toLocalISOString(this)
    }
  }
}

const instance = new DateUtils()
export default instance
