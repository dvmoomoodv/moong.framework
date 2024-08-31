/**
 * Masking Type
 */
import padEnd from 'lodash/padEnd'

/**
 * 마스킹 유형
 */
export type MaskingType =
  /**
   * 이메일
   */
  | 'EMAIL'
  /**
   * 이름
   */
  | 'NAME'
  /**
   * 전화번호
   */
  | 'PHONE'

  /**
   * 주민번호
   */
  | 'PERSONAL_NO'

  /**
   * 아이디
   */
  | 'ID'

  /**
   * 아이피 주소
   */
  | 'IP'

  /**
   * 주소
   */
  | 'ADDRESS'

  /**
   * 우편 번호
   */
  | 'ZIP_NO'

  /**
   * 카드 번호
   */
  | 'CARD_NO'

  /**
   * 카드 유효기간
   */
  | 'CARD_PERIOD'

  /**
   * 계좌 번호
   */
  | 'ACC_NO'
  | string

/**
 * 마스킹 핸들러 유형
 */
export type MaskingHandler = (value: string) => string

export class Masking {
  private customRuleMap = new Map<MaskingType, MaskingHandler>()

  /**
   * custom 마스킹 룰을 등록한다.
   * @param type 마스킹 유형
   * @param handler MaskingHandler
   */
  registerMask(type: MaskingType, handler: MaskingHandler) {
    this.customRuleMap.set(type, handler)
  }

  /**
   * 마스킹 유형에 따른 function을 반환한다.
   */
  getMaskingFunctionByType = (type: MaskingType): MaskingHandler => {
    // custom rule
    if (this.customRuleMap.has(type)) {
      return this.customRuleMap.get(type)
    }

    if (type === 'EMAIL') {
      return this.email
    }
    if (type === 'NAME') {
      return this.name
    }
    if (type === 'PHONE') {
      return this.phone
    }
    if (type === 'PERSONAL_NO') {
      return this.rrn
    }
    if (type === 'ID') {
      return this.id
    }
    if (type === 'IP') {
      return this.ip
    }
    if (type === 'ADRESS') {
      return this.addr
    }
    if (type === 'ZIP_NO') {
      return this.zipnumber
    }
    if (type === 'CARD_NO') {
      return this.cardNo
    }
    if (type === 'CARD_PERIOD') {
      return this.cardPeriod
    }
    if (type === 'ACC_NO') {
      return this.accNo
    }

    throw new Error('허용되지 않은 마스킹 유형입니다.')
  }

  /**
   * 이메일 마스킹
   */
  email = (value: string) => {
    if (this.customRuleMap.has('EMAIL')) {
      return this.customRuleMap.get('EMAIL')(value)
    }

    if (!value) {
      return value
    }

    const originStr = value
    const emailStr = originStr.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)

    if (!emailStr) {
      return value
    }
    const strLength = emailStr.toString().split('@')[0].length - 3

    // ex1) abcdefg12345@naver.com => ab**********@naver.com
    return originStr.toString().replace(new RegExp('.(?=.{0,' + strLength + '}@)', 'g'), '*')

