import { Days } from '../day'
import { get, patch } from './helpers'
import store from '../store'

export async function updateCalories (date: Date, bmr: number | null, caloriesIn: number | null, caloriesOut: number | null): Promise<Response> {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return patch(`/days/${year}/${month}/${day}`, {
    bmr,
    caloriesIn,
    caloriesOut
  })
}

export async function updateMilesRun (date: Date, milesRun: number | null): Promise<Response> {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return patch(`/days/${year}/${month}/${day}`, {
    milesRun
  })
}

export async function updateDrinks (date: Date, drinks: number | null): Promise<Response> {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return patch(`/days/${year}/${month}/${day}`, {
    drinks
  })
}

export async function index (date: Date): Promise<Days> {
  const res = await get(`/days/${date.getFullYear()}/${date.getMonth() + 1}`)
  const data = await res.json()
  return data.days
}
