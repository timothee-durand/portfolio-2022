<template>
  <main>
    <div class="hero u--d-flex u--justify-center">
      <my-text tag="h1" type="big-title" class="u--align-center">
        Timothée Durand <br />
        French Web Developper
      </my-text>
    </div>
  </main>
</template>

<script>
import svgBackground from "@/mixins/svg-background.js";

export default {
  mixins : [svgBackground]
}
</script>
<style lang="scss">
.hero {
  min-height: calc(100vh - 17rem);
}
</style>