    // ex2) abcdefg12345@naver.com => ab**********@nav******
    // return originStr
    //   .toString()
    //   .replace(new RegExp('.(?=.{0,' + strLength + '}@)', 'g'), '*')
    //   .replace(/.{6}$/, '******')
  }

  /**
   * 전화 번호
   * @param value
   */
  phone = (value: string) => {
    if (this.customRuleMap.has('PHONE')) {
      return this.customRuleMap.get('PHONE')(value)
    }

    if (!value) {
      return value
    }

    const originStr = value
    let phoneStr
    let maskingStr
    if (originStr.toString().split('-').length !== 3) {
      // 1) -가 없는 경우
      phoneStr = originStr.length < 11 ? originStr.match(/\d{10}/gi) : originStr.match(/\d{11}/gi)
      if (!phoneStr) {
        return originStr
      }

      if (originStr.length < 11) {
        // 1.1) 0110000000
        maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/(\d{3})(\d{3})(\d{4})/gi, '$1***$3'))
      } else {
        // 1.2) 01000000000
        maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/(\d{3})(\d{4})(\d{4})/gi, '$1****$3'))
      }
    } else {
      // 2) -가 있는 경우
      phoneStr = originStr.match(/\d{2,3}-\d{3,4}-\d{4}/gi)
      if (!phoneStr) {
        return originStr
      }
      if (/-[0-9]{3}-/.test(phoneStr)) {
        // 2.1) 00-000-0000
        maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/-[0-9]{3}-/g, '-***-'))
      } else if (/-[0-9]{4}-/.test(phoneStr)) {
        // 2.2) 00-0000-0000
        maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/-[0-9]{4}-/g, '-****-'))
      }
    }
    return maskingStr
  }

  /**
   * 주민 번호
   * @param value
   */
  rrn = (value: string) => {
    if (this.customRuleMap.has('PERSONAL_NO')) {
      return this.customRuleMap.get('PERSONAL_NO')(value)
    }

    const originStr = value
    let rrnStr
    let maskingStr
    // let strLength
    if (!originStr) {
      return originStr
    }
    rrnStr = originStr.match(/(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-4]{1}[0-9]{6}\b/gi)
    if (rrnStr) {
      // strLength = rrnStr.toString().split('-').length
      maskingStr = originStr.toString().replace(rrnStr, rrnStr.toString().replace(/(-?)([1-4]{1})([0-9]{6})\b/gi, '$1$2******'))
    } else {
      rrnStr = originStr.match(/\d{13}/gi)
      if (rrnStr) {
        // strLength = rrnStr.toString().split('-').length
        maskingStr = originStr.toString().replace(rrnStr, rrnStr.toString().replace(/([0-9]{6})$/gi, '******'))
      } else {
        return originStr
      }
    }
    return maskingStr
  }

  /**
   * 이름
   */
  name = (value: string) => {
    if (this.customRuleMap.has('NAME')) {
      return this.customRuleMap.get('NAME')(value)
    }

    if (!value) {
      return value
    }
    if (value.length > 2) {
      const originName = value.split('')
      originName.forEach(function (_name, i) {
        if (i === 0 || i === originName.length - 1) return
        originName[i] = '*'
      })
      const joinName = originName.join()
      return joinName.replace(/,/g, '')
    } else {
      const pattern = /.$/
      return value.replace(pattern, '*')
    }
  }

  /**
   * 아이디
   */
  id = (value: string) => {
    if (this.customRuleMap.has('ID')) {
      return this.customRuleMap.get('ID')(value)
    }

    if (!value) {
      return value
    }

    const originStr = value
    let maskingStr: string

    if (originStr.length < 2) {
      maskingStr = originStr
    } else if (originStr.length < 3) {
      maskingStr = originStr.replace(/\S{1}$/, '*')
    } else {
      maskingStr = originStr.replace(/\S{2}$/, '**')
    }
    return maskingStr
  }

  /**
   * 아이피
   */
  ip = (value: string) => {
    if (this.customRuleMap.has('IP')) {
      return this.customRuleMap.get('IP')(value)
    }

    if (!value) {
      return value
    }

    const regex = /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/
    if (!regex.test(value)) {
      return value
    }

    const originStr = value
    const originStrArray = originStr.split('.')
    let maskingStr: string
    if (parseInt(originStrArray[0]) >= 128 && parseInt(originStrArray[0]) <= 191) {
      // B 클래스
      maskingStr = originStrArray[0] + '.' + '***' + '.' + originStrArray[2] + '.' + originStrArray[3]
    } else if (parseInt(originStrArray[0]) >= 192 && parseInt(originStrArray[0]) <= 223) {
      // C 클래스
      maskingStr = originStrArray[0] + '.' + originStrArray[1] + '.' + '***' + '.' + originStrArray[3]
    } else {
      // 기타
      maskingStr = originStrArray[0] + '.' + '***' + '.' + originStrArray[2] + '.' + originStrArray[3]
    }

    return maskingStr
  }

  /**
   * 주소
   */
  addr = (value: string) => {
    if (this.customRuleMap.has('ADDRESS')) {
      return this.customRuleMap.get('ADDRESS')(value)
    }

    if (!value) {
      return value
    }

    let value_arr = value.split(' ')

    if (value_arr.length > 4) {
      return value_arr[0] + ' ' + value_arr[1] + ' ' + value_arr[2] + ' ' + value_arr[3] + ' ****'
    }
    return value ? value.substring(0, value.length - 4) + '****' : ''
  }

  /**
   * 우편번호
   */
  zipnumber = (value: string) => {
    if (this.customRuleMap.has('ZIP_NO')) {
      return this.customRuleMap.get('ZIP_NO')(value)
    }

    if (!value) {
      return value
    }

    return value ? value.substring(0, value.length - 3) + '***' : ''
  }

  /**
   * 카드번호
   * @param value
   */
  cardNo = (value: string) => {
    if (this.customRuleMap.has('CARD_NO')) {
      return this.customRuleMap.get('CARD_NO')(value)
    }

    if (!value) {
      return value
    }

    let matched = value.match(/(\d{4})-(\d{4})-(\d{4})-(\d{4})/gi)
    if (matched && matched.length > 0) {
      for (let i = 0; i < matched.length; i++) {
        value = value.replace(matched[i], matched[i].toString().replace(/(\d{4})-(\d{4})-(\d{4})-(\d{4})/gi, '$1-****-****-$4'))
      }
    }

    matched = value.match(/(\d{4})(\d{4})(\d{4})(\d{4})/gi)
    if (matched && matched.length > 0) {
      for (let i = 0; i < matched.length; i++) {
        value = value.replace(matched[i], matched[i].toString().replace(/(\d{4})(\d{4})(\d{4})(\d{4})/gi, '$1********$4'))
      }
    }
    return value
  }

  /**
   * 카드유효기간
   * @param value
   */
  cardPeriod = (value: string) => {
    if (this.customRuleMap.has('CARD_PERIOD')) {
      return this.customRuleMap.get('CARD_PERIOD')(value)
    }

    if (!value) {
      return value
    }

    return '**/**'
  }

  /**
   * 계좌번호
   * @param value
   */
  accNo = (value: string) => {
    if (this.customRuleMap.has('ACC_NO')) {
      return this.customRuleMap.get('ACC_NO')(value)
    }

    if (!value) {
      return value
    }

    value = padEnd(value, 7, ' ')
    return value.substring(0, value.length - 6) + '******'
  }
}

const instance = new Masking()
export default instance
