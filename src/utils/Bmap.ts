import { loadScript } from './DomHelper'

import { BDMAP_KEY } from 'config/index'

interface AddressRes extends BMap.GeolocationResult {
  address?: {
    city: string
    city_code: number
    district: string
    province: string
    street: string
    street_number: string
  }
}

interface RequestCurrentCity {
  (): Promise<AddressRes>
}


/**
 * 获取当前位置城市名称和经纬度
 */
export const loadCurCity: RequestCurrentCity = async () => {
  await loadScript('https://api.map.baidu.com/getscript?v=2.0&ak=' + BDMAP_KEY + '&services', 'bdmap')
  const geolocation = new BMap.Geolocation()
  const pos = await new Promise<AddressRes>((resolve, reject) => {
    geolocation.getCurrentPosition(function (r) {
      const status = this.getStatus()
      if (status == BMAP_STATUS_SUCCESS) {
        resolve(r)
      } else {
        reject()
        throw 'failed' + status
      }
    }, { enableHighAccuracy: true })  // 开启高精度
  })

  return pos
}