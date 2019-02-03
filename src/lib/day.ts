export type Day = {
  date: Date,
  bmr: number,
  caloriesIn: any,
  caloriesOut: any,
}
export type Days = Day[]

export function net (day: Day): number | null {
  if (
    (isNaN(day.caloriesOut as any) && isNaN(day.caloriesIn as any)) ||
    (!day.caloriesOut && !day.caloriesIn)
  ) {
    return null
  }

  return -day.bmr - (day.caloriesOut || 0) + (day.caloriesIn || 0)
}
