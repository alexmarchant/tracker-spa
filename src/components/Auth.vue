<template>
  <div class="auth">
    <form @submit="submit">
      <label for="email">Email:</label>
      <input id="email" type="text" v-model="email" />
      <label for="password">Password:</label>
      <input id="password" type="password" v-model="password" />
      <button type="submit">Log In</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../lib/api'
import { saveToken } from '../lib/auth'
import { Action } from 'vuex-class'

@Component
export default class App extends Vue {
  @Action
  setToken!: (token: string) => void
  @Action
  loadDays!: () => void

  email = ''
  password = ''

  async submit (event: Event) {
    event.preventDefault()

    try {
      const token = await api.sessions.create(this.email, this.password)
      saveToken(token)
      this.setToken(token)
      this.loadDays()
    } catch (e) {
      alert(e)
    }
  }
}
</script>

<style scoped>
.auth {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

form {
  display: flex;
  flex-direction: column;
}
</style>
