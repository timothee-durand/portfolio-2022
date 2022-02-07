<template>
  <main ref="container"><slot></slot></main>
</template>

<script>
import { ThreeBackground } from "./ThreeBackground/ThreeBackground.js"
export default {
  name: "ThreeBackground",
  mounted() {
    this.scene = new ThreeBackground({
      container : document.body,
      elements : this.$refs.container.children
    })
  }
};
</script>

<style scoped>
main {
  min-height: 300vh;
  position: relative;
  display: grid;
  padding: 2rem;
}

main > p {
  width: 30%;
}

main > p:nth-child(2n - 1) {
  justify-self: end;
  text-align: right;
  margin-top: 10rem;
}

</style>
