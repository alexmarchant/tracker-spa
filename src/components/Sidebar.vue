<template>
  <div class="sidebar">
    <router-link to="/">C</router-link>
    <router-link to="running">R</router-link>
    <router-link to="drinks">D</router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Sidebar extends Vue {
}
</script>

<style scoped>
.sidebar {
  background-color: #001950;
  height: 100%;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

a {
  display: block;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  height: 30px;
  width: 30px;
  color: #001950;
  font-size: 20px;
  line-height: 30px;
  text-decoration: none;
  font-weight: bold;
  margin-bottom: 10px;
}

a:hover,
a.router-link-exact-active {
  background-color: rgba(255, 255, 255, 1);
}
</style>
