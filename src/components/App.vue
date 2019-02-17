<template>
  <div class="app" v-if="loggedIn">
    <div class="sidebar-container">
      <sidebar />
    </div>
    <div class="content">
      <router-view :days="days" />
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
import { Day, emptyDay } from '../lib/day'
import api from '../lib/api'

const BMR = 2000

@Component({
  components: {
    Sidebar,
    Auth
  }
})
export default class App extends Vue {
  days: Day[]
  loading = true

  constructor () {
    super()
    const dayCount = getDaysInMonth(new Date())
    this.days = []
    for (let i = 1; i <= dayCount; i++) {
      const today = new Date()
      const date = parse(`${today.getFullYear()}-${today.getMonth() + 1}-${i}`)
      this.days.push(emptyDay(date, BMR))
    }
  }

  async mounted () {
    if (!this.checkAuth()) return

    let days
    try {
      days = await api.days.index(new Date())
    } catch (err) {
      console.error(err)
      return
    }

    days.forEach(resDay => {
      const resDate = parse(resDay.date)
      this.days.forEach(day => {
        if (
          day.date.getFullYear() === resDate.getFullYear() &&
          day.date.getMonth() === resDate.getMonth() &&
          day.date.getDate() === resDate.getDate()
        ) {
          Object.keys(resDay).forEach(key => {
            if (key === 'date') return

            (day as any)[key] = (resDay as any)[key]
          })
        }
      })
    })

    this.loading = false
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
