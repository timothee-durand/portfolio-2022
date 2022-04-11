<template>
  <div ref="container">
    <ProjectList :project-list="projectList"></ProjectList>
  </div>
</template>
<script>

export default {
  data() {
    return {};
  },
  mixins: [],
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
