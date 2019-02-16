<template>
  <canvas ref="canvas" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Chart from 'chart.js'
import { Day, net } from '../lib/day'

@Component
export default class Charts extends Vue {
  @Prop()
  days!: Day[]
  @Prop()
  actualData!: any[]
  @Prop()
  goalData!: any[]
  chart!: Chart

  @Watch('actualData', { deep: true })
  @Watch('goalData', { deep: true })
  onDataChanged (val: Day[], oldVal: Day[]) {
    this.recalculateChart()
  }

  get context (): CanvasRenderingContext2D {
    return (this.$refs.canvas as HTMLCanvasElement).getContext('2d')!
  }

  get labels (): string[] {
    return this.days.map((day, index) => (index + 1).toString())
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
            label: 'actual',
            data: this.actualData,
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            fill: false,
            spanGaps: true
          }, {
            label: 'goal',
            data: this.goalData,
            borderDash: [5],
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            fill: false,
            spanGaps: true
          }
        ]
      }
    })
  }

  recalculateChart () {
    this.chart.data.datasets![0].data = this.actualData
    this.chart.data.datasets![1].data = this.goalData
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
