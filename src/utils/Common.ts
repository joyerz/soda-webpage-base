
interface ShowTipActionParams {
  target: echarts.ECharts
  maxIdx: number
  interval?: number
  seriesIndex?: number
  isIIFE?: boolean
  type?: 'showTip' | 'highlight'
}

/**
 * 图表显示showtip 定时器
 */
export function makeShowTipAction({
  target,
  maxIdx,
  isIIFE = true,
  interval = 3000,
  type = 'showTip',
  seriesIndex = 0,
}: ShowTipActionParams): number {
  let idx = 0
  const intervalFn = () => {
    target.dispatchAction({
      type,
      seriesIndex,
      dataIndex: idx
    })
    idx += 1
    if (idx >= maxIdx) idx = 0
  }
  isIIFE && intervalFn()
  return <any>setInterval(intervalFn, interval)
}


/**
 * 防抖
 * @param {*} func 执行的方法
 * @param {*} wait 间隔时间
 */
export const debounce = (fn: Function, wait?: number, iife?: boolean): any => {
  let timer: number = 0
  const timeWait = wait || 200
  if (iife) fn()
  return () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(fn, timeWait)
  }
}

/**
 * 节流
 * @param {*} func
 * @param {*} wait
 */
export const throttle = (fn: Function, wait?: number, iife?: boolean): any => {
  let prevTime = Date.now()
  const timeWait = wait || 200
  if (iife) fn()
  return function (): void {
    const now = Date.now()
    if (now > prevTime + timeWait) {
      fn()
      console.log('run')
      prevTime = now
    }
  }
}

/**
 * promise 检查条件成立后返回resolve
 * @param condition
 * @param times
 * @return {Promise}
 */
export const isReady = (condition: () => boolean, times: number = 0): any =>
  new Promise(resolve => {
    let count = 0
    const checkReady = () => {
      if (condition()) {
        resolve()
      } else {
        count++
        if (times === 0) {
          setTimeout(checkReady, 200)
        } else if (count < times) {
          setTimeout(checkReady, 200)
        }
      }
    }
    checkReady()
  })




