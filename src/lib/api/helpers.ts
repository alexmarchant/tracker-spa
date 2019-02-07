export const BASE_URL = document.location.host.match('localhost')
  ? `http://localhost:3000`
  : 'http://api.tracker.alexmarchant.com'
