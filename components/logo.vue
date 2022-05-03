<template>
  <div class="logo">
    <DarkThemeLogo class="logo__dark" />
  </div>
</template>
<script>
import DarkThemeLogo from '~/assets/images/logo-dark.svg?inline'
import LightThemeLogo from '~/assets/images/logo-light.svg?inline'

export default {
  name: 'Logo',
  components: {
    DarkThemeLogo,
    LightThemeLogo,
  },
  methods: {},
}
</script>
<style lang="scss">
body[data-theme='light'] .logo__dark,
body[data-theme='dark'] .logo__light {
  display: none;
}
</style>
