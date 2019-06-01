import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import {
  parse,
  getDaysInMonth,
  subMonths,
  addMonths
} from 'date-fns'
import { Day, emptyDay } from '../day'
import cloneDeep from 'lodash.clonedeep'
import api from '../api'

Vue.use(Vuex)

export interface RootState {
  token?: string,
  days: Day[],
}

const store: StoreOptions<RootState> = {
  state: {
    token: undefined,
    days: initWithEmptyDays(new Date())
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    updateDays (state, days) {
      state.days = updateDays(state.days, days)
    },
    goBackAMonth (state) {
      const date = state.days[0].date
      const res = subMonths(date, 1)
      state.days = initWithEmptyDays(res)
    },
    goForwardAMonth (state) {
      const date = state.days[0].date
      const res = addMonths(date, 1)
      state.days = initWithEmptyDays(res)
    }
  },
  actions: {
    setToken ({ commit }, token) {
      commit('setToken', token)
    },
    updateDays ({ commit }, days) {
      commit('updateDays', days)
    },
    goBackAMonth ({ commit, dispatch }) {
      commit('goBackAMonth')
      dispatch('loadDays')
    },
    goForwardAMonth ({ commit, dispatch }) {
      commit('goForwardAMonth')
      dispatch('loadDays')
    },
    loadDays: async function ({ commit, dispatch, state }) {
      try {
        const days = await api.days.index(state.days[0].date)
        dispatch('updateDays', days)
      } catch (err) {
        alert(err)
      }
    }
  }
}

export default new Vuex.Store<RootState>(store)

function initWithEmptyDays (date: Date): Day[] {
  const dayCount = getDaysInMonth(date)
  const days: Day[] = []
  for (let i = 1; i <= dayCount; i++) {
    const thisDate = parse(`${date.getFullYear()}-${date.getMonth() + 1}-${i}`)
    days.push(emptyDay(thisDate))
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
