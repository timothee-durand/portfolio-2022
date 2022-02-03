<template>
  <div class="logo">
    <DarkThemeLogo class="logo__dark" />
    <LightThemeLogo class="logo__light" />
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
}
</script>
<style lang="scss">
body.light .logo__dark,
body.dark .logo__light {
  display: none;
}
</style>
