/**
 * object일 경우 DeppPartial
 * 아닐 경우 T
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : Partial<T>

/**
 * cancelable promise class
 */
export class CancelablePromise<T = void> extends Promise<T> {
  private cancelHandler: () => void | Promise<void> = null

  /**
   * Creates a new Promise.
   * @param executor A callback used to initialize the promise. This callback is passed two arguments:
   * a resolve callback used to resolve the promise with a value or the result of another promise,
   * and a reject callback used to reject the promise with a provided reason or error.
   */
  constructor(
    executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void,
    cancelHandler: () => void | Promise<void> = null,
  ) {
    super(executor)
    this.cancelHandler = cancelHandler
  }

  /**
   * cancel promise
   */
  async cancel() {
    if (this.cancelHandler) {
      await this.cancelHandler()
    }
  }
}
