<template>
  <main ref="container">
    <ProjectHeader/>
  </main>
</template>
<script>
import svgBackground from "@/mixins/svg-background.js";

export default {
  data() {
    return {};
  },
  mixins: [svgBackground],
  methods: {}
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
