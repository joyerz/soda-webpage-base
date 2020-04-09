import ajax from 'utils/Request'

import '../../assets/styles/global.scss'
import './index.scss'

import {
  CityTopEquipmentResponse,
} from './index.d'

ajax<CityTopEquipmentResponse>({
  url: '',
  success({ data }) {

  }
})