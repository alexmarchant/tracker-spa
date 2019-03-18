<template>
  <div class="inputs">
    <h2 class="month">
      <span @click="goBack">&lt;&nbsp;&nbsp;</span>
      {{month}}
      <template v-if="canGoForward">
        <span @click="goForward">&nbsp;&nbsp;&gt;</span>
      </template>
    </h2>
    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th
            v-for="(column, i) in columns"
            :key="i"
          >
            {{column.title}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(day, rowI) in days"
          class="input-row"
          :class="{ future: futureDay(day) }"
          :key="rowI"
        >
          <td :style="{ width: `${dayWidth}%` }">
            {{rowI + 1}}
          </td>
          <td
            v-for="(column, colI) in columns"
            :class="{ 'input-cell': column.updateKey }"
            :key="colI"
            :style="{ width: `${columnWidth}%` }"
          >
            <template v-if="column.updateKey">
              <input
                @input="update(column.updateKey, day, $event.target.value)"
                :value="column.value(day)"
                :disabled="futureDay(day) && !column.alwaysEnabled"
              >
            </template>
            <template v-else>
              {{column.value(day)}}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Action } from 'vuex-class'
import {
  Component,
  Vue,
  Prop
} from 'vue-property-decorator'
import { Day, net, attemptParseInt } from '../lib/day'
import { format } from 'date-fns'
import api from '../lib/api'

export type InputColumn = {
  title: string
  value: (day: Day) => any
  updateKey?: string
  alwaysEnabled?: boolean
}

@Component
export default class Inputs extends Vue {
  @Prop()
  public columns!: InputColumn[]
  @Action
  updateDays!: (days: Day[]) => void
  @Action
  goBackAMonth!: () => void
  @Action
  goForwardAMonth!: () => void

  invalid (drinks: string): boolean {
    return isNaN(drinks as any)
  }

  futureDay (day: Day): boolean {
    return day.date > new Date()
  }

  goBack () {
    this.goBackAMonth()
  }

  goForward () {
    this.goForwardAMonth()
  }

  async update (updateKey: string, day: Day, value: string) {
    day = Object.assign({}, day)
    const processedValue = attemptParseInt(value);
    (day as any)[updateKey] = processedValue
    this.updateDays([day])

    try {
      await api.days.update(day.date, {
        [updateKey]: processedValue
      })
    } catch (err) {
      alert(err)
    }
  }

  get month (): string {
    return format(this.$store.state.days[0].date, 'MMM YY')
  }

  get dayWidth (): number {
    return 10
  }

  get columnWidth (): number {
    return (100 - this.dayWidth) / this.columns.length
  }

  get days (): Day[] {
    return this.$store.state.days
  }

  get canGoForward (): boolean {
    const now = new Date()
    const selectedDate = this.$store.state.days[0].date
    return !(selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth())
  }
}
</script>

<style scoped>
.month {
  text-align: center;
  font-size: 16px;
  margin: 0;
  padding: 10px 0;
}

.month span {
  cursor: pointer;
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

td.input-cell {
  padding: 0;
}

tr.future {
  background-color: rgba(228, 228, 228, .5);
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
</style>
