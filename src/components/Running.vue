<template>
  <div class="calories">
    <div class="inputs-container">
      <inputs
        :days="days"
        :columns="inputColumns"
        @updateMilesRun="updateMilesRun"
      />
    </div>
    <div class="charts-container">
      <running-chart :days="days" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getDaysInMonth, parse } from 'date-fns'
import Inputs from './RunningInputs.vue'
import RunningChart from './RunningChart.vue'
import { Day, attemptParseInt } from '../lib/day'
import api from '../lib/api'

const BMR = 2000

@Component({
  components: {
    Inputs,
    RunningChart
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

  get inputColumns (): Column[] {
    return [
      {
        title: 'Miles Run',
        value: (day) => day.milesRun,
        inputEvent: 'updateMilesRun'
      }
    ]
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
          if (resDay.milesRun !== undefined) {
            day.milesRun = resDay.milesRun
          }
        }
      })
    })

    this.loading = false
  }

  async updateMilesRun (index: number, milesRun: string) {
    const processedMilesRun = attemptParseInt(milesRun)
    const day = this.days[index]
    day.milesRun = processedMilesRun

    try {
      await api.days.updateMilesRun(
        day.date,
        day.milesRun
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
