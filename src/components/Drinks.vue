<template>
  <div class="calories">
    <div class="inputs-container">
      <drinks-inputs
        :days="days"
        @updateDrinks="updateDrinks"
      />
    </div>
    <div class="charts-container">
      <drinks-chart :days="days" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getDaysInMonth, parse } from 'date-fns'
import DrinksInputs from './DrinksInputs.vue'
import DrinksChart from './DrinksChart.vue'
import { Days, Day, attemptParseInt } from '../lib/day'
import api from '../lib/api'

const BMR = 2000

@Component({
  components: {
    DrinksInputs,
    DrinksChart
  }
})
export default class Drinks extends Vue {
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
        caloriesOut: null,
        milesRun: null,
        drinks: null
      })
    }
  }

  get bmr () {
    return BMR
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
          if (resDay.drinks !== undefined) {
            day.drinks = resDay.drinks
          }
        }
      })
    })

    this.loading = false
  }

  async updateDrinks (index: number, drinks: string) {
    const processedDrinks = attemptParseInt(drinks)
    const day = this.days[index]
    day.drinks = processedDrinks

    try {
      await api.days.updateDrinks(
        day.date,
        day.drinks
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
}

.charts-container {
  grid-area: chart;
}
</style>
