<template>
  <svg ref="blob" :style="{ width: `${width}rem`, height: `${height}rem` }" />
</template>
<script lang="js">
import {SVG} from "@svgdotjs/svg.js";
import { random } from "@/utils/generative-utils.js";
import { spline } from "@/utils/generative-utils.js";

export default  {
  name: "Blob",
  props: {
    width: {
      type: Number,
      default: 20
    },
    height: {
      type: Number,
      default: 20
    },


  },
  data() {
    return {
      x: this.width / 2,
      y: this.height / 2,
      size: 0,
      svg: {}
    };
  },
  mounted() {
    //init svg
    this.svg = SVG(this.$el).viewbox(0, 0, this.width, this.height);

    this.$el.addEventListener("mouseenter", (e) => {
      this.$el.innerHTML = "";
      this.drawBlob();
    });

    this.drawBlob();
  },
  methods : {
    drawBlob() {
      this.size = random(this.width / 2 * 0.5, this.width / 2 * 0.8)
      // choose a random number of points
      const numPoints = random(5, 12);
      // step used to place each point at equal distances
      const angleStep = (Math.PI * 2) / numPoints;

      // keep track of our points
      const points = [];

      for (let i = 1; i <= numPoints; i++) {
        // how much randomness should be added to each point
        const pull = random(0.75, 1, true);

        // x & y coordinates of the current point
        const x = this.x + Math.cos(i * angleStep) * (this.size * pull);
        const y = this.y + Math.sin(i * angleStep) * (this.size * pull);

        // push the point to the points array
        points.push({ x, y });
      }

      // generate a smooth continuous curve based on the points, using bezier curves. spline() will return an svg path-data string. The arguments are (points, tension, close). Play with tension and check out the effect!
      const pathData = spline(points, 1, true);

      // render the body in the form of an svg <path /> element!
      this.svg
        .path(pathData)
        .fill("var(--color-orange-yellow)");
    }
  }
}
</script>

<style lang="scss" scoped></style>
