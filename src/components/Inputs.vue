<template>
  <div class="inputs">
    <table>
      <thead>
        <tr>
          <th class="day">Day</th>
          <th class="bmr">BMR</th>
          <th class="c-out">Out</th>
          <th class="c-in">In</th>
          <th class="net">Net</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(day, i) in days"
          class="input-row"
          :key="i"
        >
          <td class="day">{{i + 1}}</td>
          <td class="bmr">{{day.bmr}}</td>
          <td
            class="c-out"
            :class="{ error: invalid(day.caloriesOut) }"
          >
            <input
              @input="$emit('updateCaloriesOut', i, $event.target.value)"
              :value="day.caloriesOut"
            >
          </td>
          <td
            class="c-in"
            :class="{ error: invalid(day.caloriesIn) }"
          >
            <input
              @input="$emit('updateCaloriesIn', i, $event.target.value)"
              :value="day.caloriesIn"
            >
          </td>
          <td class="net">{{net(day)}}</td>
        </tr>
      </tbody>
    </table>
    <div class="total">
      Total: {{totalCalories}} C | {{totalPounds}} lbs
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Days, Day, net } from '../lib/day'

@Component
export default class Inputs extends Vue {
  @Prop()
  public days!: Days

  caloriesValue (calories: number | null): string {
    return calories ? calories.toString() : ''
  }

  net (day: Day): number | null {
    return net(day)
  }

  invalid (calories: string): boolean {
    return isNaN(calories as any)
  }

  get totalCalories (): number {
    return this.days.reduce((sum, day) => {
      return sum + (net(day) || 0)
    }, 0)
  }

  get totalPounds (): number {
    return Math.round(this.totalCalories * 100 / 3500) / 100
  }
}
</script>

<style scoped>
.inputs {
  border-right: 1px solid black;
  height: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: solid #e0e0dc;
  border-width: 0 1px 1px 0;
}

th {
  background-color: rgba(212, 221, 228, .5);
  text-align: center;
}

td {
  text-align: right;
}

td.error {
  background-color: rgb(255, 175, 175);
}

th, td, input {
  padding: 3px 5px;
  font-size: 14px;
}

.day {
  width: 10%;
}

.bmr, .c-in, .c-out, .net {
  width: 22.5%;
}

.c-in,
.c-out {
  padding: 0;
}

input {
  border: 0;
  width: 100%;
  background: transparent;
  text-align: right;
}

input:focus {
  outline: none;
}

.total {
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  text-align: right;
}
</style>
