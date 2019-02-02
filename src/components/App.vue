<template>
  <div class="app">
    <div class="inputs-container">
      <inputs
        :days="days"
        :bmr="BMR"
        @updateCaloriesOut="updateCaloriesOut"
        @updateCaloriesIn="updateCaloriesIn"
      />
    </div>
    <div class="charts-container">
      <my-chart :days="days" :b-m-r="BMR" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import getDaysInMonth from 'date-fns/get_days_in_month'
import Inputs from './Inputs.vue'
import MyChart from './MyChart.vue'
import { Days, Day } from '../lib/Days'

const dayCount = getDaysInMonth(new Date())
const days: Days = []
for (let i = 0; i < dayCount; i++) {
  days.push({
    caloriesIn: null,
    caloriesOut: null
  })
}

@Component({
  components: {
    Inputs,
    MyChart
  }
})
export default class App extends Vue {
  days: Days = days
  BMR = 2000

  updateCaloriesOut (index: number, calories: string) {
    const processedCalories = this.processCalories(calories)

    this.days[index].caloriesOut = processedCalories
  }

  updateCaloriesIn (index: number, calories: string) {
    const processedCalories = this.processCalories(calories)

    this.days[index].caloriesIn = processedCalories
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
</style>
