import { API } from 'config/index'

interface AjaxReqParams<R> {
  url: string,
  method?: 'POST' | 'GET' | 'PUT'
  data?: any
  error?: Function
  success?: (res: R) => void
  hasHost?: boolean
}

export default function <Response>(params: AjaxReqParams<Response>): void {
  $.ajax({
    url: params.hasHost ? params.url : API + params.url,
    method: params.method || 'GET',
    data: params.data,
    dataType: 'JSON',
    timeout: 30000,
    success: function (res) {
      try {
        if (!params.hasHost && res.code !== 0) {
          toastr.info(`${params.url} [${res.code}]`)
          throw 'res.code not Number(0)'
        }
        params.success && params.success(res as any)
      } catch (e) {
        console.error(e)
        params.error && params.error()
      }
    },
    error: () => {
      toastr.info(`${params.url} 请求错误.`)
      console.error(`${params.url} 请求错误.`)
      params.error && params.error()
    },
  })
}

toastr.options = {
  closeButton: false,
  debug: false,
  progressBar: false,
  positionClass: 'toast-top-right',
  showDuration: 300,
  hideDuration: 1000,
  timeOut: 3900,
  extendedTimeOut: 1000,
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut'
}