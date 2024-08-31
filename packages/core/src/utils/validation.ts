/**
 * Validation 관련 유틸리티
 * @exports {@link modules}
 * @packageDocumentation
 */

export class Validation {
  /**
   * ip address 유효성을 확인한다.
   * ip address는 xxx.xxx.xxx.xxx 형태로 표시하여야 한다.
   * @param value
   */
  ipAddress(value: string) {
    const regex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return regex.test(value)
  }

  /**
   * 사업자 번호 유효성을 확인한다.
   * @param value
   * @param includeDash "-" 문자까지 포함된 validation check
   */
  bizReisterNum(value: string, includeDash = false) {
    if (includeDash) {
      if (!/^\d{3}-\d{2}-\d{5}$/.test(value)) {
        return false
      }
    }

    const valueMap = value
      .replace(/-/gi, '')
      .split('')
      .map(function (item) {
        return parseInt(item, 10)
      })

    if (valueMap.length === 10) {
      const multiply = [1, 3, 7, 1, 3, 7, 1, 3, 5]
      let checkSum = 0

      for (let i = 0; i < multiply.length; ++i) {
        checkSum += multiply[i] * valueMap[i]
      }

      // @ts-ignore
      checkSum += parseInt((multiply[8] * valueMap[8]) / 10, 10)
      return Math.floor(valueMap[9]) === (10 - (checkSum % 10)) % 10
    }

    return false
  }

  /**
   * 법인번호의 유효성을 확인한다.
   * @param value
   * @param includeDash "-" 문자까지 포함된 validation check
   */
  corpRegisterNum(value: string, includeDash = false) {
    if (includeDash) {
      if (!/^\d{6}-\d{7}$/.test(value)) {
        console.log('value', value)
        return false
      }
    }

    value = value.replace('-', '')

    if (value.length != 13) {
      return false
    }

    var regNos = value.split('')
    var map = new Array(1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2)
    var sum = 0
    var digit = 0

    for (let i = 0; i < 12; i++) {
      sum += parseInt(regNos[i]) * map[i]
    }

    digit = 10 - (sum % 10)

    digit = digit % 10

    if (digit !== parseInt(regNos[12])) {
      return false
    }
    return true
  }

  /**
   * 이메일 주소 유효성을 확인
   */
  email(value: string) {
    const regex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/
    return regex.test(value)
  }

  /**
   * 전화 번호 유효성을 확인
   * @param value
   */
  phoneNo(value: string) {
    const regex = /^\d{2,3}-\d{3,4}-\d{4}$/
    return regex.test(value)
  }

  /**
   * 모바일 번호의 유효성 확인
   * @param value
   */
  mobileNo(value: string) {
    const regex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
    return regex.test(value)
  }
}

const instance = new Validation()
export default instance
