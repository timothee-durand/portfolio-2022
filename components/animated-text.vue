<template>
  <my-text
    :tag="tag"
    :type="type"
    :color="color"
    :class="`animated-heading ${isInit ? 'is-init' : ''}`"
  >
    <span v-for="(span,i) in textSpans" :key="'span-' + i" class="word-container">
        <span v-html="span" :style="`--a-delay:${i};`"/>
    </span>
  </my-text>
</template>
<script>
export default {
  name: "AnimatedText",
  props: {
    text: {
      type: String,
      default: "Text"
    },
    tag: {
      type: String,
      default: "p"
    },
    type: {
      type: String,
      default: "default"
    },
    color: {
      type: String,
      default: "greys-black"
    }
  },
  data() {
    return {
      isInit: false
    };
  },
  computed: {
    textSpans() {
      return this.text.split("<br/>");
    }
  },
  mounted() {
    this.isInit = true
  },
  methods: {}
};
</script>
<style scoped lang="scss">
.animated-heading {
  display: inline;

  .word-container {
    overflow: hidden;
    display: inline-block;

    > span {
      display: inline-block;
      animation: hide-in cubic-bezier(0.39, 0.58, 0.57, 1) 400ms backwards paused;
      animation-delay: calc(var(--a-delay, 0) * 400ms + 300ms);
    }
  }

  &.is-init {
    .word-container > span {
      animation-play-state: running;
    }
  }
}

@keyframes hide-in {
  from {
    transform: translateY(100%);
  }
}
</style>
