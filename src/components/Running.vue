<template>
  <dashboard
    :inputColumns="inputColumns"
    :chart-data="chartData"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { getDaysInMonth, parse } from 'date-fns'
import { Day, attemptParseInt } from '../lib/day'
import { InputColumn } from './Inputs.vue'
import { ChartDataSet } from './Charts.vue'
import api from '../lib/api'
import Dashboard from './Dashboard.vue'

@Component({
  components: {
    Dashboard
  }
})
export default class Calories extends Vue {
  @Prop()
  days!: Day[]

  get inputColumns (): InputColumn[] {
    return [
      {
        title: 'Miles Run',
        value: (day) => day.milesRun,
        updateKey: 'milesRun'
      }, {
        title: 'Goal',
        value: (day) => day.milesRunGoal,
        updateKey: 'milesRunGoal',
        alwaysEnabled: true
      }
    ]
  }

  get chartData (): ChartDataSet[] {
    return [
      {
        label: 'Actual',
        data: this.actualData
      }, {
        label: 'Goal',
        data: this.goalData,
        dashed: true
      }
    ]
  }

  get actualData (): any[] {
    let total = 0
    return this.$store.state.days.map((day: Day) => {
      if (day.milesRun !== undefined && day.milesRun !== null) {
        total += day.milesRun
        return total
      } else {
        return null
      }
    })
  }

  get goalData (): any[] {
    let total = 0
    return this.$store.state.days.map((day: Day) => {
      if (day.milesRunGoal !== undefined && day.milesRunGoal !== null) {
        total += day.milesRunGoal
        return total
      } else {
        return null
      }
    })
  }
}
</script>

<style scoped>
</style>
