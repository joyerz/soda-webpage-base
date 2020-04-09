
/**
 * 获取id
 * @param name
 */
export const id = (name: string): HTMLElement => <HTMLElement>document.getElementById(name)

const isFF = navigator.userAgent.indexOf('Firefox') !== -1

/**
 * 根据页面宽高缩放目标 保证其在页面内
 */
export function zoomInDocument(target: HTMLElement): void {
  if (!target) return

  const { clientHeight: winH, clientWidth: winW } = document.documentElement
  const { offsetWidth: width, offsetHeight: height } = target

  const wScale = winW / (width),
    hScale = winH / height

  let scale = Math.min(wScale, winH / height),
    left, top

  if (hScale > wScale) {
    left = '0'
    top = ((winH - height * scale) / 2) + ''
  } else {
    left = ((winW - width * scale) / 2) + ''
    top = '0'
  }

  // if (isFF) {
    target.style.transform = `scale(${scale})`
  // } else {
  //   target.style.zoom = `${scale}`
  // }
  if (target.style.position !== 'absolute') {
    target.style.position = 'absolute'
    target.style.transformOrigin = '0 0'
  }

  target.style.top = top + 'px'
  target.style.left = left + 'px'
}

type ExtendHTMLScriptElement = {
  onreadystatechange?: any
  readyState?: any
}

const loadScriptCache: any = {}
/**
 * 加载一个库 并且监听是否加载完成
 * @param {*} url
 * @param {*} id
 */
export const loadScript = (url: string, id: string) => {
  if (!url || !id) return Promise.reject('url/id not is null')
  if (loadScriptCache[id]) {
    return loadScriptCache[id]
  }
  loadScriptCache[id] = new Promise((resolve, reject) => {
    const script: HTMLScriptElement & ExtendHTMLScriptElement = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.id = id
    document.body.appendChild(script)
    if (script.readyState) {
      script.onreadystatechange = () => {
        if (['loaded', 'complete'].includes(script.readyState)) {
          script.onreadystatechange = () => { }
          resolve()
        }
      }
    } else {
      script.onload = resolve
    }
  })
  return loadScriptCache[id]
}

/**
 * doms轮询新增选中样式
 */
export const domsLoopCurrent = (list: JQuery<HTMLElement>, hovername: string = 'hover', interval: number = 2000): number => {
  const max = list.length
  let idx = 0
  const makeTimer = () => setInterval(() => {
    list.eq(idx).addClass(hovername).siblings().removeClass(hovername)
    idx += 1
    if (idx >= max) {
      idx = 0
    }
  }, interval) as unknown as number
  let timer = makeTimer()
  list.hover(function (e, a) {
    timer && clearInterval(timer)
    $(this).addClass(hovername).siblings().removeClass(hovername)
  }, function () {
    timer = makeTimer()
  })
  return timer
}
