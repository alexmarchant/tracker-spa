<template>
  <inputs
    :columns="inputColumns"
    @update="update"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { getDaysInMonth, parse } from 'date-fns'
import Inputs, { InputColumn } from './Inputs.vue'
import { Day, attemptParseInt, net, formatDecimal } from '../lib/day'
import api from '../lib/api'

const BMR = 2000

@Component({
  components: {
    Inputs
  }
})
export default class Calories extends Vue {
  get inputColumns (): InputColumn[] {
    return [
      {
        title: 'BMR',
        value: () => BMR
      }, {
        title: 'C. Out',
        value: (day) => day.caloriesOut,
        updateKey: 'caloriesOut'
      }, {
        title: 'C. In',
        value: (day) => day.caloriesIn,
        updateKey: 'caloriesIn'
      }, {
        title: 'C. Net',
        value: (day) => net(day)
      }, {
        title: 'C. Goal',
        value: (day) => day.caloriesGoal,
        updateKey: 'caloriesGoal',
        alwaysEnabled: true
      }, {
        title: 'Miles Run',
        value: (day) => day.milesRun,
        updateKey: 'milesRun'
      }, {
        title: 'M.R. Goal',
        value: (day) => day.milesRunGoal,
        updateKey: 'milesRunGoal',
        alwaysEnabled: true
      }, {
        title: 'Drinks',
        value: (day) => day.drinks,
        updateKey: 'drinks'
      }, {
        title: 'D. Goal',
        value: (day) => day.drinksGoal,
        updateKey: 'drinksGoal',
        alwaysEnabled: true
      }, {
        title: 'Mood',
        value: (day) => day.mood,
        updateKey: 'mood'
      }, {
        title: 'Energy',
        value: (day) => day.energy,
        updateKey: 'energy'
      }, {
        title: 'Weight',
        value: (day) => formatDecimal(day.weight)
      }
    ]
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
