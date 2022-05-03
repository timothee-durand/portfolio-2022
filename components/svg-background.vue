<template>
  <div ref="container" class="svg-side"></div>
</template>

<script>
import { random } from '~/js/utils/generative-utils.js'
import { SVG } from '@svgdotjs/svg.js'
import anime from 'animejs'

export default {
  name: 'svg-background',
  props: {
    formProba: {
      type: Number,
      default: 7,
    },
    parallaxSpeed: { type: Number, default: 50 },
  },
  data() {
    return {
      forms: [this.cross, this.circle, this.cross2, this.flash, this.angle],
      baseColorName: '--color-orange-yellow',
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
      rowHeight: 0,
      pointer: { x: 0, y: 0 },
    }
  },
  mounted() {
    //init svg
    this.svg = SVG().addTo(this.$refs.container)
    this.svg.node.classList.add('svg-background')
    this.initForms()
    //add on resize handler
    // window.addEventListener("resize", () => this.onResize());
    this.$nuxt.$on('pageLeaved', () => {
      this.clear()
      this.initForms()
    })

    window.addEventListener('mousemove', (e) => this.onMouseMove(e))
  },
  methods: {
    initForms() {
      this.updateDimensions()
      // this.getBoundingValues();
      // this.setViewBox();
      this.setColorFromCss()
      this.generateColorPallet()
      this.addForms()
    },
    clear() {
      this.svg.node.innerHTML = ''
    },
    onMouseMove({ clientX, clientY }) {
      this.pointer.x = -(clientX / window.innerWidth) * 2 - 1
      this.pointer.y = -(clientY / window.innerHeight) * 2 + 1

      this.generatedForms.forEach((f) => {
        // f.animate({
        //   duration : 300,
        //   when : 'now',
        // }).transform({
        //   translateX : this.pointer.x * this.parallaxSpeed * f.depth,
        //   translateY : this.pointer.y * this.parallaxSpeed * f.depth,
        //   rotate : f.rotation
        // })
        anime({
          targets: f.node,
          translateX: this.pointer.x * this.parallaxSpeed * f.depth,
          translateY: this.pointer.y * this.parallaxSpeed * f.depth,
          easing: 'easeOutExpo',
          duration: 500,
        })
      })
    },
    updateDimensions() {
      this.width = this.$refs.container.offsetWidth
      this.height = this.$refs.container.offsetHeight
      this.rowHeight = this.height / this.rowNumber
    },
    onResize() {
      this.updateDimensions()
      this.setViewBox()
    },
    addForms() {
      for (let i = 0; i < this.rowNumber; i++) {
        //decide if there is a form
        if (random(0, 10) > this.formProba) {
          const size = random(20, 30)
          const form = this.getRandomForm()(size, size, this.getRandomColor())
          form.move(
            random(0, this.width - size - this.padding, true) + this.padding,
            this.rowHeight * i + this.padding
          )
          form.rotation = random(0, 360, true)
          form.transform({
            rotate: form.rotation,
          })
          form.depth = random(0.2, 0.8)
          this.generatedForms.push(form)
        }
      }
    },

    getRandomForm() {
      return random(this.forms)
    },
    tweakColor({ h, s, l }) {
      return {
        h: h + random(-2, 2),
        s: s + random(-2, 2),
        l: l + random(-2, 2),
      }
    },
    getRandomColor() {
      return this.getHslString(this.tweakColor(random(this.colors)))
    },
    generateColorPallet() {
      for (let i = 0; i < this.colorNumber; i++) {
        this.colors.push({
          h: this.baseColor.h + i * (360 / this.colorNumber),
          s: this.baseColor.s,
          l: this.baseColor.l,
        })
      }
    },
    getHslString({ h, s, l }) {
      return `hsl(${h.toFixed()}, ${s.toFixed()}%, ${l.toFixed()}%)`
    },
    setColorFromCss() {
      const baseColorValue = getComputedStyle(
        document.documentElement
      ).getPropertyValue(this.baseColorName)
      const result = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(
        baseColorValue
      )
      this.baseColor = {
        h: parseInt(result[1]),
        s: parseInt(result[2]),
        l: parseInt(result[3]),
      }
    },
    cross(width, height, strokeColor) {
      //console.log("soeo", strokeColor);
      const group = this.svg.group()
      group.line(0, height / 2, width, height / 2).stroke({
        width: this.strokeWidth,
        color: strokeColor,
        linecap: 'round',
      })
      group.line(width / 2, 0, width / 2, height).stroke({
        width: this.strokeWidth,
        color: strokeColor,
        linecap: 'round',
      })
      return group
    },
    cross2(width, height, strokeColor) {
      const group = this.svg.group()
      group.line(0, 0, width, height).stroke({
        width: this.strokeWidth,
        color: strokeColor,
        linecap: 'round',
      })
      group.line(width, 0, 0, height).stroke({
        width: this.strokeWidth,
        color: strokeColor,
        linecap: 'round',
      })
      return group
    },
    circle(width, height, strokeColor) {
      const group = this.svg.group()
      group.ellipse(width, height).fill('transparent').stroke({
        width: this.strokeWidth,
        color: strokeColor,
        linecap: 'round',
      })
      return group
    },
    flash(width, height, strokeColor) {
      width = height / 2
      const group = this.svg.group()
      group
        .polyline([
          [width * 0.45, 0],
          [0, height / 2],
          [width, height / 2],
          [width * 0.55, height],
        ])
        .fill('transparent')
        .stroke({
          width: this.strokeWidth,
          color: strokeColor,
          linecap: 'round',
        })
      return group
    },
    angle(width, height, color) {
      const group = this.svg.group()
      group
        .polyline([
          [width, 0],
          [0, 0],
          [0, height],
        ])
        .stroke({ width: this.strokeWidth, color, linecap: 'round' })
        .fill('transparent')
      return group
    },
  },
}
</script>

<style lang="scss"></style>
