import { Day } from '../day'
import { get, patch } from './helpers'
import store from '../store'

type UpdateDayPayload = {
  bmr?: number
  caloriesIn?: any
  caloriesOut?: any
  caloriesGoal?: any
  milesRun?: any
  milesRunGoal?: any
  drinks?: any
  drinksGoal?: any
}

export async function index (date: Date): Promise<Day[]> {
  const res = await get(`/days/${date.getFullYear()}/${date.getMonth() + 1}`)
  const data = await res.json()
  return data.days
}

export async function update (date: Date, payload: UpdateDayPayload): Promise<Response> {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return patch(`/days/${year}/${month}/${day}`, {
    ...payload
  })
}
