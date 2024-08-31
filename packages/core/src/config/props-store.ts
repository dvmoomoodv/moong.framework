/**
 * TODO: Module Description
 * @exports {@link PropsStore}
 * @exports {@link propsStore}
 * @packageDocumentation
 */

import { AppProps } from './props'
import core from '../utils/core'
import hooks from '../utils/hooks'
import { defaultProps } from './props/props-utils'

const PROPERTY_STORE_KEY = '__$ustra_app_props__'

export class PropsStore {
  private _isStored = false

  /**
   * 프로퍼티 저장 여부
   */
  get isStored() {
    return this._isStored
  }

  /**
   * 저장소에서 AppProps 객체를 조회
   * @returns
   */
  getProperties<T extends AppProps = AppProps>(): T {
    return core.global[PROPERTY_STORE_KEY]
  }

  /**
   * 기본 변수 값으로 AppProps 객체 조회
   * @returns
   */
  getPropertiesWithDefault<T extends AppProps = AppProps>(): T {
    return core.deepMerge({}, defaultProps({}), this.getProperties()) as T
  }

  /**
   * 저장소에 프로퍼티 저장
   * @param properties
   */
  setProperties<T extends AppProps = AppProps>(properties: T) {
    this._isStored = true
    core.global[PROPERTY_STORE_KEY] = properties
    hooks.callHook('properties:stored', properties)
  }
}

const instance = new PropsStore()
export { instance as propsStore }
