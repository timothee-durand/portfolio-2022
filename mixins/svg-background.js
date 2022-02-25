import { SVG } from "@svgdotjs/svg.js";
import { random } from "@/utils/generative-utils.js";

export default {
  name: "svg-background",
  props: {
    contentSelector: {
      type: String,
      default: "#content"
    },
    headerSelector: {
      type: String,
      default: "header"
    },
    footerSelector: {
      type: String,
      default: "footer"
    }
  },
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
      generatedForms: []
    };
  },
  mounted() {
    //init svg
    this.svg = SVG().addTo("body");
    this.svg.node.classList.add("svg-background");
    this.initForms();
    //add on resize handler
    window.addEventListener("resize", () => this.onResize());
  },
  destroyed() {
    this.svg.node.remove();
  },
  computed: {},
  methods: {
    initForms() {
      this.updateDimensions();
      this.getBoundingValues();
      this.setViewBox();
      this.setColorFromCss();
      this.generateColorPallet();
      this.addForms();
    },
    clear() {
      this.$refs.svgBackground.innerHTML = "";
    },
    getBoundingValues() {
      this.contentElement = document.querySelector(this.contentSelector);
      if (!this.contentElement) {
        return;
      }
      const { width: contentWidth } =
        this.contentElement.getBoundingClientRect();
      this.marginWidth = (this.width - contentWidth) / 2;

      this.headerElement = document.querySelector(this.headerSelector);
      const { bottom: headerBottom } =
        this.headerElement.getBoundingClientRect();
      this.minY = headerBottom;

      this.footerElement = document.querySelector(this.footerSelector);
      const { height: footerHeight } =
        this.footerElement.getBoundingClientRect();
      this.maxY = this.height - footerHeight;
    },
    updateDimensions() {
      this.width = window.innerWidth;
      this.height = document.documentElement.scrollHeight;
    },
    onResize() {
      this.updateDimensions();
      this.setViewBox();
    },
    setViewBox() {
      console.log(this.svg);
      this.svg.viewbox(0, 0, this.width, this.height);
    },
    addForms() {
      const sides = [
        {
          min: this.padding,
          max: this.marginWidth - this.padding
        },
        {
          min: this.width - this.marginWidth + this.padding,
          max: this.width - this.padding
        }
      ];
      const number = random(20, 30);
      for (let i = 0; i < number; i++) {
        const side = random(sides);
        const form = this.getRandomForm();
        const { width, height } = form.node.getBoundingClientRect();

        let x = random(side.min, side.max);
        let overtakingX = x + width - side.max;
        if (overtakingX > 0)
          x = x - overtakingX - random(this.padding, this.padding * 1.2);

        let y = random(this.minY, this.maxY);
        let overtakingY = y + height - this.maxY;
        if (overtakingY > 0)
          y = y - overtakingY - random(this.padding, this.padding * 1.2);

        form.move(x, y);

        if(this.isColliding(form)) {
          form.remove()
        }

        this.generatedForms.push(form);

      }
    },
    isColliding(form) {
      let isColliding = false;

      const { x, y, x2, y2 } = form.bbox();

      this.generatedForms.forEach(generatedForm => {
        const { x: xG, y: yG, x2: x2G, y2: y2G } = generatedForm.bbox();

        if((x > xG && x < x2G) || (y > yG && y < y2G) ||
          (x2 > xG && x2 < x2G) || (y2 > yG && y2 < y2G))
        {
          //if collision
          isColliding = true
        }
      });

      return isColliding;
    },
    getRandomForm() {
      const size = random(20, 40);
      return random(this.forms)(size, size, this.getRandomColor());
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
