<template>
  <canvas ref="canvas" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Chart from 'chart.js'
import { Days } from '../lib/Days'

@Component
export default class MyChart extends Vue {
  @Prop()
  public days!: Days

  @Prop()
  public BMR!: number

  @Watch('days', { deep: true })
  onDaysChanged (val: Days, oldVal: Days) {
    this.recalculateChart()
  }

  chart!: Chart

  get context (): CanvasRenderingContext2D {
    return (this.$refs.canvas as HTMLCanvasElement).getContext('2d')!
  }

  get labels (): string[] {
    return this.days.map((day, index) => index + 1)
  }

  get goalData (): number[] {
    return this.days.map((day, i) => {
      return i * -500
    })
  }

  get actualData (): number[] {
    return this.days.reduce((acc, day) => {
      const lastValue = acc[acc.length - 1] || 0
      const net = this.BMR + day.caloriesOut - day.caloriesIn
      acc.push(lastValue - net)
      return acc
    }, [] as number[])
  }

  mounted () {
    this.createChart()
  }

  createChart () {
    this.chart = new Chart(this.context, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'goal',
            data: this.goalData,
            borderDash: [5],
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            fill: false
          }, {
            label: 'actual',
            data: this.actualData,
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            fill: false
          }
        ]
      }
    })
  }

  recalculateChart () {
    this.chart.data.datasets![1].data = this.actualData
    this.chart.update()
  }
}
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
