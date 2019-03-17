<template>
  <div class="sidebar">
    <router-link to="/">
      <PersonIcon />
    </router-link>
    <router-link to="/calories">
      <CaloriesIcon />
    </router-link>
    <router-link to="running">
      <RunningIcon />
    </router-link>
    <router-link to="drinks">
      <DrinksIcon />
    </router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PersonIcon from '../images/round-accessibility-24px.svg'
import CaloriesIcon from '../images/burn-button.svg'
import RunningIcon from '../images/runer-silhouette-running-fast.svg'
import DrinksIcon from '../images/drink-beer-jar.svg'

@Component({
  components: {
    PersonIcon,
    CaloriesIcon,
    RunningIcon,
    DrinksIcon
  }
})
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 30px;
  color: #001950;
  font-size: 20px;
  line-height: 30px;
  text-decoration: none;
  font-weight: bold;
  margin-bottom: 10px;
}

a svg path {
  fill: rgba(255, 255, 255, 0.6);
}

a:hover svg path,
a.router-link-exact-active svg path {
  fill: rgba(255, 255, 255, 1);
}

a:hover svg path.no-fill,
a svg path.no-fill {
  fill: none;
}
</style>
