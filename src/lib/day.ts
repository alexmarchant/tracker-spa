import { parse } from 'date-fns'

const BMR = 2000

export type Day = {
  date: Date
  bmr: number
  caloriesIn?: any
  caloriesOut?: any
  caloriesGoal?: any
  milesRun?: any
  milesRunGoal?: any
  drinks?: any
  drinksGoal?: any
}

export function net (day: Day): number | null {
  if (!isNumber(day.caloriesOut) && !isNumber(day.caloriesIn)) {
    return null
  }

  return -day.bmr - (day.caloriesOut || 0) + (day.caloriesIn || 0)
}

export function attemptParseInt (string: string): any {
  if (!isNaN(string as any)) {
    const result = parseInt(string, 10)
    if (isNaN(result as any)) {
      return null
    }
    return result
  } else {
    return string
  }
}

function isNumber (value: any): boolean {
  if (value === null || value === undefined) {
    return false
  }
  return !isNaN(value)
}

export function emptyDay (date: Date): Day {
  return {
    date,
    bmr: BMR,
    caloriesIn: null,
    caloriesOut: null,
    caloriesGoal: null,
    milesRun: null,
    milesRunGoal: null,
    drinks: null,
    drinksGoal: null
  }
}

export function parseDay (obj: any): Day {
  obj.date = parse(obj.date.split('T')[0])
  return obj as Day
}
