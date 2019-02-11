import { Days } from '../day'
import { BASE_URL } from './helpers'

export async function updateCalories (date: Date, bmr: number | null, caloriesIn: number | null, caloriesOut: number | null): Promise<Response> {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return fetch(`${BASE_URL}/days/${year}/${month}/${day}`, {
    method: 'PATCH',
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

export async function updateMilesRun (date: Date, milesRun: number | null): Promise<Response> {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return fetch(`${BASE_URL}/days/${year}/${month}/${day}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      milesRun
    })
  })
}

export async function index (date: Date): Promise<Days> {
  const res = await fetch(`${BASE_URL}/days/${date.getFullYear()}/${date.getMonth() + 1}`)
  const data = await res.json()
  return data.days
}
