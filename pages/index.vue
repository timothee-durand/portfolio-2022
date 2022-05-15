<template>
  <div>
    <div class="hero">
      <client-only>
        <svg-background :form-proba="5" />
      </client-only>
      <animated-text
        tag="h1"
        type="big-title"
        class="hero-title"
        text="Timothée Durand <br/> French Web Developer"/>
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
  grid-template-rows: 20vh min-content 20vh;
  min-height: 70vh;
  width: 100%;
}

.hero-title {
  grid-row: 2/3 ;
  line-height: 1.2;
}
</style>
