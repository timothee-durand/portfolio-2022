export const LIGHT_MODE = 'light'
export const DARK_MODE = 'dark'

export const state = () => ({
  themeMode: LIGHT_MODE,
  transitionComponent: null,
})

export const getters = () => ({
  themeMode(state) {
    return state.themeMode
  },
})

export const mutations = {
  setLightMode(state) {
    state.themeMode = LIGHT_MODE
  },
  setDarkMode(state) {
    state.themeMode = DARK_MODE
  },
  toggleMode(state) {
    if (state.themeMode === DARK_MODE) {
      state.themeMode = LIGHT_MODE
      return
    }
    state.themeMode = DARK_MODE
  },
  setTransitionComponent(state, component) {
    state.transitionComponent = component
  },
  resetTransitionComponent(state) {
    if (!state.transitionComponent) return
    state.transitionComponent.isTransitionLink = false
    state.transitionComponent = null
  },
}

const syncBodyDataThemePlugin = (store) => {
  store.subscribe((mutation, state) => {
    updateBodyDataTheme(state.themeMode)
  })
}

const updateBodyDataTheme = (themeValue) => {
  document.body.dataset.theme = themeValue
}

export const plugins = [syncBodyDataThemePlugin]
