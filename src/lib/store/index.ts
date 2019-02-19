import Vue from 'vue'
import Vuex from 'vuex'
import { parse, getDaysInMonth } from 'date-fns'
import { Day, emptyDay } from '../day'
import cloneDeep from 'lodash.clonedeep'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    days: initWithEmptyDays()
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    updateDays (state, days) {
      state.days = updateDays(state.days, days)
    }
  }
})

function initWithEmptyDays (): Day[] {
  const dayCount = getDaysInMonth(new Date())
  const days: Day[] = []
  for (let i = 1; i <= dayCount; i++) {
    const today = new Date()
    const date = parse(`${today.getFullYear()}-${today.getMonth() + 1}-${i}`)
    days.push(emptyDay(date))
  }
  return days
}

function updateDays (oldDays: Day[], newDays: Day[]): Day[] {
  oldDays = cloneDeep(oldDays)

  newDays.forEach(newDay => {
    const newDate = parse(newDay.date)
    oldDays.forEach(oldDay => {
      if (
        oldDay.date.getFullYear() === newDate.getFullYear() &&
        oldDay.date.getMonth() === newDate.getMonth() &&
        oldDay.date.getDate() === newDate.getDate()
      ) {
        Object.keys(newDay).forEach(key => {
          if (key === 'date') return
          if (key === 'bmr') return

          (oldDay as any)[key] = (newDay as any)[key]
        })
      }
    })
  })

  return oldDays
}
