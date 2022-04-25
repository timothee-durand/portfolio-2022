<template>

  <div
    id="app"
    :class="{
      'is-transitioning' : isTransitioning,
      'is-content-transition' : !keepTransitionElement && isTransitioning && !isDefaultTransition
    }"
  >
    <div class="default-transition-container">
      <svg
        ref="transitionElement"
        viewBox="0 0 130 130"
        xmlns="http://www.w3.org/2000/svg">
        <path
          ref="normalPath"
          d="M65 0L71.7943 0.356079L78.5143 1.42041L85.0861 3.18133L91.4379 5.61954L97.5 8.70835L103.206 12.4139L108.493 16.6956L113.304 21.5065L117.586 26.794L121.292 32.5L124.38 38.5621L126.819 44.9139L128.58 51.4857L129.644 58.2057L130 65L129.644 71.7943L128.58 78.5143L126.819 85.0861L124.38 91.4379L121.292 97.5L117.586 103.206L113.304 108.493L108.493 113.304L103.206 117.586L97.5 121.292L91.4379 124.38L85.0861 126.819L78.5143 128.58L71.7943 129.644L65 130L58.2057 129.644L51.4857 128.58L44.9139 126.819L38.5621 124.38L32.5 121.292L26.794 117.586L21.5065 113.304L16.6956 108.493L12.4139 103.206L8.70835 97.5L5.61954 91.4379L3.18133 85.0861L1.42041 78.5143L0.356079 71.7943L0 65L0.356079 58.2057L1.42041 51.4857L3.18133 44.9139L5.61954 38.5621L8.70835 32.5L12.4139 26.794L16.6956 21.5065L21.5065 16.6956L26.794 12.4139L32.5 8.70835L38.5621 5.61954L44.9139 3.18133L51.4857 1.42041L58.2057 0.356079L65 0Z"
          fill="#EFCB68" />
      </svg>
    </div>
    <my-header />
    <main class="content-container">
      <svg-background />
      <transition :css="false" @leave="leave" @enter="enter" mode="out-in">
        <router-view id="content" />
      </transition>
      <svg-background />
    </main>
    <my-footer />
  </div>
</template>
<style lang="scss">
.transition-svg {
  position: fixed;
  top: 50vh;
  left: 50vw;
}

.default-transition-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  pointer-events: none;

  svg {
    transform: scale(0);
  }
}


</style>
<script>
import { mapMutations } from "vuex";
import anime from "animejs";

export default {
  mounted() {
    this.setDarkMode();
  },
  data() {
    return {
      transitionElement: null,
      isTransitioning: false,
      keepTransitionElement: false,
      isDefaultTransition: false
    };
  },
  methods: {
    ...mapMutations({
      setDarkMode: "setDarkMode",
      setLightMode: "setLightMode"
    }),
    leave(el, done) {
      try {
        const lastLinkClicked = this.$store.state.transitionComponent && this.$store.state.transitionComponent.closest("a");
        let svg;
        if (!lastLinkClicked) {
          svg = this.$refs.transitionElement;
          this.isDefaultTransition = true;
        } else {
          svg = lastLinkClicked.querySelector("svg");
        }
        const { width } = svg.getBoundingClientRect();
        let factor;

        if (!this.isDefaultTransition) {
          factor = window.innerWidth / width * 3;

          if (lastLinkClicked && !lastLinkClicked.classList.contains("header-link")) {
            this.transitionElement = svg.cloneNode(true);
          } else {
            this.keepTransitionElement = true;
            this.transitionElement = svg;
          }
        } else {
          this.keepTransitionElement = true;
          this.transitionElement = svg;
          factor = 2;
        }


        anime({
          targets: svg,
          scale: factor,
          duration: 500,
          zIndex: 2000,
          easing: "easeOutQuad",
          begin: () => {
            this.isTransitioning = true;

          },
          complete: () => {
            this.$nuxt.$emit("pageLeaved")
            done();
          }
        });
      } catch (e) {
        console.error(e);
        done();
      }
    },
    enter(el, done) {
      try {
        if (!this.keepTransitionElement) {
          el.appendChild(this.transitionElement);
          this.transitionElement.classList.add("transition-svg");

          anime({
            targets: this.transitionElement,
            scale: [20, 0],
            zi: 2000,
            duration: 1000,
            easing: "easeInQuad",
            complete: () => {
              this.isTransitioning = false;
              this.transitionElement.remove();
              this.transitionElement = null;
              done();
            }
          });
          return;
        }

        anime({
          targets: this.transitionElement,
          scale: this.isDefaultTransition ? 0 : 1,
          zi: 2000,
          duration: 1000,
          easing: "easeInQuad",
          complete: () => {
            this.transitionElement.style.transform = "";
            this.isTransitioning = false;
            this.transitionElement = null;
            this.keepTransitionElement = false;
            this.isDefaultTransition = false;
            done();
          }
        });

      } catch (e) {
        console.error(e);
        done();
      }

      this.$store.commit("resetTransitionComponent");
    }
  }

};
</script>
