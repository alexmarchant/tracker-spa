<template>
  <div class="calories">
    <div class="inputs-container">
      <inputs
        :days="days"
        :columns="inputColumns"
        @updateCaloriesOut="updateCaloriesOut"
        @updateCaloriesIn="updateCaloriesIn"
      />
      <div class="total">
        Total: {{totalCalories}} C | {{totalPounds}} lbs
      </div>
    </div>
    <div class="charts-container">
      <calories-chart :days="days" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getDaysInMonth, parse } from 'date-fns'
import Inputs from './Inputs.vue'
import CaloriesChart from './CaloriesChart.vue'
import { Day, attemptParseInt, net } from '../lib/day'
import { Column } from '../lib/column'
import api from '../lib/api'

const BMR = 2000

@Component({
  components: {
    Inputs,
    CaloriesChart
  }
})
export default class Calories extends Vue {
  days: Day[]
  loading = true

  constructor () {
    super()
    const dayCount = getDaysInMonth(new Date())
    this.days = []
    for (let i = 1; i <= dayCount; i++) {
      const today = new Date()
      const date = parse(`${today.getFullYear()}-${today.getMonth() + 1}-${i}`)
      this.days.push({
        date,
        bmr: BMR,
        caloriesIn: null,
        caloriesOut: null,
        milesRun: null,
        drinks: null
      })
    }
  }

  get bmr () {
    return BMR
  }

  get inputColumns (): Column[] {
    return [
      {
        title: 'BMR',
        value: () => BMR
      },
      {
        title: 'Out',
        value: (day) => day.caloriesOut,
        inputEvent: 'updateCaloriesOut'
      },
      {
        title: 'In',
        value: (day) => day.caloriesIn,
        inputEvent: 'updateCaloriesIn'
      },
      {
        title: 'Net',
        value: (day) => net(day)
      }
    ]
  }

  get totalCalories (): number {
    return this.days.reduce((sum, day) => {
      return sum + (net(day) || 0)
    }, 0)
  }

  get totalPounds (): number {
    return Math.round(this.totalCalories * 100 / 3500) / 100
  }

  async mounted () {
    let days
    try {
      days = await api.days.index(new Date())
    } catch (err) {
      console.error(err)
      return
    }

    days.forEach(resDay => {
      const resDate = parse(resDay.date)
      this.days.forEach(day => {
        if (
          day.date.getFullYear() === resDate.getFullYear() &&
          day.date.getMonth() === resDate.getMonth() &&
          day.date.getDate() === resDate.getDate()
        ) {
          if (resDay.bmr !== undefined) {
            day.bmr = resDay.bmr
          }
          if (resDay.caloriesIn !== undefined) {
            day.caloriesIn = resDay.caloriesIn
          }
          if (resDay.caloriesOut !== undefined) {
            day.caloriesOut = resDay.caloriesOut
          }
        }
      })
    })

    this.loading = false
  }

  updateCaloriesOut (index: number, calories: string) {
    const processedCalories = attemptParseInt(calories)
    const day = this.days[index]
    day.caloriesOut = processedCalories
    this.apiUpdateDay(
      day.date,
      BMR,
      day.caloriesIn,
      day.caloriesOut
    )
  }

  updateCaloriesIn (index: number, calories: string) {
    const processedCalories = attemptParseInt(calories)
    const day = this.days[index]
    day.caloriesIn = processedCalories
    this.apiUpdateDay(
      day.date,
      BMR,
      day.caloriesIn,
      day.caloriesOut
    )
  }

  async apiUpdateDay (date: Date, bmr: number | null, caloriesIn: number | null, caloriesOut: number | null) {
    try {
      await api.days.updateCalories(
        date,
        bmr,
        caloriesIn,
        caloriesOut
      )
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style scoped>
.calories {
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: auto;
  grid-template-areas:
    "table chart"
  ;
  height: 100%;
}

.inputs-container {
  grid-area: table;
  border-right: 1px solid #b5b5b5;
}

.charts-container {
  grid-area: chart;
}

.total {
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  text-align: right;
}
</style>
