<template>
  <dashboard
    :inputColumns="inputColumns"
    :chart-data="chartData"
    :total="total"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { getDaysInMonth, parse } from 'date-fns'
import Inputs, { InputColumn } from './Inputs.vue'
import Charts, { ChartDataSet } from './Charts.vue'
import { Day, attemptParseInt, net, formatDecimal } from '../lib/day'
import api from '../lib/api'
import Dashboard from './Dashboard.vue'

const BMR = 2000

@Component({
  components: {
    Dashboard,
    Inputs,
    Charts
  }
})
export default class Calories extends Vue {
  get inputColumns (): InputColumn[] {
    return [
      {
        title: 'BMR',
        value: () => BMR
      }, {
        title: 'Out',
        value: (day) => day.caloriesOut,
        updateKey: 'caloriesOut'
      }, {
        title: 'In',
        value: (day) => day.caloriesIn,
        updateKey: 'caloriesIn'
      }, {
        title: 'Net',
        value: (day) => net(day)
      }, {
        title: 'Goal',
        value: (day) => day.caloriesGoal,
        updateKey: 'caloriesGoal',
        alwaysEnabled: true
      }, {
        title: 'Weight',
        value: (day) => formatDecimal(day.weight)
      }
    ]
  }

  get totalCalories (): number {
    return this.$store.state.days.reduce((sum: number, day: Day) => {
      return sum + (net(day) || 0)
    }, 0)
  }

  get totalPounds (): number {
    return Math.round(this.totalCalories * 100 / 3500) / 100
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
      }, {
        label: 'Weight',
        data: this.weightData,
        dashed: true
      }
    ]
  }

  get actualData (): any[] {
    let total = 0
    return this.$store.state.days.map((day: Day) => {
      const dayNet = net(day)
      if (dayNet !== null) {
        total += dayNet
        return total
      } else {
        return null
      }
    })
  }

  get goalData (): any[] {
    let total = 0
    return this.$store.state.days.map((day: Day) => {
      if (day.caloriesGoal !== undefined && day.caloriesGoal !== null) {
        total += day.caloriesGoal
        return total
      } else {
        return null
      }
    })
  }

  get weightData (): any[] {
    var net: number = 0
    var previousDay: Day
    return this.$store.state.days.map((day: Day) => {
      if (day.weight !== undefined && day.weight !== null) {
        if (previousDay) {
          net += (day.weight - previousDay.weight) * 3500
        }
        previousDay = day
        return net
      } else {
        return null
      }
    })
  }

  get total (): string {
    return `Total: ${this.totalCalories} C | ${this.totalPounds} lbs`
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
