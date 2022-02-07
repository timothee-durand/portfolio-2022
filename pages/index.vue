<template>
  <main>
    <div class="hero u--d-flex u--justify-center">
      <my-text tag="h1" type="big" class="u--align-center">
        Timothée Durand <br/>
        French Web Developper
      </my-text>
    </div>
  </main>
</template>

<script>
export default {
  // async asyncData({ $content }) {
  //   const projects = await $content('projects').fetch()
  //   return {
  //     projects,
  //   }
  // },
}
</script>
<style lang="scss">
.hero {
  min-height: calc(100vh - 17rem);
}
</style>
