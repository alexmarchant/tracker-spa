<template>
  <div class="app">
    <div class="inputs-container">
      <inputs
        :days="days"
        :bmr="BMR"
        @updateCaloriesIn="updateCaloriesIn"
        @updateCaloriesOut="updateCaloriesOut"
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

  updateCaloriesIn (index: number, calories: number) {
    this.days[index].caloriesIn = calories
    console.log(index, calories)
  }

  updateCaloriesOut (index: number, calories: number) {
    this.days[index].caloriesOut = calories
    console.log(index, calories)
  }
}
</script>

<style>
body {
  margin: 0;
}
</style>

<style scoped>
.app {
  display: grid;
  grid-template-columns: 300px auto;
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
