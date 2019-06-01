<template>
  <canvas ref="canvas" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Chart, { ChartDataSets } from 'chart.js'
import { Day, net } from '../lib/day'

export type ChartDataSet = {
  label: string
  data: any[]
  dashed?: boolean
}

@Component
export default class Charts extends Vue {
  @Prop()
  data!: ChartDataSet[]
  chart!: Chart

  @Watch('data', { deep: true })
  onDataChanged () {
    this.recalculateChart()
  }

  get context (): CanvasRenderingContext2D {
    return (this.$refs.canvas as HTMLCanvasElement).getContext('2d')!
  }

  get labels (): string[] {
    return this.$store.state.days.map((day: Day, index: number) => (index + 1).toString())
  }

  mounted () {
    this.createChart()
  }

  createChart () {
    const colors = [
      'rgb(54, 162, 235)',
      'rgb(255, 99, 132)',
      'rgb(180, 222, 222)'
    ]
    const datasets = this.data.map((dataSet, i) => {
      const color = colors[i % colors.length]
      const chartDataset: ChartDataSets = {
        label: dataSet.label,
        data: dataSet.data,
        backgroundColor: color,
        borderColor: color,
        fill: false,
        spanGaps: true
      }
      if (dataSet.dashed) {
        chartDataset.borderDash = [5]
      }
      return chartDataset
    })

    this.chart = new Chart(this.context, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: datasets
      },
      options: {
        animation: {
          duration: 0
        }
      }
    })
  }

  recalculateChart () {
    if (!this.chart) return
    this.data.forEach((dataSet, i) => {
      this.chart.data.datasets![i].data = dataSet.data
    })
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
