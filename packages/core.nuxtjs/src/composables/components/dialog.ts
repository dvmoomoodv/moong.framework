import toString from 'lodash/toString'
import { ref, watch, UstraDialogHookInfo, nextTick, computed, useUstra } from '#ustra/nuxt'
import { Queue } from '#ustra/core/utils'

/**
 * Dialog Component를 정의
 * @param options component options
 *  - onShownDialog: {(dialogInfo: UstraDialogHookInfo) => void} dialog 오픈 callback
 *  - onHiddenDialog: {(dialogInfo: UstraDialogHookInfo) => void} dialog hidden callback
 *  - hideDialogWhenRouteChanges: {boolean} router 변경 시 dialog hidden 여부
 * @returns
 * - dialogStates : dialog 상태 및 기능
 * - toastStates : toast 상태 및 기능
 */
export const defineUstraDialogComponent = (
  options: {
    /**
     * dialog 오픈 callback
     */
    onShownDialog?: (dialogInfo: UstraDialogHookInfo) => void

    /**
     * dialog hidden callback
     */
    onHiddenDialog?: (dialogInfo: UstraDialogHookInfo) => void

    /**
     * router 변경 시 dialog hidden 여부
     *
     */
    hideDialogWhenRouteChanges?: boolean
  } = {},
) => {
  /**
   * 토스트 메시지
   */
  type ToastMessage = {
    /**
     * 메시지 텍스트
     */
    text: string

    /**
     * 타임아웃
     */
    timeout: number
  }

  const $ustra = useUstra()

  options = $ustra.utils.core.deepMerge({ hideDialogWhenRouteChanges: true }, options)

  const dialogStates = (() => {
    const showDialog = ref(false)
    const lastDialogInfo = ref<UstraDialogHookInfo>()
    const confirmResult = ref<boolean>(false)

    watch(showDialog, v => {
      if (!v && lastDialogInfo.value) {
        if (lastDialogInfo.value.closeCallback) {
          if (lastDialogInfo.value.type === 'alert') {
            lastDialogInfo.value.closeCallback()
          } else {
            lastDialogInfo.value.closeCallback(confirmResult.value)
          }
        }

        const dialogInfo = lastDialogInfo.value
        if (options.onHiddenDialog) {
          nextTick(() => {
            options.onHiddenDialog(dialogInfo)
          })
        }

        lastDialogInfo.value = null
      }
    })

    const message = computed(() => {
      return (toString(lastDialogInfo.value?.message) || '').replace(/\n/g, '<br/>')
    })

    return {
      /**
       * dialog 오픈 여부
       */
      showDialog,

      /**
       * 현재 dialog 정보
       */
      lastDialogInfo,

      /**
       * confirm 유형일 경우, 결과 값
       */
      confirmResult,

      /**
       * 현재 노출 메시지
       */
      message,
    }
  })()

  const toastStates = (() => {
    const showToast = ref(false)
    const toastQueue = new Queue<ToastMessage>()
    const currentToast = ref<ToastMessage>(null)

    function showNextToast() {
      toastStates.currentToast.value = toastQueue.dequeue()
      toastStates.showToast.value = !!currentToast.value
    }

    return {
      /**
       * toast 오픈 여부
       */
      showToast,

      /**
       * toast Queue 정보
       */
      toastQueue,

      /**
       * 현재 toast 정보 값
       */
      currentToast,

      /**
       * 다음 Queue에 존재하는 toast show
       */
      showNextToast,
    }
  })()

  $ustra.hooks.hook('ui:dialog', async dialog => {
    await nextTick()
    if (dialog.type === 'alert' || dialog.type === 'confirm') {
      dialogStates.lastDialogInfo.value = dialog
      dialogStates.confirmResult.value = false
      dialogStates.showDialog.value = true

      if (options.onShownDialog) {
        nextTick(() => {
          options.onShownDialog(dialog)
        })
      }
    } else if (dialog.type === 'toast') {
      toastStates.toastQueue.enqueue({
        text: dialog.message,
        timeout: dialog.displayTime,
      })

      toastStates.showNextToast()
    }
  })

  $ustra.hooks.hook('ui:dialog:close', () => {
    dialogStates.showDialog.value = false
    for (let n = 0; n < toastStates.toastQueue.length; n++) {
      toastStates.toastQueue.removeHead()
    }
  })

  $ustra.nuxtApp.hook('page:start', () => {
    if (options.hideDialogWhenRouteChanges) {
      $ustra.ui.dialog.closeAll()
    }
  })

  return {
    /**
     * dialog 상태
     */
    dialogStates,

    /**
     * toast 상태
     */
    toastStates,
  }
}
