export type Day = {
  caloriesIn: any,
  caloriesOut: any,
}
export type Days = Day[]

export function net (BMR: number, day: Day): number | null {
  if (
    (isNaN(day.caloriesOut as any) && isNaN(day.caloriesIn as any)) ||
    (!day.caloriesOut && !day.caloriesIn)
  ) {
    return null
  }

  return -BMR - (day.caloriesOut || 0) + (day.caloriesIn || 0)
}
