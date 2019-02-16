import Vue from 'vue'
import VueRouter from 'vue-router'
import Calories from '../components/Calories.vue'
import Running from '../components/Running.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Calories },
  { path: '/running', component: Running }
]

export default new VueRouter({
  routes,
  mode: 'history'
})
