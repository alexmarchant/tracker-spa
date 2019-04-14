<template>
  <div class="dashboard">
    <div class="inputs-container">
      <inputs :columns="inputColumns" />
      <div v-if="total" class="total">
        {{total}}
      </div>
    </div>
    <div class="charts-container">
      <charts
        :actual-data="actualChartData"
        :goal-data="goalChartData"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { parse, getDaysInMonth } from 'date-fns'
import Inputs, { InputColumn } from './Inputs.vue'
import Charts from './Charts.vue'
import api from '../lib/api'
import { Day, attemptParseInt, emptyDay } from '../lib/day'

const BMR = 2000

@Component({
  components: {
    Inputs,
    Charts
  }
})
export default class Dashboard extends Vue {
  @Prop()
  inputColumns!: InputColumn[]
  @Prop()
  actualChartData!: any[]
  @Prop()
  goalChartData!: any[]
  @Prop()
  total?: string
}
</script>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-template-areas:
    "chart"
    "table"
  ;
  height: 100%;
}

@media (min-width: 700px) {
  .dashboard {
    grid-template-columns: 30% 70%;
    grid-template-rows: auto;
    grid-template-areas:
      "table chart"
    ;
  }
}

.inputs-container {
  grid-area: table;
  border-right: 1px solid #b5b5b5;
}

.charts-container {
  grid-area: chart;
  border-right: 1px solid #b5b5b5;
}

.total {
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  text-align: right;
}
</style>
