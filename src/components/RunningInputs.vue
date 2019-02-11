<template>
  <div class="inputs">
    <h2 class="month">{{month}}</h2>
    <table>
      <thead>
        <tr>
          <th class="day">Day</th>
          <th class="miles-run">Miles Run</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(day, i) in days"
          class="input-row"
          :class="{ future: futureDay(day) }"
          :key="i"
        >
          <td class="day">{{i + 1}}</td>
          <td
            class="miles-run"
            :class="{ error: invalid(day.milesRun) }"
          >
            <input
              @input="$emit('updateMilesRun', i, $event.target.value)"
              :value="day.milesRun"
              :disabled="futureDay(day)"
            >
          </td>
        </tr>
      </tbody>
    </table>
    <div class="total">
      Total: {{totalMilesRun}} mi
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Days, Day, net } from '../lib/day'
import { format } from 'date-fns'

@Component
export default class RunningInputs extends Vue {
  @Prop()
  public days!: Days

  invalid (miles: string): boolean {
    return isNaN(miles as any)
  }

  futureDay (day: Day): boolean {
    return day.date > new Date()
  }

  get totalMilesRun (): number {
    return this.days.reduce((sum, day) => {
      return sum + (day.milesRun || 0)
    }, 0)
  }

  get month (): string {
    return format(new Date(), 'MMM YY')
  }
}
</script>

<style scoped>
.inputs {
  border-right: 1px solid #b5b5b5;
  height: 100%;
}

.month {
  text-align: center;
  font-size: 16px;
  margin: 0;
  padding: 10px 0;
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

tr.future {
  background-color: rgba(228, 228, 228, .5);
}

.day {
  width: 10%;
}

.miles-run {
  width: 22.5%;
}

.miles-run {
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
