/**
 * 生成一个指定区间随机数
 * @param start 
 * @param end 
 */
export function randomWith(start: number, end: number) {
  return start + Math.random() * (end - start)
}

/**
 * 1 - 9的数字转换为 01 02 ...
 * @param {*} num
 * @returns string
 */
export const numCompletion = (num: number | string) => (num < 10 && num >= 0) ? '0' + num : '' + num


/**
 * 累加数字
 * @param max 
 * @param dom 
 * @param interval 
 */
export function rafNumber(max: number, dom: HTMLElement, interval?: number) {
  let beforeTxt: string = dom.innerText || '0'
  let n = parseInt((beforeTxt.replace(/,/g, '') || 0).toString())
  interval = interval || parseInt((max / 77).toString()) || 1
  const fn = () => {
    if (max <= 0) {
      dom.innerText = '0'
    } else if (max > n) {
      n += interval as number
      if (n > max) n = max
      dom.innerText = formatNumber(n)
      requestAnimationFrame(fn)
    }
  }
  requestAnimationFrame(fn)
}

/**
 * 格式化数字 23784.12 => formatNumber(23784, 1, ',')  // 23,784.1
 * @param num 目标数字
 * @param precision 保留几位小数
 * @param separator 分隔符
 */
function formatNumber(num: number | string, precision?: number, separator?: string) {
  var parts
  if (!isNaN(parseFloat(num + '')) && isFinite(Number(num))) {
    if (!isNaN((num = parseFloat(num + ''))) && isFinite(num)) num = Number(num)
    num = (typeof precision !== 'undefined'
      ? num.toFixed(precision)
      : num
    ).toString()
    parts = num.split('.')
    parts[0] = parts[0]
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','))

    return parts.join('.')
  }
  return ''
}

/**
 * 小数转百分百
 */
export const toPercent = (num: number, len: number = 2) => {
  const [str1, str2] = (num * 100).toString().split('.')
  if (!str2) return str1 + '%'
  return str1 + '.' + str2.substr(0, len) + '%'
}

/**
 * 单位切换，默认切换为万 unitChange(8372) => 0.8372
 * @param num 
 * @param unit 
 */
export const unitChange = (num: number, unit: number = 10000) => num / unit
