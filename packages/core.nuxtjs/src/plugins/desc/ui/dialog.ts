import { Ustra } from '../../ustra'
import { UstraDialogHookInfo } from '../hooks/dialog'
import { Queue } from '#ustra/core/utils'

/**
 * UI Dialog 관련 기능
 */
export class Dialog {
  constructor(private $ustra: Ustra) {}

  private dialogQueue = new Queue<UstraDialogHookInfo>()
  private currentDialogInfo: UstraDialogHookInfo = null

  private addDialog(dialogInfo: UstraDialogHookInfo): Promise<unknown> {
    if (process.server) {
      return
    }

    const task: Promise<unknown> = new Promise<unknown>(resolve => {
      dialogInfo.closeCallback = r => {
        this.currentDialogInfo = null
        resolve(r)
      }

      // toast 시에는 바로 종료
      if (dialogInfo.type === 'toast') {
        setTimeout(() => resolve(undefined), 0)
      }
    }).then(result => {
      this.callNextDialog()
      return result
    })

    this.dialogQueue.enqueue(dialogInfo)
    this.callNextDialog()
    return task
  }

  private callNextDialog() {
    if (this.dialogQueue.length < 1 || this.currentDialogInfo) {
      return
    }

    this.currentDialogInfo = this.dialogQueue.dequeue()
    this.$ustra.hooks.callHook('ui:dialog', this.currentDialogInfo)

    if (this.currentDialogInfo.type === 'toast') {
      this.currentDialogInfo = null
    }
  }

  /**
   * show alert message
   * @param msg 메시지
   * @param title 제목
   */
  alert(msg: string, title?: string): Promise<void> {
    return this.addDialog({
      message: msg,
      title,
      type: 'alert',
    }) as Promise<void>
  }

  /**
   * show confirm message
   * @param msg 메시지
   * @param title 제목
   */
  confirm(msg: string, title?: string): Promise<boolean> {
    return this.addDialog({
      message: msg,
      title,
      type: 'confirm',
    }) as Promise<boolean>
  }

  /**
   * toast message
   * @param msg
   * @param displayTime
   */
  toast(msg: string, displayTime: number = 3000): Promise<void> {
    return this.addDialog({
      message: msg,
      displayTime,
      type: 'toast',
    }) as Promise<void>
  }

  /**
   * dialog hook을 요청
   * @param UstraDialogHookInfo dialog 정보
   * @returns
   */
  dialog(info: UstraDialogHookInfo) {
    return this.addDialog(info)
  }

  /**
   * 현재 오픈된 모든 dialog를 닫는다.
   */
  async closeAll() {
    await this.$ustra.hooks.callHook('ui:dialog:close')
    for (let n = 0; n < this.dialogQueue.length; n++) {
      this.dialogQueue.removeHead()
    }
    this.currentDialogInfo = null
  }
}
