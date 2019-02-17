<template>
  <div class="dashboard">
    <div class="inputs-container">
      <slot name="inputs" />
    </div>
    <div class="charts-container">
      <slot name="charts" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Dashboard extends Vue {
}
</script>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: auto;
  grid-template-areas:
    "table chart"
  ;
  height: 100%;
}

.inputs-container {
  grid-area: table;
  border-right: 1px solid #b5b5b5;
}

.charts-container {
  grid-area: chart;
  border-right: 1px solid #b5b5b5;
}
</style>
