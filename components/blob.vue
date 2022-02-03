<template>
  <svg ref="blob" :style="{width : `${width}rem`, height: `${height}rem` }"></svg>
</template>
<script>
  import { SVG } from "@svgdotjs/svg.js";

  export default {
    name : "Blob",
    props: {
      width: {
        type: Number,
        default: 10
      },
      height : {
        type: Number,
        default: 10
      },
    },
    data() {
      return {
        x: 0,
        y : 0
      };
    },
    mounted() {
      this.x = this.width / 2;
      this.y = this.height / 2;

      this.svg = SVG(this.$el).viewbox(0, 0, this.width, this.height)
    }
  }
</script>
<style lang="scss" scoped>

</style>
