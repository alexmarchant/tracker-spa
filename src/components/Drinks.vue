<template>
  <dashboard>
    <template v-slot:inputs>
      <inputs
        :days="days"
        :columns="inputColumns"
        @update="update"
      />
    </template>
    <template v-slot:charts>
      <charts
        :days="days"
        :actualData="actualData"
        :goalData="goalData"
      />
    </template>
  </dashboard>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { getDaysInMonth, parse } from 'date-fns'
import Inputs, { InputColumn } from './Inputs.vue'
import Charts from './Charts.vue'
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
  @Prop()
  days!: Day[]

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

  get goalData (): any[] {
    let total = 0
    return this.days.map(day => {
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
    const day = this.days[index];
    (day as any)[updateKey] = processedValue

    api.days.update(day.date, {
      [updateKey]: processedValue
    })
  }
}
</script>

<style scoped>
</style>
