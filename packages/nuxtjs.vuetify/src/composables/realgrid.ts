import { GridView, LocalDataProvider } from 'realgrid'
import { ValueType } from 'realgrid'
/**
 * TODO
 * - useRG, useLocalDataProvider 합쳐서 관리하게
 * - 생성시 Field, Columns 값을 넣어서 한번에 생성
 * - Page내에서는 gridView와 dataProvider 변수는 있어야함.
 *
 */

export const useRGSetting = () => {
  return [GridView, LocalDataProvider]
}

/**
 * useRg
 * @param el String
 * @returns
 */
export const useRG = (el: string = 'realgrid') => {
  return new GridView(el)
}

/**
 * useRGLocalDataProvider
 * @param undoable  default:false
 * @returns
 */
export const useRGLocalDataProvider = (undoable: boolean = false) => {
  return new LocalDataProvider(undoable)
}

/**
 * useRGSetSelectionType
 * @param grid
 * @param selectionType
 */
// 해당 타입은 컴포넌트 내부 옵션 interface에서 정의할것
//export const useRGSetSelectionType = (grid, selectionType: 'block' | 'rows' | 'columns' | 'singleRow' | 'singleColumn' | 'none') => {
export const useRGSetSelectionType = (grid, option) => {
  grid.displayOptions.selectionStyle = option.selectionStyle
}

/**
 * useRGSetMultipleSelection
 * @param grid
 * @param isMultiple
 */
//export const useRGSetMultipleSelection = (grid, isMultiple: boolean) => {
export const useRGSetMultipleSelection = (grid, option) => {
  if (option.isMultiple) grid.displayOptions.selectionStyle = 'extended'
  else grid.displayOptions.selectionStyle = null
}

/**
 * useRGValueType
 * @param type
 * @returns
 */
export const useRGValueType = (type: 'boolean' | 'char' | 'date' | 'datetime' | 'int' | 'number' | 'object' | 'text' | 'uint' | 'unum') => {
  if (type === 'boolean') {
    return ValueType.BOOLEAN
  } else if (type === 'char') {
    return ValueType.CHAR
  } else if (type === 'date') {
    return ValueType.DATE
  } else if (type === 'datetime') {
    return ValueType.DATETIME
  } else if (type === 'int') {
    return ValueType.INT
  } else if (type === 'number') {
    return ValueType.NUMBER
  } else if (type === 'object') {
    return ValueType.OBJECT
  } else if (type === 'text') {
    return ValueType.TEXT
  } else if (type === 'uint') {
    return ValueType.UINT
  } else if (type === 'unum') {
    return ValueType.UNUM
  }
}

/**
 * useRGSetFillStyle
 * @param grid
 * @param fitStyle
 */
export const useRGSetFitStyle = (grid, option) => {
  if (!option.fitStyle) {
    option.fitStyle = 'none'
  }
  grid.displayOptions.fitStyle = option.fitStyle
}
