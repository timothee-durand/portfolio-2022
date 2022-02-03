<template>
  <header class="header d-flex justify-between">
    <nuxt-link to="/">
      <Logo></Logo>
    </nuxt-link>
    <div class="header__links">
      <nuxt-link to="#">Work</nuxt-link>
      <nuxt-link to="#">About</nuxt-link>
      <SwitchTheme/>
    </div>
  </header>
</template>
<script>
export default {
  name: "MyHeader"

};
</script>
<style lang="scss">
  .header__links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 2rem;
  }
</style>
