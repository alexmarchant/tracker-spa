import { post } from './helpers'

export async function create (email: string, password: string): Promise<string> {
  const res = await post('/sessions', {
    email,
    password
  })
  const data = await res.json()
  return data.token
}
