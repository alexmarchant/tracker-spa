<template>
  <div class="app" v-if="loggedIn">
    <div class="sidebar-container">
      <sidebar />
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
  <Auth v-else />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Sidebar from './Sidebar.vue'
import Auth from './Auth.vue'
import { getToken } from '../lib/auth'
import { getDaysInMonth, parse } from 'date-fns'

@Component({
  components: {
    Sidebar,
    Auth
  }
})
export default class App extends Vue {
  mounted () {
    this.checkAuth()
  }

  checkAuth () {
    const token = getToken()

    if (token) {
      this.$store.commit('setToken', token)
      return true
    }

    return false
  }

  get loggedIn (): boolean {
    return !!this.$store.state.token
  }
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
