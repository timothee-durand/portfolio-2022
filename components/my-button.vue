<template>
  <nuxt-link
    :to="to"
    class="button"
    @mouseenter.native="mouseEnter"
    @mouseleave.native="mouseLeave"
    @click.native="setTransitionLink"
    :class="{ 'is-transition-link': this.isTransitionLink }"
  >
    <my-text tag="span" :type="textType" class="button--text">{{
      text
    }}</my-text>
    <svg
      ref="background"
      width="130"
      height="130"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        ref="normalPath"
        d="M65 0L71.7943 0.356079L78.5143 1.42041L85.0861 3.18133L91.4379 5.61954L97.5 8.70835L103.206 12.4139L108.493 16.6956L113.304 21.5065L117.586 26.794L121.292 32.5L124.38 38.5621L126.819 44.9139L128.58 51.4857L129.644 58.2057L130 65L129.644 71.7943L128.58 78.5143L126.819 85.0861L124.38 91.4379L121.292 97.5L117.586 103.206L113.304 108.493L108.493 113.304L103.206 117.586L97.5 121.292L91.4379 124.38L85.0861 126.819L78.5143 128.58L71.7943 129.644L65 130L58.2057 129.644L51.4857 128.58L44.9139 126.819L38.5621 124.38L32.5 121.292L26.794 117.586L21.5065 113.304L16.6956 108.493L12.4139 103.206L8.70835 97.5L5.61954 91.4379L3.18133 85.0861L1.42041 78.5143L0.356079 71.7943L0 65L0.356079 58.2057L1.42041 51.4857L3.18133 44.9139L5.61954 38.5621L8.70835 32.5L12.4139 26.794L16.6956 21.5065L21.5065 16.6956L26.794 12.4139L32.5 8.70835L38.5621 5.61954L44.9139 3.18133L51.4857 1.42041L58.2057 0.356079L65 0Z"
        fill="#EFCB68"
      />
      <defs>
        <path
          ref="animatedPath"
          d="M65 0L70.979 8.11335L78.5143 1.42041L82.6758 10.5996L91.4379 5.61954L93.6 15.4633L103.206 12.4139L103.274 22.4921L113.304 21.5065L111.276 31.3787L121.292 32.5L117.255 41.7347L126.819 44.9139L120.95 53.1075L129.644 58.2057L122.2 65L129.644 71.7943L120.95 76.8925L126.819 85.0861L117.255 88.2653L121.292 97.5L111.276 98.6213L113.304 108.493L103.274 107.508L103.206 117.586L93.6 114.537L91.4379 124.38L82.6758 119.4L78.5143 128.58L70.979 121.887L65 130L59.021 121.887L51.4857 128.58L47.3242 119.4L38.5621 124.38L36.4 114.537L26.794 117.586L26.7257 107.508L16.6956 108.493L18.7242 98.6213L8.70835 97.5L12.7452 88.2653L3.18133 85.0861L9.04996 76.8925L0.356079 71.7943L7.8 65L0.356079 58.2057L9.04996 53.1075L3.18133 44.9139L12.7452 41.7347L8.70835 32.5L18.7242 31.3787L16.6956 21.5065L26.7257 22.4921L26.794 12.4139L36.4 15.4633L38.5621 5.61954L47.3242 10.5996L51.4857 1.42041L59.021 8.11335L65 0Z"
          fill="#EFCB68"
        />
      </defs>
    </svg>
  </nuxt-link>
</template>
<script>
import anime from 'animejs'
import transition from '@/mixins/transition.js'

export default {
  name: 'MyButton',
  props: {
    to: {
      type: String,
      default: '/',
    },
    text: {
      type: String,
      default: 'About it',
    },
    textType: {
      type: String,
      default: 'small',
    },
  },
  mixins: [transition],
  mounted() {
    this.animation = anime({
      targets: this.$refs.normalPath,
      duration: 200,
      autoplay: false,
      easing: 'easeInOutQuad',
      d: this.$refs.animatedPath.getAttribute('d'),
    })
  },
  methods: {
    mouseEnter() {
      this.animation.play()
    },
    mouseLeave() {
      this.animation.reverse()
      this.animation.play()
      this.animation.finished.then(() => {
        this.animation.reverse()
      })
    },
  },
}
</script>
<style scoped lang="scss">
.button {
  display: grid;
  position: relative;
  padding: 1rem 2rem;
  background-color: var(--color-orange-yellow);
  max-width: max-content;
  border-radius: 20px;
  max-height: max-content;

  &--text {
    align-self: center;
    justify-self: center;
    grid-area: 1/-1;
    font-weight: bold;
    color: var(--color-rich-black);
  }

  svg {
    display: none;
    grid-area: 1/-1;
  }

  @media (min-width: 500px) {
    width: 13rem;
    height: 13rem;
    background-color: transparent;

    svg {
      display: block;
      position: relative;
    }

    &--text {
      z-index: 1;
      padding: 0.5rem;
      text-align: center;
      pointer-events: none;
      transition: opacity ease-out 100ms;
    }

    .is-transitioning {
      .button--text {
        opacity: 0;
      }
    }
  }
}
</style>
