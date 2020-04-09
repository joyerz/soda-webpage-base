export const API = {
  'development': '/api',
  'production': location.origin,
}[<'development' | 'production'>process.env.NODE_ENV || 'development']

export const WEATHER_API       = 'https://www.tianqiapi.com/api/'
export const WEATHER_APPID     = ''
export const WEATHER_APPSECRET = ''

export const BDMAP_KEY = ''