import { Days } from '../day'
import { BASE_URL } from './index'

export async function create (date: Date, bmr: number | null, caloriesIn: number | null, caloriesOut: number | null) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return fetch(`${BASE_URL}/calories/${year}/${month}/${day}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      bmr,
      caloriesIn,
      caloriesOut
    })
  })
}

export async function index (date: Date): Promise<Days> {
  const res = await fetch(`${BASE_URL}/calories/${date.getFullYear()}/${date.getMonth() + 1}`)
  const data = await res.json()
  return data.days
}
