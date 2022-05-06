<template>
  <div>
    <div class="hero">
      <client-only>
        <svg-background :form-proba="5" />
      </client-only>
      <my-text tag="h1" type="big-title" class="hero-title">
        Timothée Durand <br />
        French Web Developper
      </my-text>
      <client-only>
        <svg-background :form-proba="5" />
      </client-only>
    </div>

    <my-text tag="h2" type="medium-title">selected works</my-text>
    <project-list :project-list="projectList" id="work" />
  </div>
</template>

<script>
import { worksDir } from "../config";

export default {
  scrollToTop: true,
  async asyncData({ $content }) {
    const projectList = await $content(worksDir).fetch()
    return {
      projectList,
    }
  }
}
</script>
<style lang="scss">
.hero {
  display: grid;
  grid-template-rows: 1fr min-content 1fr;
  min-height: 70vh;
  width: 100%;
}
</style>
