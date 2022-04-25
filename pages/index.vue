<template>
  <div>
    <div class="hero">
      <svg-background :form-proba="8" />
      <my-text tag="h1" type="big-title" class="hero-title">
        Timothée Durand <br />
        French Web Developper
      </my-text>
      <svg-background :form-proba="8" />
    </div>

    <my-text tag="h2" type="medium-title">selected works</my-text>
    <project-list :project-list="projectList" id="work"/>
  </div>


</template>

<script>
export default {
  async asyncData({ $content }) {
    const projectList = await $content("projects").fetch();
    return {
      projectList
    };
  }
};
</script>
<style lang="scss">
.hero {
  display: grid;
  grid-template-rows: 1fr min-content 1fr;
  min-height: 70vh;
  width: 100%;
  &-title {

  }
}
</style>
