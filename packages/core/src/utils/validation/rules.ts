/**
 * validation rule
 *  - required : 필수
 *  - custom : 커스톰 로직
 *  - email : 이메일
 *  - phone : 전화번호
 */
export type ValidationRuleType = 'required' | 'custom' | 'email' | 'phone'

/**
 * validation handler
 */
export type ValidationHandler = (value: any, component?: any) => string | boolean

/**
 * validation object rule
 */
export interface ValidationObjectRule {
  /**
   * validation type
   */
  type: ValidationRuleType

  /**
   * message on fail
   */
  message?: string

  /**
   * validation check handler
   */
  handler?: ValidationHandler

  /**
   * validation 설정 delay (unit. ms)
   * custom type일 경우만 유효함.
   * @default 0
   */
  delay?: number

  // inner timer
  _timer?: any
}

/**
 * validation rule
 */
export type ValidationRule = ValidationRuleType | ValidationHandler | ValidationObjectRule

/**
 * ValidationRule 유형의 값을 ValidationObjectRule 형태로 변경
 * @param rule
 * @returns
 */
export const toObjectRule = (rule: ValidationRule): ValidationObjectRule => {
  if (typeof rule === 'string') {
    return {
      type: rule,
    }
  }

  if (typeof rule === 'function') {
    return {
      type: 'custom',
      handler: rule,
    }
  }

  return rule
}
