<template>
  <div ref="container" class="svg-side"></div>
</template>

<script>
import { random } from "~/js/utils/generative-utils.js";
import { SVG } from "@svgdotjs/svg.js";

export default {
  name: "svg-background",
  data() {
    return {
      forms: [this.cross, this.circle, this.cross2, this.flash, this.angle],
      baseColorName: "--color-orange-yellow",
      baseColor: { h: 0, s: 0, l: 0 },
      colors: [],
      colorNumber: 10,
      strokeWidth: 3,
      marginWidth: 20,
      padding: 10,
      minY: 0,
      maxY: this.height,
      generatedForms: [],
      svg: null,
      rowNumber: 10,
      rowHeight: 0
    };
  },
  mounted() {
    //init svg
    this.svg = SVG().addTo(this.$refs.container);
    this.svg.node.classList.add("svg-background");
    this.initForms();
    //add on resize handler
    // window.addEventListener("resize", () => this.onResize());
    this.$nuxt.$on("pageLeaved", () => {
      this.clear();
      this.initForms();
    });
  },
  methods: {
    initForms() {
      this.updateDimensions();
      // this.getBoundingValues();
      // this.setViewBox();
      this.setColorFromCss();
      this.generateColorPallet();
      this.addForms();
    },
    clear() {
      this.svg.node.innerHTML = "";
    },
    updateDimensions() {
      this.width = this.$refs.container.offsetWidth;
      this.height = this.$refs.container.offsetHeight;
      this.rowHeight = this.height / this.rowNumber;
    },
    onResize() {
      this.updateDimensions();
      this.setViewBox();
    },
    addForms() {
      for (let i = 0; i < this.rowNumber; i++) {
        //decide if there is a form
        if (random(0, 10) > 7) {
          const size = random(20, 30);
          const form = this.getRandomForm()(size, size, this.getRandomColor());
          form.move(random(0, this.width - size - this.padding, true) + this.padding, this.rowHeight * i + this.padding);
          form.rotation = random(0, 360, true);
          form.transform({
            rotate: form.rotation
          });
        }
      }
    },

    getRandomForm() {
      return random(this.forms);
    },
    tweakColor({ h, s, l }) {
      return {
        h: h + random(-2, 2),
        s: s + random(-2, 2),
        l: l + random(-2, 2)
      };
    },
    getRandomColor() {
      return this.getHslString(this.tweakColor(random(this.colors)));
    },
    generateColorPallet() {
      for (let i = 0; i < this.colorNumber; i++) {
        this.colors.push({
          h: this.baseColor.h + i * (360 / this.colorNumber),
          s: this.baseColor.s,
          l: this.baseColor.l
        });
      }
    },
    getHslString({ h, s, l }) {
      return `hsl(${h.toFixed()}, ${s.toFixed()}%, ${l.toFixed()}%)`;
    },
    setColorFromCss() {
      const baseColorValue = getComputedStyle(
        document.documentElement
      ).getPropertyValue(this.baseColorName);
      const result = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(
        baseColorValue
      );
      this.baseColor = {
        h: parseInt(result[1]),
        s: parseInt(result[2]),
        l: parseInt(result[3])
      };
    },
    cross(width, height, strokeColor) {
      //console.log("soeo", strokeColor);
      const group = this.svg.group();
      group
        .line(0, height / 2, width, height / 2)
        .stroke({
          width: this.strokeWidth,
          color: strokeColor,
          linecap: "round"
        });
      group
        .line(width / 2, 0, width / 2, height)
        .stroke({
          width: this.strokeWidth,
          color: strokeColor,
          linecap: "round"
        });
      return group;
    },
    cross2(width, height, strokeColor) {
      const group = this.svg.group();
      group
        .line(0, 0, width, height)
        .stroke({
          width: this.strokeWidth,
          color: strokeColor,
          linecap: "round"
        });
      group
        .line(width, 0, 0, height)
        .stroke({
          width: this.strokeWidth,
          color: strokeColor,
          linecap: "round"
        });
      return group;
    },
    circle(width, height, strokeColor) {
      const group = this.svg.group();
      group
        .ellipse(width, height)
        .fill("transparent")
        .stroke({
          width: this.strokeWidth,
          color: strokeColor,
          linecap: "round"
        });
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
        .stroke({
          width: this.strokeWidth,
          color: strokeColor,
          linecap: "round"
        });
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
        .stroke({ width: this.strokeWidth, color, linecap: "round" })
        .fill("transparent");
      return group;
    }
  }

};
</script>

<style lang="scss">

</style>
