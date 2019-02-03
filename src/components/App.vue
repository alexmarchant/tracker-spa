<template>
  <div class="app">
    <div class="inputs-container">
      <inputs
        :days="days"
        @updateCaloriesOut="updateCaloriesOut"
        @updateCaloriesIn="updateCaloriesIn"
      />
    </div>
    <div class="charts-container">
      <my-chart :days="days" />
    </div>
    <div v-if="loading" class="loading-modal">
      <div class="loading-modal-text">Loading...</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getDaysInMonth, parse } from 'date-fns'
import Inputs from './Inputs.vue'
import MyChart from './MyChart.vue'
import { Days, Day } from '../lib/day'
import api from '../lib/api'

const BMR = 2000

@Component({
  components: {
    Inputs,
    MyChart
  }
})
export default class App extends Vue {
  days: Days
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
        caloriesOut: null
      })
    }
  }

  get bmr () {
    return BMR
  }

  async mounted () {
    let days
    try {
      days = await api.calories.index(new Date())
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
          if (resDay.bmr) {
            day.bmr = resDay.bmr
          }
          if (resDay.caloriesIn) {
            day.caloriesIn = resDay.caloriesIn
          }
          if (resDay.caloriesOut) {
            day.caloriesOut = resDay.caloriesOut
          }
        }
      })
    })

    this.loading = false
  }

  updateCaloriesOut (index: number, calories: string) {
    const processedCalories = this.processCalories(calories)
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
    const processedCalories = this.processCalories(calories)
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
      await api.calories.create(
        date,
        bmr,
        caloriesIn,
        caloriesOut
      )
    } catch (err) {
      console.error(err)
    }
  }

  processCalories (calories: string): any {
    if (!isNaN(calories as any)) {
      const result = parseInt(calories, 10)
      if (isNaN(result as any)) {
        return null
      }
      return result
    } else {
      return calories
    }
  }
}
</script>

<style>
html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

body {
  margin: 0;
  font-family: Arial,x-locale-body,sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>

<style scoped>
.app {
  display: grid;
  grid-template-columns: 400px auto;
  grid-template-rows: auto;
  height: 100vh;
}

.inputs-container {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.charts-container {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}

.loading-modal {
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-modal-text {
  font-size: 32px;
  font-weight: bold;
  color: white;
}
</style>
