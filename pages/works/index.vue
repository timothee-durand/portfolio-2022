<template>
  <div ref="container">
    <ProjectList :project-list="projectList"></ProjectList>
  </div>
</template>
<script>
import { worksDir } from "../../config";

export default {
  data() {
    return {}
  },
  scrollToTop: true,
  mixins: [],
  methods: {},
  async asyncData({ $content }) {
    const projectList = await $content(worksDir).fetch()
    return {
      projectList,
    }
  },
}
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
