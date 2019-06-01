<template>
  <dashboard
    :inputColumns="inputColumns"
    :chart-data="chartData"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Inputs, { InputColumn } from './Inputs.vue'
import Charts, { ChartDataSet } from './Charts.vue'
import { Day, attemptParseInt } from '../lib/day'
import api from '../lib/api'
import Dashboard from './Dashboard.vue'

@Component({
  components: {
    Dashboard,
    Inputs,
    Charts
  }
})
export default class Drinks extends Vue {
  get inputColumns (): InputColumn[] {
    return [
      {
        title: 'Drinks',
        value: (day) => day.drinks,
        updateKey: 'drinks'
      }, {
        title: 'Goal',
        value: (day) => day.drinksGoal,
        updateKey: 'drinksGoal',
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
      if (day.drinks !== undefined && day.drinks !== null) {
        total += day.drinks
        return total
      } else {
        return null
      }
    })
  }

  get goalData (): any[] {
    let total = 0
    return this.$store.state.days.map((day: Day) => {
      if (day.drinksGoal !== undefined && day.drinksGoal !== null) {
        total += day.drinksGoal
        return total
      } else {
        return null
      }
    })
  }

  async update (updateKey: string, index: number, value: string) {
    const processedValue = attemptParseInt(value)
    const day = this.$store.state.days[index];
    (day as any)[updateKey] = processedValue

    api.days.update(day.date, {
      [updateKey]: processedValue
    })
  }
}
</script>

<style scoped>
</style>
