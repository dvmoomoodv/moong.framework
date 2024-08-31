export class EventUtils {
  /**
   * keydown 이벤트 시, number만 입력되도록 처리
   * @param e
   */
  onlyNumberOnKeydown(e: KeyboardEvent) {
    const isAllowed = (e.key >= '0' && e.key <= '9') || this.isInputUtilityKey(e)

    if (!isAllowed) {
      e.preventDefault()
    }

    return isAllowed
  }

  isInputUtilityKey(e: KeyboardEvent) {
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'Home' ||
      e.key === 'End' ||
      e.key === 'Esc' ||
      e.key === 'Tab'
    ) {
      return true
    }

    if (e.ctrlKey && !e.altKey && !e.shiftKey) {
      if (['c', 'C', 'v', 'V', 'a', 'A', 'z', 'Z', 'y', 'Y'].includes(e.key)) {
        return true
      }
    }

    return false
  }
}

const instance = new EventUtils()
export default instance
