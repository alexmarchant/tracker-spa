<template>
  <div class="inputs">
    <h2 class="month">{{month}}</h2>
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
                @input="$emit('update', column.updateKey, rowI, $event.target.value)"
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
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Day, net } from '../lib/day'
import { format } from 'date-fns'

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

  invalid (drinks: string): boolean {
    return isNaN(drinks as any)
  }

  futureDay (day: Day): boolean {
    return day.date > new Date()
  }

  get month (): string {
    return format(new Date(), 'MMM YY')
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
}
</script>

<style scoped>
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
