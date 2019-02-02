<template>
  <div class="inputs">
    <div
      v-for="(day, i) in days"
      class="input-row"
      :key="i"
    >
      <span class="day-label">{{i + 1}}:</span>
      {{-BMR}} -
      <input
        :value="caloriesValue(day.caloriesOut)"
        class="calories-out"
        @input="$emit('updateCaloriesOut', i, $event.target.value)"
      />
      +
      <input
        :value="caloriesValue(day.caloriesIn)"
        class="calories-in"
        @input="$emit('updateCaloriesIn', i, $event.target.value)"
      />
      =
      {{net(day)}}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Days, Day } from '../lib/Days'

@Component
export default class Inputs extends Vue {
  @Prop()
  public days!: Days;

  BMR = 2000

  caloriesValue (calories: number | null): string {
    return calories ? calories.toString() : ''
  }

  net (day: Day): number {
    return -this.BMR - day.caloriesOut + day.caloriesIn
  }
}
</script>

<style scoped>
.inputs {
  border-right: 1px solid black;
  height: 100%;
}

.calories-in,
.calories-out {
  width: 50px;
}

.day-label {
  display: inline-block;
  width: 21px;
  text-align: right;
}
</style>
