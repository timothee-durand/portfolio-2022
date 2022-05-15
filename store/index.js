import Styles from '~/assets/style/tokens/colors.scss'

export const LIGHT_MODE = 'light'
export const DARK_MODE = 'dark'

export const state = () => ({
  transitionComponent: null,
  styles: { ...Styles },
})

export const mutations = {
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
