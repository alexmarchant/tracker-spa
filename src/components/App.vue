<template>
  <div class="app">
    <div class="sidebar-container">
      <sidebar />
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Sidebar from './Sidebar.vue'

@Component({
  components: {
    Sidebar
  }
})
export default class App extends Vue {
}
</script>

<style>
html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

body {
  margin: 0;
  font-family: Arial,x-locale-body,sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>

<style scoped>
.app {
  display: grid;
  grid-template-columns: 50px auto;
  grid-template-rows: auto;
  grid-template-areas:
    "sidebar content"
  ;
  height: 100vh;
}

.sidebar-container {
  grid-area: sidebar;
}
</style>
