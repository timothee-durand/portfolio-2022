<template>
  <svg ref="svgBackground" class="svg-background"/>
</template>

<script>
import { SVG } from "@svgdotjs/svg.js";
import { random } from "@/utils/generative-utils.js";


export default {
  name: "svg-background",
  data() {
    return {
      forms: [
        this.cross,
        this.circle,
        this.cross2,
        this.flash,
        this.angle
      ]
    };
  },
  mounted() {
    //init svg
    this.svg = SVG(this.$refs.svgBackground)

    this.setViewBox()
    console.log(this.forms[0]);

    this.addForms()
    //add on resize handler
    window.addEventListener("resize",()=> this.onResize() )
  },
  methods: {
    onResize() {
      this.setViewBox()
    },
    setViewBox() {
      this.svg.viewbox(0, 0, window.innerWidth, document.documentElement.scrollHeight)
    },
    addForms() {
      for (let i = 0; i < random(10, 20); i++) {
        this.getRandomForm().move(random(0, window.innerWidth), random(0, document.documentElement.scrollHeight))
      }
    },
    getRandomForm() {
      const size = random(20,60)
      return random(this.forms)(size, size, "var(--color-orange-yellow)");
    },


    cross(width, height, strokeColor) {
      //console.log("soeo", strokeColor);
      const group = this.svg.group();
      group
        .line(0, height / 2, width, height / 2)
        .stroke({ width: 1, color: strokeColor });
      group
        .line(width / 2, 0, width / 2, height)
        .stroke({ width: 1, color: strokeColor });
      return group;
    },
    cross2(width, height, strokeColor) {
      const group = this.svg.group();
      group.line(0, 0, width, height).stroke({ width: 1, color: strokeColor });
      group.line(width, 0, 0, height);
      return group;
    },
    circle(width, height, strokeColor) {
      const group = this.svg.group();
      group
        .ellipse(width, height)
        .fill("transparent")
        .stroke({ width: 1, color: strokeColor });
      return group;
    },
    flash(width, height, strokeColor) {
      width = height / 2;
      const group = this.svg.group();
      group
        .polyline([
          [width * 0.45, 0],
          [0, height / 2],
          [width, height / 2],
          [width * 0.55, height]
        ])
        .fill("transparent")
        .stroke({ width: 1, color: strokeColor });
      return group;
    },
    angle(width, height, color) {
      const group = this.svg.group();
      group
        .polyline([
          [width, 0],
          [0, 0],
          [0, height]
        ])
        .stroke({ width: 1, color })
        .fill("transparent");
      return group;
    }

  }
};
</script>

<style>
.svg-background {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
