<template>
  <div class="logo">
    <DarkThemeLogo class="logo__dark" />
  </div>
</template>
<script>
import DarkThemeLogo from '~/assets/images/logo-dark.svg?inline'

export default {
  name: 'Logo',
  components: {
    DarkThemeLogo,
  },
  methods: {},
}
</script>
<style lang="scss">
</style>
