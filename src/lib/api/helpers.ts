import store from '../store'

export const BASE_URL = document.location.host.match('localhost')
  ? `http://localhost:3000`
  : 'https://api.tracker.alexmarchant.com'

type apiFetchOptions = {
  method?: 'GET' | 'PATCH' | 'POST'
  body?: object | any[]
}

export async function apiFetch (path: string, options: apiFetchOptions = {}): Promise<Response> {
  const fetchOptions: any = {
    headers: {
      'Authorization': `Bearer ${store.state.token}`
    }
  }

  // Build request
  if (options.method) {
    fetchOptions.method = options.method
  }
  if (options.body) {
    fetchOptions.headers['Content-Type'] = 'application/json'
    fetchOptions.body = JSON.stringify(options.body)
  }

  // Make request
  const res = await fetch(`${BASE_URL}${path}`, fetchOptions)

  // Check for bad status codes
  if (res.status >= 400 && res.status < 600) {
    let message
    try {
      const data: any = res.json()
      message = data.error
    } catch (e) {
      message = 'Network error'
    }
    throw new Error(message)
  }

  return res
}

export function get (path: string): Promise<Response> {
  return apiFetch(path)
}

export function post (path: string, body: object): Promise<Response> {
  const fetchOptions: any = {
    body,
    method: 'POST'
  }
  return apiFetch(path, fetchOptions)
}

export function patch (path: string, body: object): Promise<Response> {
  const fetchOptions: any = {
    body,
    method: 'PATCH'
  }
  return apiFetch(path, fetchOptions)
}
