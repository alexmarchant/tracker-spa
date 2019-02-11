export type Day = {
  date: Date,
  bmr: number,
  caloriesIn: any,
  caloriesOut: any,
  milesRun: any,
}
export type Days = Day[]

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
