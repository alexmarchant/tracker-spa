<template>
  <div class="sidebar">
    <div class="link">
      <router-link to="/">C</router-link>
    </div>
    <div class="link">
      <router-link to="running">R</router-link>
    </div>
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

.link {
  text-align: center;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.link:hover,
.link.active {
  background-color: rgba(255, 255, 255, 1);
}

a {
  color: #001950;
  font-size: 20px;
  text-decoration: none;
  font-weight: bold;
}
</style>
