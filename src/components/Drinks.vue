<template>
  <div class="calories">
    <div class="inputs-container">
      <inputs
        :days="days"
        :columns="inputColumns"
        @updateDrinks="updateDrinks"
      />
    </div>
    <div class="charts-container">
      <charts
        :days="days"
        :actualData="actualData"
        :goalData="goalData"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getDaysInMonth, parse } from 'date-fns'
import Inputs, { InputColumn } from './Inputs.vue'
import Charts from './Charts.vue'
import { Day, attemptParseInt } from '../lib/day'
import api from '../lib/api'

const BMR = 2000

@Component({
  components: {
    Inputs,
    Charts
  }
})
export default class Drinks extends Vue {
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

  get inputColumns (): InputColumn[] {
    return [
      {
        title: 'Drinks',
        value: (day) => day.drinks,
        inputEvent: 'updateDrinks'
      }
    ]
  }

  get goalData (): number[] {
    let total = 0
    return [
      0, 0, 0,
      0, 0, 0, 0, 4, 4, 0,
      0, 0, 0, 0, 4, 4, 0,
      0, 0, 0, 0, 4, 4, 0,
      0, 0, 0, 0
    ].map(drinks => {
      total += (drinks || 0)
      return total
    })
  }

  get actualData (): any[] {
    let total = 0
    return this.days.map(day => {
      if (day.drinks !== undefined && day.drinks !== null) {
        total += day.drinks
        return total
      } else {
        return null
      }
    })
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
  border-right: 1px solid #b5b5b5;
}

.charts-container {
  grid-area: chart;
}
</style>
