<template>
  <div ref="root">
    <client-only><svg-background content-selector="#content"/></client-only>
    <div id="app">
      <my-header />
      <Nuxt id="content" />
      <my-footer />
    </div>
  </div>
</template>
<style>

</style>
<script>
export default {
  mounted() {
    const userPrefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches

    let userPref = 'light'
    if (userPrefersDark) {
      userPref = 'dark'
    }

    document.body.classList.add(userPref)
  },
}
</script>
