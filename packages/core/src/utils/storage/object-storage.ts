import Storage from './storage'

/**
 object serializing support storage
 @packageDocumentation
 */
export interface ObjectStoreData {
  type: string
  data?: any
}

export default abstract class ObjectStorage extends Storage {
  /**
   * object data를 string 형태로 serialize
   * @param value
   */
  protected serializeValue(value: any): string {
    let valueType: string = typeof value
    if (!['string', 'number', 'bigint', 'boolean', 'object', 'undefined', 'null'].includes(valueType)) {
      throw new Error('not support value type.')
    }
    if (value === null) {
      valueType = 'null'
    }

    const storeData: ObjectStoreData = {
      type: valueType,
      data: value,
    }

    return JSON.stringify(storeData)
  }

  /**
   * 저장된 object data를 object 형태로 deserialize
   * @param value
   */
  protected deserializeValue(value: string): any {
    if (!value) {
      return value
    }

    const storedData = JSON.parse(value) as ObjectStoreData

    if (storedData.type === 'undefined') {
      return undefined
    } else if (storedData.type === 'null') {
      return null
    } else {
      return storedData.data
    }
  }
}
