import { Queue } from '../queue'
import functions from '../functions'
import core from '../core'

export interface TaskQueueOptions {
  /**
   * 동시 호출 가능한 호출 수 설정 (0이하일 경우, 무제한)
   * @default 3
   */
  maximumConcurrentNumber: number

  /**
   * task delay
   * @default 10
   */
  taskDelay: number
}

export interface Task {
  handler: Function
  taskId: string
  cancel?: Function
  taskTypeId?: string
}

export class TaskQueue {
  private inQueue: Queue<Task> = new Queue()
  private paused: boolean = true
  private executingTaskMap: Map<string, Task> = new Map()
  private options: Partial<TaskQueueOptions>

  private get executingNumber() {
    return this.executingTaskMap.size
  }

  constructor(options: Partial<TaskQueueOptions> = {}) {
    this.options = core.deepMerge(
      {
        maximumConcurrentNumber: 3,
        taskDelay: 10,
      },
      options || {},
    )
  }

  /**
   * 작업 시작 처리
   * @returns
   */
  private async start() {
    if (this.paused) {
      return
    }

    if (this.options.maximumConcurrentNumber <= 0 || this.executingNumber < this.options.maximumConcurrentNumber) {
      if (this.inQueue.length < 1) {
        // setTimeout(() => this.start(), this.options.taskDelay)
        this.paused = true
        return
      }
      const task = this.inQueue.dequeue()

      let result: any
      try {
        this.executingTaskMap.set(task.taskId, task)
        result = task.handler()

        if (functions.isPromise(result)) {
          result.then(r => {
            this.executingTaskMap.delete(task.taskId)
            return r
          })
        }
      } finally {
        if (!functions.isPromise(result)) {
          this.executingTaskMap.delete(task.taskId)
        }
      }
    }

    if (this.options.maximumConcurrentNumber > 0) {
      setTimeout(() => this.start(), this.options.taskDelay)
    } else {
      this.start()
    }
  }

  /**
   * 작업 중지 처리
   */
  pause() {
    this.paused = true
  }

  // resume() {
  //   this.paused = false
  // }

  /**
   * 작업 추가
   * @param task
   */
  add(task: Task) {
    this.inQueue.enqueue(task)

    if (this.paused) {
      this.paused = false
      this.start()
    }
  }

  /**
   * 작업 초기화
   * @param taskTypeId Task 아이디 (지정된 지정된 영역만 삭제 됨)
   */
  async clear(taskTypeId?: string) {
    this.paused = true

    await core.sleep(this.options.taskDelay)

    if (!taskTypeId) {
      while (this.inQueue.length > 0) {
        const task = this.inQueue.dequeue()
        await task.cancel?.()
      }

      this.executingTaskMap.forEach(async (v, k) => {
        await v.cancel?.()
      })
      this.executingTaskMap.clear()
    } else {
      const tasks = this.inQueue.toArray()
      for (const task of tasks) {
        if (task.taskTypeId === taskTypeId) {
          this.inQueue.remove(task)
        }
      }

      this.executingTaskMap.forEach(async (v, k) => {
        if (v.taskTypeId === taskTypeId) {
          await v.cancel?.()
        }
      })

      if (this.inQueue.length > 0) {
        this.paused = false
        this.start()
      }
    }
  }
}
