<template>
  <header class="header u--d-flex u--justify-between">
    <nuxt-link to="/"><Logo /></nuxt-link>
    <div class="header__links">
      <header-link to="/works">Works</header-link>
      <header-link to="/about">About</header-link>
      <external-link is-social href="mailto:contact@timotheedurand.fr" no-target
        >Get in touch</external-link
      >
    </div>
  </header>
</template>
<script>
export default {
  name: 'MyHeader',
}
</script>
<style lang="scss">
.header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  transition: opacity ease-out 200ms;
  padding: 1rem 2rem;
}
.header__links {
  display: flex;
  gap: 2rem;
  align-items: center;

  a {
    text-transform: none;
    font-weight: 400;
  }
}

.is-content-transition {
  header {
    opacity: 0;
  }
}
</style>
