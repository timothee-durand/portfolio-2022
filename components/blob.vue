<template>
  <div class="blob">
    <svg
      class="blob--svg"
      ref="blob"
      :style="{ width: `${width}rem`, height: `${height}rem` }"
    />
    <p class="blob--text">{{ text }}</p>
  </div>
</template>
<script lang="js">
import { SVG } from "@svgdotjs/svg.js";
import {gsap} from "gsap";
import { createCoordsTransformer, pointsInPath, random, spline } from "@/utils/generative-utils.js"
export default {
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
    text: {
      type: String,
      default: "text"
    }

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
    this.svg = SVG(this.$refs.blob).viewbox(0, 0, this.width, this.height);
    // this.$el.addEventListener("mouseenter", (e) => {
    //   this.$el.innerHTML = "";
    //   this.drawBlob();
    // });

    this.drawBlob();
  },
  methods: {
    drawBlob() {
      this.size = random(this.width / 2 * 0.5, this.width / 2 * 0.8);
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
      const path = this.svg
        .path(pathData)
        .fill("var(--color-orange-yellow)");
      console.log(path);
      this.createLiquidPath(path.node,  {
        detail: 40,
        tension: 2,
        close: true,
        range: {
          x: 20,
          y: 20
        },
        axis: ["y"]
      })
    },
    //from georges francis https://georgefrancis.dev/writing/create-a-liquid-hover-effect-with-gsap-and-svg/
    createLiquidPath(path, options) {
      const svgPoints = pointsInPath(path, options.detail);
      const originPoints = svgPoints.map(({ x, y }) => ({ x, y }));
      const liquidPoints = svgPoints.map(({ x, y }) => ({ x, y }));

      const mousePos = { x: 0, y: 0 };
      const transformCoords = createCoordsTransformer(path.closest("svg"));

      const pointDistance = Math.hypot(
        originPoints[0].x - originPoints[1].x,
        originPoints[0].y - originPoints[1].y
      );
      const maxDist = {
        x: options.axis.includes("x") ? pointDistance / 2 : 0,
        y: options.axis.includes("y") ? pointDistance / 2 : 0
      };

      gsap.ticker.add(() => {
        gsap.set(path, {
          attr: {
            d: spline(liquidPoints, options.tension, options.close)
          }
        });
      });

      window.addEventListener("mousemove", (e) => {
        const { x, y } = transformCoords(e);

        mousePos.x = x;
        mousePos.y = y;

        liquidPoints.forEach((point, index) => {
          const pointOrigin = originPoints[index];
          const distX = Math.abs(pointOrigin.x - mousePos.x);
          const distY = Math.abs(pointOrigin.y - mousePos.y);

          if (distX <= options.range.x && distY <= options.range.y) {
            const difference = {
              x: pointOrigin.x - mousePos.x,
              y: pointOrigin.y - mousePos.y
            };

            const target = {
              x: pointOrigin.x + difference.x,
              y: pointOrigin.y + difference.y
            };

            const x = gsap.utils.clamp(
              pointOrigin.x - maxDist.x,
              pointOrigin.x + maxDist.x,
              target.x
            );

            const y = gsap.utils.clamp(
              pointOrigin.y - maxDist.y,
              pointOrigin.y + maxDist.y,
              target.y
            );

            gsap.to(point, {
              x: x,
              y: y,
              ease: "sine",
              overwrite: true,
              duration: 0.175,
              onComplete() {
                gsap.to(point, {
                  x: pointOrigin.x,
                  y: pointOrigin.y,
                  ease: "elastic.out(1, 0.3)",
                  duration: 1.25
                });
              }
            });
          }
        });
      });
    }
  }
};
</script>

<style lang="scss">
.blob {
  position: relative;
}

.blob--text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-rich-black);
  width: 45%;
  text-align: center;
}
</style>
