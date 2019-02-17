<template>
  <dashboard>
    <template v-slot:inputs>
      <inputs
        :days="days"
        :columns="inputColumns"
        @update="update"
      />
      <div class="total">
        Total: {{totalCalories}} C | {{totalPounds}} lbs
      </div>
    </template>
    <template v-slot:charts>
      <charts
        :days="days"
        :actual-data="actualData"
        :goal-data="goalData"
      />
    </template>
  </dashboard>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { getDaysInMonth, parse } from 'date-fns'
import Inputs, { InputColumn } from './Inputs.vue'
import Charts from './Charts.vue'
import { Day, attemptParseInt, net } from '../lib/day'
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
  @Prop()
  days!: Day[]

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

  get actualData (): any[] {
    let total = 0
    return this.days.map(day => {
      const dayNet = net(day)
      if (dayNet) {
        total += dayNet
        return total
      } else {
        return null
      }
    })
  }

  get goalData (): any[] {
    let total = 0
    return this.days.map(day => {
      if (day.caloriesGoal !== undefined && day.caloriesGoal !== null) {
        total += day.caloriesGoal
        return total
      } else {
        return null
      }
    })
  }

  async update (updateKey: string, index: number, value: string) {
    const processedValue = attemptParseInt(value)
    const day = this.days[index];
    (day as any)[updateKey] = processedValue

    api.days.update(day.date, {
      [updateKey]: processedValue
    })
  }
}
</script>

<style scoped>
.total {
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  text-align: right;
}
</style>
