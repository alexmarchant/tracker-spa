import { index, create } from './calories'

export const BASE_URL = document.location.host.match('localhost')
  ? document.location.host
  : 'http://api.tracker.alexmarchant.com'

export default {
  calories: {
    index,
    create
  }
}
