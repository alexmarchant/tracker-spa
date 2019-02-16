import Vue from 'vue'
import VueRouter from 'vue-router'
import Calories from '../components/Calories.vue'
import Running from '../components/Running.vue'
import Drinks from '../components/Drinks.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Calories },
  { path: '/running', component: Running },
  { path: '/drinks', component: Drinks }
]

export default new VueRouter({
  routes,
  mode: 'history'
})
