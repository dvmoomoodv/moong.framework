import objects from './objects'

/**
 * 모델 관련 유틸리티
 */
export class Model {
  /**
   * model의 unique키 값을 generate
   * @param obj generation할 객체
   * @
   */
  generateKey = (obj: any, keyFieldName: string, subListKeyFieldName?: string, parentKey?: string): any => {
    if (!obj) {
      return obj
    }

    let index = 0

    if (Array.isArray(obj)) {
      ;(obj as Array<any>).forEach(v => {
        const key = `${parentKey ? parentKey + '-' : ''}${++index}`
        v[keyFieldName] = key

        if (subListKeyFieldName && v[subListKeyFieldName] && Array.isArray(v[subListKeyFieldName])) {
          v[subListKeyFieldName] = this.generateKey(v[subListKeyFieldName], keyFieldName, subListKeyFieldName, key)
        }
      })
    } else {
      const key = `${parentKey ? parentKey + '-' : ''}${++index}`
      obj[keyFieldName] = key

      if (subListKeyFieldName && obj[subListKeyFieldName] && Array.isArray(obj[subListKeyFieldName])) {
        obj[subListKeyFieldName] = this.generateKey(obj[subListKeyFieldName], keyFieldName, subListKeyFieldName, key)
      }
    }

    return obj
  }

  /**
   * 재귀 반복 처리
   * @param sources 소스
   * @param subKeyName 하위 키 명
   * @param fn 실행할 함수
   * @param parents 상위객체 목록
   *
   * ```typescript
   *  coreUtils.reclusiveEach(obj, 'children', (current, parents)=>console.log(current, parents))
   * ```
   */
  reclusiveEach = <T = object>(sources: T | T[], subKeyName: string, fn: (current: T, parents: T[]) => void, parents: T[] = []) => {
    if (!sources) {
      return
    }

    if (!Array.isArray(sources)) {
      sources = [sources]
    }

    for (const source of sources) {
      fn(source, parents)

      if (source[subKeyName]) {
        this.reclusiveEach(source[subKeyName], subKeyName, fn, [...parents, source])
      }
    }
  }

  /**
   * 재귀 아이템을 탐색
   * @param sources 소스
   * @param subKeyName 하위 키 명
   * @param predicate 검증 함수
   * @returns
   */
  findReclusiveItem = <T = any>(sources: T | T[], subKeyName: string, predicate: (current: T) => boolean | void) => {
    if (!sources) {
      return
    }

    if (!Array.isArray(sources)) {
      sources = [sources]
    }

    const array = this.flatReclusiveArray(sources, subKeyName, false)
    for (const item of array) {
      if (predicate(item) === true) {
        return item
      }
    }
  }

  /**
   * array를 reclusive 구조로 생성한다.
   * @param listData list data
   * @param idField 아이디 필드 명 or function
   * @param parentIdField parent 아이디 필드 명 or function
   * @param childrenFieldName 하위 목록 필드 명
   */
  createReclusiveArray = <T = any>(
    listData: Array<T>,
    idField: string | ((data: T) => string),
    parentIdField: string | ((data: T) => string),
    childrenFieldName: string,
  ) => {
    if (!listData || listData.length < 1) {
      return listData
    }

    const reclusiveList: Array<T> = []

    const addItemForParent = (list: Array<T>, parentId) => {
      for (const data of listData) {
        const parentIdValue = this.getFieldValue(data, parentIdField)

        if ((!parentId && !parentIdValue) || parentId === parentIdValue) {
          if (!data[childrenFieldName]) {
            data[childrenFieldName] = []
          }
          list.push(data)

          const idValue = this.getFieldValue(data, idField)
          if (idValue) {
            addItemForParent(data[childrenFieldName], idValue)
          }
        }
      }
    }

    addItemForParent(reclusiveList, null)
    return reclusiveList
  }

  /**
   * reclusiveArray를 flat 구조로 변경한다.
   * @param listData 목록 데이터
   * @param childrenFieldName 하위 array 필드 명
   * @param removeChildItems 하위 item 제거 여부
   * @param addParentItem 상위 item 필드 추가 여부
   * @param parentItemFieldName 상위 item 필드 명
   */
  flatReclusiveArray = <T = any>(
    listData: Array<T>,
    childrenFieldName: string,
    removeChildItems: boolean = true,
    addParentItem = false,
    parentItemFieldName: string = 'parent',
  ) => {
    const flatList: Array<T> = []

    const flat = (list: Array<T>, parent: T) => {
      for (const data of list) {
        if (data) {
          if (addParentItem) {
            data[parentItemFieldName] = parent
          }

          flatList.push(data)

          if (data[childrenFieldName]) {
            flat(data[childrenFieldName] as Array<T>, data)
          }
          if (removeChildItems) {
            delete data[childrenFieldName]
          }
        }
      }
    }

    flat(listData, null)
    return flatList
  }

  private getFieldValue = (data: any, extractor: string | Function) => {
    if (typeof extractor === 'string') {
      return data[extractor]
    } else if (typeof extractor === 'function') {
      return extractor(data)
    }

    return undefined
  }

  /**
   * model에서 시스템 필드를 제거한다.
   * @param model
   * @returns
   */
  removeSystemField(model: Record<string, any>) {
    if (!model) {
      return
    }

    return objects.omit(model, 'regDttm', 'regUsrId', 'regUsrIp', 'updDttm', 'updUsrId', 'updUsrIp')
  }
}

const instance = new Model()
export default instance
