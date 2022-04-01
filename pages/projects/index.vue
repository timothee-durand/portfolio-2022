<template>
  <main ref="container">
    <ProjectList :project-list="projectList"></ProjectList>
  </main>
</template>
<script>
import svgBackground from "@/mixins/svg-background.js";

export default {
  data() {
    return {};
  },
  mixins: [svgBackground],
  methods: {},
  async asyncData({ $content }) {
    const projectList = await $content("projects").fetch();
    return {
      projectList
    };
  }
};
</script>
<style scoped>
/*main {*/
/*  display: grid;*/
/*  padding: 3rem;*/
/*}*/

/*main > * {*/
/*  margin-top: 30rem;*/
/*}*/

/*main > *:nth-child(2n - 1) {*/
/*  justify-self: right;*/
/*  text-align: right;*/
/*  margin-top: 10rem;*/
/*}*/
</style>
